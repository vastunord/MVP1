import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import {
  PranaQuotaReached,
  reservePranaQuery,
} from "../src/server/prana-quota.ts";

const require = createRequire(import.meta.url);
const prisma = createRequire(require.resolve("prisma/package.json"));
const dev = createRequire(prisma.resolve("@prisma/dev"));
const { PGlite } = dev("@electric-sql/pglite");
const { PGLiteSocketServer } = dev("@electric-sql/pglite-socket");

test("Prana visitor and daily quotas commit together and expire at UTC midnight", async () => {
  const memory = await PGlite.create();
  const socket = new PGLiteSocketServer({
    db: memory,
    host: "127.0.0.1",
    port: 0,
  });
  let db;
  try {
    for (const migration of [
      "20261121_phase02c_initial",
      "20261121_phase02d_auth_projects",
    ]) {
      const file = new URL(
        "../prisma/migrations/" + migration + "/migration.sql",
        import.meta.url,
      );
      await memory.exec(await readFile(file, "utf8"));
    }
    await socket.start();
    const port = Number(socket.getServerConn().split(":").at(-1));
    db = new PrismaClient({
      adapter: new PrismaPg({
        host: "127.0.0.1",
        port,
        database: "postgres",
        user: "postgres",
        ssl: false,
        max: 1,
      }),
    });
    const day = new Date("2026-11-22T23:58:00Z");
    const reserve = (client, time = day) =>
      reservePranaQuery(db, "synthetic-key", client, 9, time);
    for (let n = 0; n < 8; n++) await reserve("visitor-a");
    await assert.rejects(reserve("visitor-a"), PranaQuotaReached);
    await reserve("visitor-b");
    await assert.rejects(reserve("visitor-c"), PranaQuotaReached);
    assert.equal(
      (
        await db.rateLimit.findUniqueOrThrow({
          where: { key: "prana:all:2026-11-22" },
        })
      ).count,
      9,
    );
    await reserve("visitor-a", new Date("2026-11-23T00:00:00Z"));
    assert.equal(await db.rateLimit.count(), 2);
    assert.equal(
      await db.rateLimit.count({ where: { key: { contains: "visitor-a" } } }),
      0,
    );
  } finally {
    await db?.$disconnect();
    await socket.stop();
    await memory.close();
  }
});
