import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import { test } from "node:test";
import { buildConfig, getPayload } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { Articles, Staff, bootstrapStaff } from "../src/collections.ts";
import { publishedArticle } from "../src/published.ts";

import * as initial from "../src/migrations/20261122_141146_initial_editorial.ts";

const web = createRequire(new URL("../../web/package.json", import.meta.url));
const prisma = createRequire(web.resolve("prisma/package.json"));
const development = createRequire(prisma.resolve("@prisma/dev"));
const { PGlite } = development("@electric-sql/pglite");
const { PGLiteSocketServer } = development("@electric-sql/pglite-socket");

test(
  "real local Payload draft, review, publication and withdrawal on isolated PostgreSQL",
  { timeout: 120000 },
  async () => {
    const memory = await PGlite.create();
    const socket = new PGLiteSocketServer({
      db: memory,
      host: "127.0.0.1",
      port: 0,
    });
    let payload;
    try {
      await socket.start();
      const port = Number(socket.getServerConn().split(":").at(-1));
      assert.ok(port > 0);
      const cfg = buildConfig({
        secret: randomBytes(32).toString("hex"),
        logger: { options: { level: "silent" } },
        telemetry: false,
        admin: { user: "staff", disable: true },
        typescript: { autoGenerate: false },
        collections: [Staff, Articles],
        db: postgresAdapter({
          pool: {
            host: "127.0.0.1",
            database: "postgres",
            user: "postgres",
            port,
            max: 1,
          },
          push: false,
          disableCreateDatabase: true,
        }),
      });
      payload = await getPayload({ config: cfg });
      await initial.up({ db: payload.db.drizzle });
      const account = (role) => ({
        email: role + "@example.invalid",
        password: randomBytes(24).toString("base64url"),
        role,
      });
      const editorInput = account("editor");
      const publisherInput = account("publisher");
      await assert.rejects(
        payload.create({
          collection: "staff",
          data: account("administrator"),
          overrideAccess: true,
        }),
      );
      const admin = {
        ...(await payload.create({
          collection: "staff",
          data: account("administrator"),
          context: { [bootstrapStaff]: true },
        })),
        collection: "staff",
      };
      const staff = async (input) => ({
        ...(await payload.create({
          collection: "staff",
          data: input,
          user: admin,
          overrideAccess: false,
        })),
        collection: "staff",
      });
      const editor = await staff(editorInput);
      const publisher = await staff(publisherInput);
      const changed = await payload.update({
        collection: "staff",
        id: editor.id,
        user: editor,
        overrideAccess: false,
        data: { role: "administrator" },
      });
      assert.equal(changed.role, "editor");
      const nb = {
        title: "Leselys",
        summary: "Velg lys til stolen.",
        body: "Prøv lyset ved stolen.",
        alt: "Et lyst rom.",
      };
      const en = {
        title: "Reading light",
        summary: "Choose a reading light.",
        body: "Test the lamp from the chair.",
        alt: "A light room.",
      };
      const data = {
        slug: "reading-light",
        nb,
        en,
        sourceNote: "Fixture verification",
        cover: "/reference/editorial/home-close.webp",
        review: "drafting",
        _status: "draft",
      };
      const make = await payload.create({
        collection: "articles",
        data,
        draft: true,
        user: editor,
        overrideAccess: false,
      });
      const update = (user, data, draft = false) =>
        payload.update({
          collection: "articles",
          id: make.id,
          user,
          data,
          draft,
          overrideAccess: false,
        });
      assert.equal(await publishedArticle(payload, data.slug, "en"), null);
      await assert.rejects(
        payload.find({
          collection: "articles",
          draft: true,
          overrideAccess: false,
        }),
      );
      await assert.rejects(update(editor, { _status: "published" }));
      await assert.rejects(
        update(publisher, { _status: "published", rightsConfirmed: true }),
      );
      await update(editor, { review: "submitted", _status: "draft" }, true);
      await assert.rejects(update(publisher, { _status: "published" }));
      await update(publisher, { _status: "published", rightsConfirmed: true });
      for (const [locale, copy] of [
        ["en", en],
        ["nb", nb],
      ]) {
        const live = await publishedArticle(payload, data.slug, locale);
        assert.equal(live.title, copy.title);
        assert.equal(live.body, copy.body);
        assert.ok(!Object.hasOwn(live, "sourceNote"));
        assert.ok(!Object.hasOwn(live, "rightsConfirmed"));
      }
      await assert.rejects(
        update(editor, {
          _status: "published",
          en: { ...en, body: "Unreviewed" },
        }),
      );
      await update(publisher, { _status: "draft", review: "drafting" });
      assert.equal(await publishedArticle(payload, data.slug, "en"), null);
      const versions = await payload.findVersions({
        collection: "articles",
        user: publisher,
        overrideAccess: false,
      });
      assert.ok(versions.totalDocs >= 2);
    } finally {
      if (payload) {
        await payload.destroy();
        await payload.db.pool.end();
      }
      await socket.stop();
      await memory.close();
    }
  },
);
