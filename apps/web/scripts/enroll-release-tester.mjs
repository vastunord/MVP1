// Operator-only. Reuse the historical authorization with one fixed identity.
// Runtime services cannot insert campaigns or testers.
export const releaseCampaignId = "mnml-674349-release-acceptance";
export class EnrollmentConflict extends Error {}

export async function enrollReleaseTester(db) {
  await db.query("BEGIN");
  try {
    await db.query("SET LOCAL search_path TO public, pg_catalog");
    await db.query('LOCK TABLE "TestRenderCampaign", "TestRenderTester", "TestRenderAttempt", "RenderJob" IN SHARE ROW EXCLUSIVE MODE NOWAIT');
    const {rows: users} = await db.query(`SELECT id FROM "User" WHERE email=$1 AND "emailVerified"=true
      AND "deletionRequestedAt" IS NULL FOR SHARE`, ["contact@vastu.no"]);
    if (users.length !== 1) throw new EnrollmentConflict("Verified acceptance account required");
    const userId = users[0].id;
    const { rows: campaigns } = await db.query(`SELECT id, "maxAttempts", "maxMicrousd", active AND model='v4.5-fast'
      AND "perAttemptMicrousd"=99000 AND "startsAt"<=NOW() AND "expiresAt">NOW()
      AND "maxAttempts"<=5 AND "maxMicrousd"<=495000 AS compatible FROM "TestRenderCampaign"`);
    if (campaigns.length > 1 || campaigns.some(row => row.id !== releaseCampaignId || !row.compatible))
      throw new EnrollmentConflict("Existing campaign requires reconciliation");
    const { rows: testers } = await db.query('SELECT "campaignId", "userId", "maxAttempts", "maxMicrousd" FROM "TestRenderTester"');
    const attemptsLimit = campaigns[0]?.maxAttempts ?? 5;
    const costLimit = campaigns[0]?.maxMicrousd ?? 495000;
    if (testers.length > 1 || testers.some(row => row.campaignId !== releaseCampaignId || row.userId !== userId ||
        row.maxAttempts > attemptsLimit || row.maxMicrousd > costLimit))
      throw new EnrollmentConflict("Existing enrollment requires reconciliation");
    // Every Production attempt must resolve to its owned job and reservation.
    // Job 674349 is already conservatively excluded from the available five.
    const {rows:[history]} = await db.query(`SELECT count(*)::int AS held,
      COALESCE(sum(a."reservedMicrousd"),0)::int AS reserved,
      count(*) FILTER (WHERE a.state IN ('UNCERTAIN','RESERVED'))::int AS unresolved,
      COALESCE(bool_and(a."campaignId"=$1 AND a."userId"=$2 AND a."reservedMicrousd"=99000
        AND j.id IS NOT NULL AND j."requestHash" IS NOT DISTINCT FROM a."requestHash"
        AND w."personalOwnerId" IS NOT DISTINCT FROM $2 AND j."outputMedia"='image'),true) AS consistent,
      NOT EXISTS (SELECT FROM "RenderJob" other WHERE other."providerJobId" IS DISTINCT FROM '674349'
        AND NOT EXISTS (SELECT FROM "TestRenderAttempt" attached WHERE attached.id=other.id)) AS traceable
      FROM "TestRenderAttempt" a LEFT JOIN "RenderJob" j ON j.id=a.id LEFT JOIN "Workspace" w ON w.id=j."workspaceId"`,
      [releaseCampaignId, userId]);
    if (!history.consistent || !history.traceable || (history.held && !testers.length) ||
        history.held > (testers[0]?.maxAttempts ?? attemptsLimit) || history.reserved > (testers[0]?.maxMicrousd ?? costLimit))
      throw new EnrollmentConflict("Existing render reservations or jobs require reconciliation");
    if (campaigns.length === 0) await db.query(`INSERT INTO "TestRenderCampaign"
      (id,model,active,"startsAt","expiresAt","maxAttempts","maxMicrousd","perAttemptMicrousd")
      VALUES ($1,'v4.5-fast',true,NOW(),NOW()+interval '24 hours',5,495000,99000)`, [releaseCampaignId]);
    if (testers.length === 0) await db.query(`INSERT INTO "TestRenderTester" ("campaignId","userId","maxAttempts","maxMicrousd")
      VALUES ($1,$2,$3,$4)`, [releaseCampaignId,userId,attemptsLimit,costLimit]);
    await db.query("COMMIT");
    return {campaignId:releaseCampaignId, enrolled:true, createdCampaign:!campaigns.length, retainedAttempts:history.held,
      unresolved:history.unresolved, reservedMicrousd:history.reserved};
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
}
