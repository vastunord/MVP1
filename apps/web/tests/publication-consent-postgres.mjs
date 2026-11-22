import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import {
  assetSharing,
  changeAssetSharing,
  consentChange,
  withdrawDeletedAsset,
} from "../src/server/asset-consent.ts";
import { sharingPolicy } from "../src/lib/publication-consent.ts";

const require = createRequire(import.meta.url);
const development = createRequire(
  createRequire(require.resolve("prisma/package.json")).resolve("@prisma/dev"),
);
const { PGlite } = development("@electric-sql/pglite");
const { PGLiteSocketServer } = development("@electric-sql/pglite-socket");

test("version-specific owner consent, channel separation, editorial withdrawal and deletion persist on isolated PostgreSQL", async () => {
  const memory = await PGlite.create();
  const socket = new PGLiteSocketServer({
    db: memory,
    host: "127.0.0.1",
    port: 0,
  });
  let db;
  try {
    for (const name of [
      "20261121_phase02c_initial",
      "20261121_phase02d_auth_projects",
    ]) {
      await memory.exec(
        await readFile(
          new URL(
            `../prisma/migrations/${name}/migration.sql`,
            import.meta.url,
          ),
          "utf8",
        ),
      );
    }
    await socket.start();
    db = new PrismaClient({
      adapter: new PrismaPg({
        host: "127.0.0.1",
        port: Number(socket.getServerConn().split(":").at(-1)),
        ssl: false,
        database: "postgres",
        user: "postgres",
        max: 1,
      }),
    });
    for (const id of ["owner", "colleague"])
      await db.user.create({ data: { id, email: id + "@example.invalid" } });
    await db.workspace.create({
      data: {
        id: "workspace",
        name: "Fixture",
        memberships: {
          create: [
            { userId: "owner", role: "OWNER" },
            { userId: "colleague", role: "MEMBER" },
          ],
        },
      },
    });
    await db.project.create({
      data: {
        id: "project",
        workspaceId: "workspace",
        name: "Private project",
      },
    });
    const create = (id, mimeType) =>
      db.asset.create({
        data: {
          id,
          workspaceId: "workspace",
          projectId: "project",
          ownerId: "owner",
          state: "VALIDATED",
          mimeType,
          byteSize: 42,
          privateObjectKey: "private/fixture/" + id,
        },
      });
    await create("photo", "image/jpeg");
    await create("clip", "video/mp4");
    const [photo] = await assetSharing(db, "owner", "photo");
    const [clip] = await assetSharing(db, "owner", "clip");
    const set = (user, asset, id, channel, grant) =>
      changeAssetSharing(
        db,
        user,
        asset,
        consentChange({ versionId: id, channel, grant, policy: sharingPolicy }),
      );
    assert.deepEqual(photo.grants, []);
    assert.equal(await db.assetVersion.count(), 0);
    assert.throws(() =>
      consentChange({
        versionId: photo.id,
        channel: "PINTEREST",
        grant: "true",
        policy: sharingPolicy,
      }),
    );
    assert.throws(() =>
      consentChange({
        versionId: photo.id,
        channel: "PINTEREST",
        grant: true,
        policy: "obsolete",
      }),
    );
    await assert.rejects(
      assetSharing(db, "colleague", "photo"),
      (e) => e.status === 404,
    );
    await assert.rejects(
      set("colleague", "photo", photo.id, "GALLERY", true),
      (e) => e.status === 404,
    );
    await assert.rejects(
      set("owner", "clip", photo.id, "YOUTUBE", true),
      (e) => e.status === 409,
    );
    await assert.rejects(
      set("owner", "photo", photo.id, "YOUTUBE", true),
      (e) => e.status === 409,
    );
    await set("owner", "photo", photo.id, "PINTEREST", true);
    await set("owner", "photo", photo.id, "PINTEREST", true);
    assert.equal(await db.consentGrant.count(), 1);
    assert.equal(await db.galleryItem.count(), 0);
    await set("owner", "photo", photo.id, "GALLERY", true);
    await set("owner", "clip", clip.id, "YOUTUBE", true);
    await db.galleryItem.create({
      data: {
        workspaceId: "workspace",
        assetVersionId: photo.id,
        state: "PUBLISHED",
      },
    });
    await db.editorialReview.create({
      data: {
        workspaceId: "workspace",
        assetVersionId: photo.id,
        reviewerId: "colleague",
        channel: "GALLERY",
        state: "APPROVED",
      },
    });
    await assert.rejects(
      set("colleague", "photo", photo.id, "GALLERY", false),
      (e) => e.status === 404,
    );
    await set("owner", "photo", photo.id, "GALLERY", false);
    assert.equal((await db.galleryItem.findFirst()).state, "WITHDRAWN");
    assert.equal((await db.editorialReview.findFirst()).state, "PENDING");
    assert.ok(
      (await db.consentGrant.findFirst({ where: { channel: "GALLERY" } }))
        .revokedAt,
    );
    assert.deepEqual((await assetSharing(db, "owner", "photo"))[0].grants, [
      "PINTEREST",
    ]);
    await set("owner", "photo", photo.id, "GALLERY", true);
    assert.equal((await db.galleryItem.findFirst()).state, "WITHDRAWN");
    await db.asset.update({
      where: { id: "photo" },
      data: { privateObjectKey: "private/fixture/new-version" },
    });
    const rows = await assetSharing(db, "owner", "photo");
    const replacement = rows.find((v) => v.current);
    assert.deepEqual(replacement.grants, []);
    assert.equal(replacement.version, 2);
    await assert.rejects(
      set("owner", "photo", photo.id, "GALLERY", true),
      (e) => e.status === 409,
    );
    await set("owner", "photo", photo.id, "PINTEREST", false);
    await set("owner", "photo", replacement.id, "GALLERY", true);
    assert.deepEqual((await assetSharing(db, "owner", "clip"))[0].grants, [
      "YOUTUBE",
    ]);
    await db.$transaction(async (tx) => {
      await tx.asset.update({
        where: { id: "photo" },
        data: { state: "DELETED" },
      });
      await withdrawDeletedAsset(tx, "photo");
    });
    assert.equal(
      await db.consentGrant.count({
        where: { assetVersion: { assetId: "photo" }, state: "GRANTED" },
      }),
      0,
    );
    assert.equal(
      await db.consentGrant.count({
        where: { assetVersion: { assetId: "clip" }, state: "GRANTED" },
      }),
      1,
    );
    assert.equal(
      await db.auditEvent.count({
        where: { action: "publication.consent.withdrawn" },
      }),
      2,
    );
  } finally {
    await db?.$disconnect();
    await socket.stop();
    await memory.close();
  }
});
