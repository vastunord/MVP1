import { timingSafeEqual } from "node:crypto";

export type CleanupCandidate = {
  id: string;
  workspaceId: string;
  objectKey: string;
  state: "PENDING" | "QUARANTINED";
};
export type CleanupStore = {
  list(cutoff: Date, limit: number): Promise<CleanupCandidate[]>;
  claim(candidate: CleanupCandidate, cutoff: Date): Promise<boolean>;
  removeObject(key: string): Promise<void>;
  discard(id: string): Promise<void>;
};

export function isAllowedReconciliationTarget(
  environment: string | undefined,
  branch: string | undefined,
  store: string | undefined,
): boolean {
  return (
    (environment === "development" &&
      branch === "br-mute-resonance-bhea4dyx" &&
      store === "store_ejuJXLFGtH1tuh5b") ||
    (environment === "preview" &&
      branch === "br-summer-night-bh70tetr" &&
      store === "store_FqCkmEg47WkbeoRZ")
  );
}

export type OrphanStore = {
  listObjects(
    cursor: string | undefined,
    limit: number,
  ): Promise<{
    objects: { key: string; uploadedAt: Date }[];
    nextCursor?: string;
  }>;
  stateFor(key: string): Promise<string | null>;
  removeObject(key: string): Promise<void>;
};

export async function reconcileOrphanedObjects(
  store: OrphanStore,
  now: Date = new Date(),
  cursor?: string,
) {
  const result = {
    examined: 0,
    removed: 0,
    failed: 0,
    nextCursor: undefined as string | undefined,
  };
  const page = await store.listObjects(cursor, 20);
  result.nextCursor = page.nextCursor;
  for (const object of page.objects.slice(0, 20)) {
    result.examined++;
    if (
      !/^private\/[a-zA-Z0-9_-]+\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i.test(
        object.key,
      ) ||
      !Number.isFinite(object.uploadedAt.getTime()) ||
      object.uploadedAt.getTime() >= now.getTime() - 60 * 60_000
    )
      continue;
    try {
      const state = await store.stateFor(object.key);
      if (state === null || state === "DELETED") {
        await store.removeObject(object.key);
        result.removed++;
      }
    } catch {
      result.failed++;
    }
  }
  return result;
}

export function isAuthorizedReconciliation(
  env: Record<string, string | undefined>,
  authorization: string | null,
): boolean {
  if (
    env.MEDIA_RECONCILIATION_ENABLED !== "true" ||
    !["development", "preview"].includes(env.APP_ENV || "")
  )
    return false;
  if (env.VERCEL_ENV && env.VERCEL_ENV !== env.APP_ENV) return false;
  const secret = env.MEDIA_RECONCILIATION_SECRET;
  if (!secret || secret.length < 32 || !authorization?.startsWith("Bearer "))
    return false;
  const supplied = Buffer.from(authorization.slice(7));
  const expected = Buffer.from(secret);
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

export async function reconcilePrivateMedia(
  store: CleanupStore,
  now: Date = new Date(),
) {
  const cutoff = new Date(now.getTime() - 30 * 60_000);
  const rows = await store.list(cutoff, 20);
  const result = { examined: 0, removed: 0, skipped: 0, failed: 0 };
  for (const row of rows.slice(0, 20)) {
    result.examined++;
    const safeId =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        row.id,
      );
    const safeWorkspace = /^[a-zA-Z0-9_-]+$/.test(row.workspaceId);
    if (
      !safeId ||
      !safeWorkspace ||
      !["jpg", "png", "webp"].some(
        (ext) =>
          row.objectKey === `private/${row.workspaceId}/${row.id}.${ext}`,
      )
    ) {
      result.skipped++;
      continue;
    }
    try {
      if (!(await store.claim(row, cutoff))) {
        result.skipped++;
        continue;
      }
      await store.removeObject(row.objectKey);
      await store.discard(row.id);
      result.removed++;
    } catch {
      result.failed++;
    }
  }
  return result;
}
