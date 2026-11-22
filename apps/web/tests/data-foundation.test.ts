import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createPrivateMedia,
  matchesMagic,
  type AssetRecord,
  type MediaRepository,
  type PrivateMediaDriver,
} from "../src/server/media.ts";
import { canPublish } from "../src/server/gallery-policy.ts";
import { readServerConfig } from "../src/server/config.ts";

const actor = { userId: "owner", workspaceId: "vastu-workspace" };
const other = { userId: "other", workspaceId: "other-workspace" };
function fixture(failPut = false, failRemove = false) {
  let asset: AssetRecord | null = null;
  let removed = false;
  const repo: MediaRepository = {
    async canEditProject(a, id) {
      return (
        a.userId === actor.userId &&
        a.workspaceId === actor.workspaceId &&
        id === "project"
      );
    },
    async findAsset(id) {
      return asset?.id === id ? asset : null;
    },
    async createPending(input) {
      asset = {
        id: input.id,
        workspaceId: input.actor.workspaceId,
        ownerId: input.actor.userId,
        origin: "USER",
        state: "PENDING",
        objectKey: input.objectKey,
        mimeType: input.contentType,
        byteSize: input.byteSize,
        uploadExpiresAt: input.expiresAt,
      };
    },
    async markValidated() {
      if (asset) asset.state = "VALIDATED";
    },
    async markQuarantined() {
      if (asset) asset.state = "QUARANTINED";
    },
    async markDeleted() {
      if (asset) asset.state = "DELETED";
    },
    async discardPending() {
      asset = null;
    },
  };
  const driver: PrivateMediaDriver = {
    async signPut(key) {
      return `signed-put:${key}`;
    },
    async signGet(key) {
      return `signed-get:${key}`;
    },
    async inspect() {
      return {
        contentType: "image/png",
        byteSize: 8,
        firstBytes: Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]),
      };
    },
    async remove() {
      if (failRemove) throw new Error("synthetic deletion failure");
      removed = true;
    },
    async put() {
      if (failPut) throw new Error("synthetic storage failure");
    },
  };
  return {
    media: createPrivateMedia(
      repo,
      driver,
      () => new Date("2026-11-21T12:00:00Z"),
    ),
    getAsset: () => asset,
    wasRemoved: () => removed,
  };
}

test("server upload denies other users and cleans a failed write", async () => {
  const bytes = Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const request = {
    projectId: "project",
    contentType: "image/png",
    byteSize: bytes.length,
    filename: "test.png",
  };
  const denied = fixture();
  await assert.rejects(
    denied.media.upload(other, request, bytes),
    /Project access denied/,
  );
  assert.equal(denied.getAsset(), null);
  const failed = fixture(true);
  await assert.rejects(
    failed.media.upload(actor, request, bytes),
    /Private upload failed/,
  );
  assert.equal(failed.getAsset(), null);
  assert.equal(failed.wasRemoved(), true);
  const failedCleanup = fixture(true, true);
  await assert.rejects(
    failedCleanup.media.upload(actor, request, bytes),
    /Private upload failed/,
  );
  assert.equal(failedCleanup.getAsset()?.state, "QUARANTINED");
  const valid = fixture();
  const { assetId } = await valid.media.upload(actor, request, bytes);
  assert.equal(valid.getAsset()?.state, "VALIDATED");
  await assert.rejects(
    valid.media.deleteOwned(other, assetId),
    /access denied/,
  );
  await valid.media.deleteOwned(actor, assetId);
  assert.equal(valid.getAsset()?.state, "DELETED");
  assert.equal(valid.wasRemoved(), true);
});

test("private media authorizes only project editors and accepted image metadata", async () => {
  const { media, getAsset } = fixture();
  const request = {
    projectId: "project",
    contentType: "image/png",
    byteSize: 8,
    filename: "room.png",
  };
  await assert.rejects(
    media.authorizeUpload(other, request),
    /Project access denied/,
  );
  await assert.rejects(
    media.authorizeUpload(actor, { ...request, contentType: "image/svg+xml" }),
    /Unsupported/,
  );
  await assert.rejects(
    media.authorizeUpload(actor, { ...request, byteSize: 21 * 1024 * 1024 }),
    /size/,
  );
  const ticket = await media.authorizeUpload(actor, request);
  assert.match(ticket.uploadUrl, /^signed-put:private\/vastu-workspace\//);
  assert.equal(getAsset()?.state, "PENDING");
  await assert.rejects(media.complete(other, ticket.assetId), /access denied/);
  await media.complete(actor, ticket.assetId);
  await assert.rejects(
    media.authorizeDownload(other, ticket.assetId),
    /access denied/,
  );
  assert.match(
    await media.authorizeDownload(actor, ticket.assetId),
    /^signed-get:private\//,
  );
});

test("media validation rejects a mismatched object and deletion revokes access", async () => {
  const { media, getAsset, wasRemoved } = fixture();
  const ticket = await media.authorizeUpload(actor, {
    projectId: "project",
    contentType: "image/jpeg",
    byteSize: 8,
    filename: "room.jpg",
  });
  await assert.rejects(
    media.complete(actor, ticket.assetId),
    /verification failed/,
  );
  assert.equal(getAsset()?.state, "QUARANTINED");
  await assert.rejects(
    media.authorizeDownload(actor, ticket.assetId),
    /access denied/,
  );
  assert.equal(wasRemoved(), false);
  assert.equal(
    matchesMagic(
      "image/png",
      Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10]),
    ),
    true,
  );
});

test("gallery requires rights, editorial review, and separate user consents", () => {
  const base = {
    origin: "USER" as const,
    assetState: "VALIDATED" as const,
    rightsVerified: true,
    activeConsentChannels: ["GALLERY"] as const,
    approvedReviewChannels: ["GALLERY", "PINTEREST"] as const,
    withdrawn: false,
  };
  const clip = {
    ...base,
    mimeType: "video/mp4",
    activeConsentChannels: ["GALLERY", "YOUTUBE"] as const,
    approvedReviewChannels: ["YOUTUBE"] as const,
  };
  assert.equal(canPublish(clip, "YOUTUBE"), true);
  assert.equal(
    canPublish({ ...clip, mimeType: "image/jpeg" }, "YOUTUBE"),
    false,
  );
  assert.equal(canPublish(base, "GALLERY"), true);
  assert.equal(canPublish(base, "PINTEREST"), false);
  assert.equal(
    canPublish(
      { ...base, activeConsentChannels: ["GALLERY", "PINTEREST"] },
      "PINTEREST",
    ),
    true,
  );
  assert.equal(canPublish({ ...base, withdrawn: true }, "GALLERY"), false);
  assert.equal(
    canPublish({ ...base, rightsVerified: false }, "GALLERY"),
    false,
  );
  assert.equal(
    canPublish({ ...base, approvedReviewChannels: [] }, "GALLERY"),
    false,
  );
});

test("a protected function uses request-scoped Blob identity with the pinned store", () => {
  const hosted = {
    APP_ENV: "preview",
    VERCEL_ENV: "preview",
    VERCEL: "1",
    MEDIA_UPLOADS_ENABLED: "true",
    DATABASE_URL:
      "postgresql://vastunord_preview_runtime:test@ep-frosty-violet-bhh19hyh-pooler.c-10.eu-central-1.aws.neon.tech/neondb?sslmode=require",
    BLOB_STORE_ID: "store_FqCkmEg47WkbeoRZ",
  };
  assert.equal(readServerConfig(hosted).uploadsEnabled, true);
  assert.throws(
    () => readServerConfig({ ...hosted, BLOB_STORE_ID: "other" }),
    /unverified/,
  );
  assert.throws(
    () => readServerConfig({ ...hosted, VERCEL: "" }),
    /credential/,
  );
});

test("cloud configuration remains closed without dedicated resources", () => {
  assert.equal(
    readServerConfig({ APP_ENV: "preview", MEDIA_UPLOADS_ENABLED: "false" })
      .uploadsEnabled,
    false,
  );
  assert.throws(
    () =>
      readServerConfig({
        APP_ENV: "production",
        MEDIA_UPLOADS_ENABLED: "true",
      }),
    /dedicated database/,
  );
  assert.throws(
    () =>
      readServerConfig({
        APP_ENV: "production",
        DATABASE_URL: "synthetic-malformed-secret-do-not-echo",
      }),
    (error: Error) =>
      error.message === "Invalid PostgreSQL URL" &&
      !error.message.includes("synthetic-malformed-secret-do-not-echo"),
  );
  assert.equal(
    readServerConfig({
      APP_ENV: "development",
      DATABASE_URL: "postgresql://runtime@dev.example/neondb",
      BLOB_STORE_ID: "store_dev",
      VERCEL_OIDC_TOKEN: "test-oidc-token",
      MEDIA_UPLOADS_ENABLED: "true",
    }).uploadsEnabled,
    true,
  );
});
