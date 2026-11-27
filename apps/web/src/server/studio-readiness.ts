import type { PrismaClient } from "@/generated/prisma/client";

// A read-only preflight on the same connection that will record the provider job and its private result.
export async function studioPersistenceReady(
  db: Pick<PrismaClient, "$queryRaw">,
): Promise<boolean> {
  try {
    const [row] = await db.$queryRaw<Array<{ ready: boolean }>>`
      WITH permissions(rel,op,cols) AS (VALUES
        ('RenderJob','SELECT',ARRAY['id','workspaceId','projectId','toolId','sourceAssetId','outputAssetId','outputMedia','requestHash','submissionSettings','providerJobId','chargedUsd','refundedUsd','state','createdAt','updatedAt']),
        ('RenderJob','INSERT',ARRAY['id','workspaceId','projectId','toolId','sourceAssetId','outputAssetId','outputMedia','requestHash','submissionSettings','state','createdAt','updatedAt']),
        ('RenderJob','UPDATE',ARRAY['providerJobId','state','chargedUsd','refundedUsd','updatedAt']),
        ('Asset','SELECT',ARRAY['id','workspaceId','projectId','ownerId','origin','state','privateObjectKey','mimeType','byteSize','sha256','width','height','retentionUntil','createdAt']),
        ('Asset','INSERT',ARRAY['id','workspaceId','projectId','ownerId','origin','state','privateObjectKey','mimeType','byteSize','width','height','createdAt']),
        ('Workspace','SELECT',ARRAY['id','personalOwnerId']),
        ('Project','SELECT',ARRAY['id','workspaceId','archivedAt','deletedAt'])
      ),
      required AS (SELECT to_regclass(format('public.%I',rel)) AS relid,op,unnest(cols) AS col FROM permissions)
      SELECT has_schema_privilege(current_user,'public','USAGE')
        AND NOT EXISTS (SELECT 1 FROM required r LEFT JOIN pg_attribute a ON a.attrelid=r.relid AND a.attname=r.col AND NOT a.attisdropped
          WHERE a.attnum IS NULL OR NOT has_column_privilege(current_user,r.relid,a.attnum,r.op))
        AND EXISTS (SELECT 1 FROM pg_index i JOIN pg_attribute a ON a.attrelid=i.indrelid AND a.attnum=i.indkey[0]
          WHERE i.indrelid=to_regclass('public."RenderJob"') AND i.indisunique AND i.indisvalid AND i.indpred IS NULL
          AND i.indnkeyatts=1 AND a.attname='providerJobId') AS ready`;
    return row?.ready === true;
  } catch {
    return false;
  }
}
