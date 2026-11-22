import { createHmac } from "node:crypto";
import type { PrismaClient } from "../generated/prisma/client";

export class PranaQuotaReached extends Error {}

export async function reservePranaQuery(
  db: PrismaClient,
  secret: string,
  client: string,
  dailyLimit: number,
  now = new Date(),
) {
  const day = now.toISOString().slice(0, 10);
  const dayStart = BigInt(Date.parse(day));
  const visitor = createHmac("sha256", secret)
    .update(day + "/" + client)
    .digest("hex");
  const quotas = [
    { key: "prana:all:" + day, limit: dailyLimit },
    { key: "prana:visitor:" + visitor, limit: Math.min(8, dailyLimit) },
  ];
  await db.$transaction(async (tx) => {
    await tx.rateLimit.deleteMany({
      where: { key: { startsWith: "prana:" }, lastRequest: { lt: dayStart } },
    });
    for (const { key, limit } of quotas) {
      const accepted = await tx.$queryRaw<
        { count: number }[]
      >`INSERT INTO "RateLimit" ("id","key","count","lastRequest")
        VALUES (${key},${key},1,${dayStart}) ON CONFLICT ("key") DO UPDATE SET "count"="RateLimit"."count"+1
        WHERE "RateLimit"."count" < ${limit} RETURNING "count"`;
      if (!accepted.length) throw new PranaQuotaReached();
    }
  });
}
