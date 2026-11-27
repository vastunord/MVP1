import type { Prisma } from "@/generated/prisma/client";
import { RenderError } from "./mnml.ts";

// Must be called inside the same transaction that creates the corresponding
// RenderJob. The campaign row serializes reservations across all app servers.
export async function reserveTestRender(
  tx: Prisma.TransactionClient,
  input: { campaignId: string; userId: string; id: string; requestHash: string; endpoint: string; model: unknown; count: unknown; quoteMicrousd: number },
) {
  if (input.endpoint !== "renders" || input.model !== "v4.5-fast" || input.count !== 1 || input.quoteMicrousd !== 99000)
    throw new RenderError(403, "Only the approved single-image test model is available");
  const campaigns = await tx.$queryRaw<Array<{ id: string; active: boolean; startsAt: Date; expiresAt: Date; model: string; maxAttempts: number; maxMicrousd: number; perAttemptMicrousd: number }>>`
    SELECT * FROM "TestRenderCampaign" WHERE "id"=${input.campaignId} FOR UPDATE`;
  const campaign = campaigns[0];
  if (!campaign || !campaign.active || campaign.model !== "v4.5-fast" || campaign.startsAt > new Date() || campaign.expiresAt <= new Date() || campaign.maxAttempts > 6 || campaign.maxMicrousd > 594000 || campaign.perAttemptMicrousd !== 99000)
    throw new RenderError(403, "Test campaign is unavailable");
  const tester = await tx.testRenderTester.findUnique({ where: { campaignId_userId: { campaignId: input.campaignId, userId: input.userId } } });
  if (!tester || tester.maxAttempts > 6 || tester.maxMicrousd > 594000)
    throw new RenderError(403, "Test rendering is unavailable for this account");
  const prior = await tx.testRenderAttempt.findUnique({ where: { id: input.id } });
  if (prior) {
    if (prior.campaignId !== input.campaignId || prior.userId !== input.userId || prior.requestHash !== input.requestHash)
      throw new RenderError(409, "Submission key conflicts with an existing attempt");
    return prior;
  }
  const all = await tx.testRenderAttempt.aggregate({ where: { campaignId: input.campaignId }, _count: true, _sum: { reservedMicrousd: true } });
  const own = await tx.testRenderAttempt.aggregate({ where: { campaignId: input.campaignId, userId: input.userId }, _count: true, _sum: { reservedMicrousd: true } });
  // Reservations are deliberately never released on timeout, cancellation or
  // refund; a refund does not replenish the owner's six-attempt authorization.
  if (all._count >= campaign.maxAttempts || own._count >= tester.maxAttempts || (all._sum.reservedMicrousd ?? 0) + input.quoteMicrousd > campaign.maxMicrousd || (own._sum.reservedMicrousd ?? 0) + input.quoteMicrousd > tester.maxMicrousd)
    throw new RenderError(429, "The test rendering allowance is exhausted");
  return tx.testRenderAttempt.create({ data: { id: input.id, campaignId: input.campaignId, userId: input.userId, requestHash: input.requestHash, reservedMicrousd: input.quoteMicrousd } });
}
