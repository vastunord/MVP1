import { createDatabase } from "@/server/db";
import { readServerConfig } from "@/server/config";
import { createPrismaMediaRepository } from "@/server/prisma-media-repository";
import { createVercelPrivateDriver } from "@/server/vercel-private-media";
import {
  isAuthorizedReconciliation,
  isAllowedReconciliationTarget,
  reconcileOrphanedObjects,
  reconcilePrivateMedia,
} from "@/server/media-reconciliation";
import { list } from "@vercel/blob";
import { mnmlConfig } from "@/server/mnml";
import { reconcileStudioOutput } from "@/server/studio-jobs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export async function GET(request: Request) {
  if (
    !isAuthorizedReconciliation(
      process.env,
      request.headers.get("authorization"),
    )
  )
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  let db: ReturnType<typeof createDatabase> | undefined;
  try {
    const config = readServerConfig();
    if (!config.databaseUrl || !config.blobStoreId)
      throw Error("Configuration unavailable");
    db = createDatabase();
    const client = db;
    const identity = await client.$queryRaw<
      Array<{ branch: string | null }>
    >`SELECT current_setting('neon.branch_id', true) AS branch`;
    if (
      !isAllowedReconciliationTarget(
        process.env.APP_ENV,
        identity[0]?.branch ?? undefined,
        config.blobStoreId,
      )
    )
      throw Error("Target mismatch");
    if (new URL(request.url).searchParams.get("task") === "renders") {
      const provider = mnmlConfig();
      if (!provider || !config.uploadsEnabled)
        return new Response(null, {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        });
      const progress = await reconcileStudioOutput(client, provider.key);
      return Response.json(progress, {
        headers: { "Cache-Control": "no-store" },
      });
    }
    const repo = createPrismaMediaRepository(client);
    const driver = createVercelPrivateDriver(process.env.BLOB_READ_WRITE_TOKEN);
    const result = await reconcilePrivateMedia({
      async list(cutoff, limit) {
        const rows = await client.asset.findMany({
          where: {
            origin: "USER",
            createdAt: { lt: cutoff },
            OR: [
              { state: "QUARANTINED" },
              {
                state: "PENDING",
                uploadIntent: { is: { expiresAt: { lt: cutoff } } },
              },
            ],
          },
          orderBy: { createdAt: "asc" },
          take: limit,
          select: {
            id: true,
            workspaceId: true,
            privateObjectKey: true,
            state: true,
          },
        });
        return rows.map((row) => ({
          id: row.id,
          workspaceId: row.workspaceId,
          objectKey: row.privateObjectKey,
          state: row.state as "PENDING" | "QUARANTINED",
        }));
      },
      async claim(row, cutoff) {
        if (row.state === "QUARANTINED")
          return Boolean(
            await client.asset.findFirst({
              where: {
                id: row.id,
                state: "QUARANTINED",
                createdAt: { lt: cutoff },
              },
              select: { id: true },
            }),
          );
        const result = await client.asset.updateMany({
          where: {
            id: row.id,
            state: "PENDING",
            createdAt: { lt: cutoff },
            uploadIntent: { is: { expiresAt: { lt: cutoff } } },
          },
          data: { state: "QUARANTINED" },
        });
        return result.count === 1;
      },
      removeObject: (key) => driver.remove(key),
      discard: (id) => repo.discardPending(id),
    });
    const cursor = new URL(request.url).searchParams.get("cursor") || undefined;
    if (cursor && cursor.length > 1024) throw Error("Invalid cursor");
    const orphans = await reconcileOrphanedObjects(
      {
        async listObjects(next, limit) {
          const page = await list({
            prefix: "private/",
            limit,
            cursor: next,
            token: process.env.BLOB_READ_WRITE_TOKEN,
          });
          return {
            objects: page.blobs.map((blob) => ({
              key: blob.pathname,
              uploadedAt: blob.uploadedAt,
            })),
            nextCursor: page.hasMore ? page.cursor : undefined,
          };
        },
        async stateFor(key) {
          const asset = await client.asset.findUnique({
            where: { privateObjectKey: key },
            select: { state: true },
          });
          return asset?.state ?? null;
        },
        removeObject: (key) => driver.remove(key),
      },
      new Date(),
      cursor,
    );
    return Response.json(
      { records: result, objects: orphans },
      {
        status: result.failed || orphans.failed ? 503 : 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch {
    return Response.json(
      { error: "Reconciliation unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  } finally {
    if (db) await db.$disconnect();
  }
}
