import type { Prisma } from "@/generated/prisma/client";

type ProviderStatement = {
  id: string;
  charged_usd?: number;
  refunded_usd?: number;
};

// The provider reports cumulative USD amounts. Parse decimal digits without
// rounding fractions of a microdollar into or out of the authorized price.
function micros(value: unknown): number | undefined {
  if (typeof value !== "number" && typeof value !== "string") return undefined;
  const match = /^(\d{1,4})(?:\.(\d{1,6}))?$/.exec(String(value));
  if (!match) return undefined;
  return Number(match[1]) * 1_000_000 + Number((match[2] ?? "").padEnd(6, "0"));
}

export async function applyRenderStatement(
  tx: Prisma.TransactionClient,
  id: string,
  statement: ProviderStatement,
) {
  if (statement.charged_usd == null && statement.refunded_usd == null) return;
  const [job] = await tx.$queryRaw<Array<{ charged: string | null; refunded: string | null }>>`
    SELECT "chargedUsd"::text AS charged, "refundedUsd"::text AS refunded
    FROM "RenderJob" WHERE id = ${id} AND "providerJobId" = ${statement.id} FOR UPDATE`;
  if (!job) return;
  const charge = micros(statement.charged_usd);
  const refund = micros(statement.refunded_usd);
  if ((statement.charged_usd != null && charge === undefined) ||
      (statement.refunded_usd != null && refund === undefined)) {
    // Preserve the accepted provider ID even if its accounting cannot yet
    // be verified. Recovery must read that same job rather than submit again.
    await tx.testRenderAttempt.updateMany({
      where: { id },
      data: { state: "UNCERTAIN", settledMicrousd: null },
    });
    return;
  }
  const gross = Math.max(micros(job.charged) ?? -1, charge ?? -1);
  const refunded = Math.max(micros(job.refunded) ?? 0, refund ?? 0);
  await tx.renderJob.update({ where: { id }, data: {
    chargedUsd: gross >= 0 ? gross / 1_000_000 : undefined,
    refundedUsd: refunded / 1_000_000,
  } });
  const attempt = await tx.testRenderAttempt.findUnique({ where: { id } });
  if (!attempt) return; // Legacy render, outside the controlled campaign.
  const valid = gross >= 0 && gross <= attempt.reservedMicrousd && refunded <= gross;
  await tx.testRenderAttempt.update({ where: { id }, data: {
    state: valid ? (refunded > 0 ? "REFUNDED" : "SETTLED") : "UNCERTAIN",
    settledMicrousd: valid ? gross - refunded : null,
  } });
}
