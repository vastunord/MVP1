import type { PrismaClient } from "@/generated/prisma/client";

// Keep the paid campaign in one environment. Reads of existing jobs have
// their own readiness checks and remain available with dispatch switched off.
export async function controlledRenderingAllowanceReady(
  db: Pick<PrismaClient, "$queryRaw">,
  userId: string,
  env: Record<string, string | undefined> = process.env,
): Promise<boolean> {
  const campaignId = env.MNML_TEST_CAMPAIGN_ID;
  if (!userId || !campaignId || env.APP_ENV !== "production" ||
      env.VERCEL_ENV !== "production" || env.MNML_SUBMISSION_ENABLED !== "true")
    return false;
  try {
    const [row] = await db.$queryRaw<Array<{ ready: boolean }>>`
      SELECT has_any_column_privilege(current_user,'public."TestRenderCampaign"','UPDATE')
        AND has_table_privilege(current_user,'public."TestRenderAttempt"','SELECT')
        AND NOT EXISTS (SELECT FROM unnest(ARRAY['id','campaignId','userId','requestHash','reservedMicrousd','createdAt','state']) col
          WHERE NOT has_column_privilege(current_user,'public."TestRenderAttempt"',col,'INSERT'))
        AND has_column_privilege(current_user,'public."TestRenderAttempt"','state','UPDATE')
        AND has_column_privilege(current_user,'public."TestRenderAttempt"','settledMicrousd','UPDATE')
        AND EXISTS (SELECT 1 FROM "TestRenderCampaign" c
        JOIN "TestRenderTester" t ON t."campaignId"=c.id
        WHERE c.id=${campaignId} AND t."userId"=${userId}
        AND c.active AND c.model='v4.5-fast' AND c."startsAt" <= NOW() AND c."expiresAt" > NOW()
        AND c."perAttemptMicrousd"=99000 AND c."maxAttempts" <= 5 AND c."maxMicrousd" <= 495000
        AND (SELECT count(*) FROM "TestRenderAttempt" a WHERE a."campaignId"=c.id)
            < LEAST(c."maxAttempts", c."maxMicrousd"/99000)
        AND (SELECT count(*) FROM "TestRenderAttempt" a WHERE a."campaignId"=c.id AND a."userId"=t."userId")
            < LEAST(t."maxAttempts", t."maxMicrousd"/99000)) AS ready`;
    return row?.ready === true;
  } catch {
    return false;
  }
}
