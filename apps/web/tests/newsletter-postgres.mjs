import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { newsletterStore } from "../src/server/prisma-newsletter-store.ts";
import {
  consentVersion,
  hour,
  requestConfirmation,
  requestSource,
  subscriberFromToken,
} from "../src/server/newsletter.ts";

// Use the embedded PostgreSQL shipped with our pinned Prisma development tools.
// This fixture never reads DATABASE_URL or connects to a pre-existing database.
const require = createRequire(import.meta.url);
const prisma = createRequire(require.resolve("prisma/package.json"));
const development = createRequire(prisma.resolve("@prisma/dev"));
const { PGlite } = development("@electric-sql/pglite");
const { PGLiteSocketServer } = development("@electric-sql/pglite-socket");

test("newsletter DDL, consent, withdrawal, retry and rate limits work in isolated PostgreSQL", async () => {
  const memory = await PGlite.create();
  const socket = new PGLiteSocketServer({
    db: memory,
    host: "127.0.0.1",
    port: 0,
  });
  let db;
  try {
    const ddl = new URL(
      "../prisma/migrations/20261122_phase01_newsletter/migration.sql",
      import.meta.url,
    );
    await memory.exec(await readFile(ddl, "utf8"));
    await socket.start();
    const port = socket.getServerConn().split(":").at(-1);
    assert.match(port, /^[1-9]\d*$/);
    db = new PrismaClient({
      adapter: new PrismaPg({
        host: "127.0.0.1",
        port: Number(port),
        database: "postgres",
        user: "postgres",
        max: 1,
        ssl: false,
      }),
    });
    const store = newsletterStore(db);
    const settings = {
      origin: "http://127.0.0.1:3100",
      secret: randomBytes(32).toString("hex"),
    };
    const input = { email: "subscriber@example.invalid", locale: "en" };
    const now = new Date("2026-11-22T12:00:00Z");
    const messages = [];
    const send = async (recipient, subject, text) => {
      messages.push({ recipient, subject, text });
    };
    const request = (client, address = input, date = now) =>
      requestConfirmation(store, send, address, settings, client, date);

    assert.equal(await request("visitor"), "requested");
    assert.equal(await request("visitor"), "duplicate");
    const row = await db.newsletterSubscriber.findUniqueOrThrow({
      where: { email: input.email },
    });
    assert.equal(row.source, requestSource);
    assert.equal(row.consentVersion, consentVersion);
    assert.equal(row.locale, input.locale);
    assert.deepEqual(row.requestedAt, now);
    assert.equal(row.confirmedAt, null);
    assert.equal(row.unsubscribedAt, null);
    assert.equal(messages.length, 1);

    const links = messages[0].text
      .split("\n")
      .filter((line) => line.startsWith(settings.origin))
      .map((line) => new URL(line));
    for (const action of ["confirm", "unsubscribe"]) {
      const link = links.find((item) => item.pathname.endsWith("/" + action));
      assert.ok(link);
      const id = subscriberFromToken(
        action,
        link.hash.slice(1),
        now,
        settings.secret,
      );
      assert.equal(id, row.id);
      assert.equal(await store.apply(action, id, now), true);
      assert.equal(await store.apply(action, id, now), true);
    }
    assert.equal(await store.apply("confirm", row.id, now), false);
    assert.equal(await request("other"), "duplicate");
    assert.equal(messages.length, 1);

    const retry = { ...input, email: "retry@example.invalid" };
    await assert.rejects(
      requestConfirmation(
        store,
        async () => {
          throw Error("fixture delivery failure");
        },
        retry,
        settings,
        "retry",
        now,
      ),
      /unavailable/,
    );
    assert.equal(await request("retry", retry), "requested");
    for (let count = 0; count < 5; count++)
      assert.equal(await request("bounded"), "duplicate");
    assert.equal(await request("bounded"), "limited");
    assert.equal(
      await request("bounded", input, new Date(+now + hour)),
      "duplicate",
    );
    const parallel = { email: "parallel@example.invalid", locale: "nb-NO" };
    const beforeParallel = messages.length;
    const concurrent = await Promise.all(
      Array.from({ length: 4 }, (_, index) => request(`parallel-${index}`, parallel)),
    );
    assert.equal(concurrent.filter((outcome) => outcome === "requested").length, 1);
    assert.equal(concurrent.filter((outcome) => outcome === "duplicate").length, 3);
    assert.equal(messages.length, beforeParallel + 1, "parallel requests send one synthetic confirmation");
    const reserved = await db.newsletterSubscriber.findUniqueOrThrow({ where: { email: parallel.email } });
    assert.equal(reserved.locale, "nb-NO");
    assert.equal(await request("parallel-retry", parallel, new Date(+now + hour / 6 + 1)), "requested");
    const retried = await db.newsletterSubscriber.findUniqueOrThrow({ where: { email: parallel.email } });
    assert.equal(retried.id, reserved.id, "retry reuses the existing pending subscriber");
    assert.equal(messages.length, beforeParallel + 2);
    assert.equal(await db.newsletterSubscriber.count(), 3);
  } finally {
    await db?.$disconnect();
    await socket.stop();
    await memory.close();
  }
});
