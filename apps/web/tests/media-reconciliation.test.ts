import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isAuthorizedReconciliation,
  isAllowedReconciliationTarget,
  reconcileOrphanedObjects,
  reconcilePrivateMedia,
  type CleanupCandidate,
  type CleanupStore,
} from "../src/server/media-reconciliation.ts";

test("reconciliation is disabled by default and cannot run in production", () => {
  const secret = "s".repeat(40);
  const base = {
    MEDIA_RECONCILIATION_ENABLED: "true",
    MEDIA_RECONCILIATION_SECRET: secret,
    APP_ENV: "development",
  };
  assert.equal(isAuthorizedReconciliation(base, `Bearer ${secret}`), true);
  assert.equal(
    isAuthorizedReconciliation(
      { ...base, APP_ENV: "production" },
      `Bearer ${secret}`,
    ),
    false,
  );
  assert.equal(
    isAuthorizedReconciliation(
      { ...base, VERCEL_ENV: "production" },
      `Bearer ${secret}`,
    ),
    false,
  );
  assert.equal(
    isAuthorizedReconciliation(
      { ...base, MEDIA_RECONCILIATION_ENABLED: "false" },
      `Bearer ${secret}`,
    ),
    false,
  );
  assert.equal(isAuthorizedReconciliation(base, "Bearer wrong"), false);
  assert.equal(isAuthorizedReconciliation(base, null), false);
});

test("reconciliation accepts only the paired Development or Preview resources", () => {
  assert.equal(
    isAllowedReconciliationTarget(
      "development",
      "br-mute-resonance-bhea4dyx",
      "store_ejuJXLFGtH1tuh5b",
    ),
    true,
  );
  assert.equal(
    isAllowedReconciliationTarget(
      "preview",
      "br-summer-night-bh70tetr",
      "store_FqCkmEg47WkbeoRZ",
    ),
    true,
  );
  assert.equal(
    isAllowedReconciliationTarget(
      "development",
      "br-summer-night-bh70tetr",
      "store_ejuJXLFGtH1tuh5b",
    ),
    false,
  );
  assert.equal(
    isAllowedReconciliationTarget(
      "preview",
      "br-summer-night-bh70tetr",
      "store_ejuJXLFGtH1tuh5b",
    ),
    false,
  );
  assert.equal(
    isAllowedReconciliationTarget(
      "production",
      "br-summer-night-bh70tetr",
      "store_FqCkmEg47WkbeoRZ",
    ),
    false,
  );
});

test("orphan scan only removes old generated keys without active asset records", async () => {
  const id = "80c7d7c8-7d98-4c44-9bd8-a2dd5bbfba16";
  const keys = [
    `private/a/${id}.png`,
    `private/b/${id}.png`,
    `private/c/${id}.png`,
    `private/d/${id}.png`,
    "private/a/unrelated.png",
  ];
  const now = new Date("2026-11-21T12:00:00Z");
  const old = new Date("2026-11-21T10:00:00Z");
  const removed: string[] = [];
  const result = await reconcileOrphanedObjects(
    {
      async listObjects(_cursor, limit) {
        assert.equal(limit, 20);
        return {
          objects: keys.map((key, i) => ({
            key,
            uploadedAt: i === 3 ? now : old,
          })),
          nextCursor: "next-page",
        };
      },
      async stateFor(key) {
        if (key === keys[0]) return null;
        if (key === keys[1]) return "DELETED";
        return "VALIDATED";
      },
      async removeObject(key) {
        removed.push(key);
      },
    },
    now,
  );
  assert.equal(result.examined, 5);
  assert.equal(result.removed, 2);
  assert.equal(result.nextCursor, "next-page");
  assert.deepEqual(removed, [keys[0], keys[1]]);
});

test("reconciliation is bounded, refuses unsafe keys, and is retryable", async () => {
  const id = "80c7d7c8-7d98-4c44-9bd8-a2dd5bbfba16";
  const valid: CleanupCandidate = {
    id,
    workspaceId: "workspace",
    objectKey: `private/workspace/${id}.png`,
    state: "PENDING",
  };
  const unsafe: CleanupCandidate = {
    ...valid,
    objectKey: "private/other/image.png",
  };
  let rows = [valid, unsafe],
    fail = true,
    removed = 0,
    discarded = 0,
    requested = 0;
  const store: CleanupStore = {
    async list(_cutoff, limit) {
      requested = limit;
      return rows;
    },
    async claim() {
      return true;
    },
    async removeObject() {
      if (fail) throw Error();
      removed++;
    },
    async discard() {
      discarded++;
      rows = [unsafe];
    },
  };
  const first = await reconcilePrivateMedia(
    store,
    new Date("2026-11-21T12:00:00Z"),
  );
  assert.deepEqual(first, { examined: 2, removed: 0, skipped: 1, failed: 1 });
  assert.equal(requested, 20);
  assert.equal(discarded, 0);
  fail = false;
  const second = await reconcilePrivateMedia(
    store,
    new Date("2026-11-21T12:00:00Z"),
  );
  assert.deepEqual(second, { examined: 2, removed: 1, skipped: 1, failed: 0 });
  assert.equal(removed, 1);
  assert.equal(discarded, 1);
  const third = await reconcilePrivateMedia(
    store,
    new Date("2026-11-21T12:00:00Z"),
  );
  assert.equal(third.removed, 0);
});
