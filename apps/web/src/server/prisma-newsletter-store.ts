import { randomUUID } from "node:crypto";
import type { Prisma, PrismaClient } from "@/generated/prisma/client";
import {
  consentVersion,
  hour,
  requestSource,
  type NewsletterStore,
} from "./newsletter.ts";

async function takeQuota(
  tx: Prisma.TransactionClient,
  key: string,
  limit: number,
  expiresAt: Date,
) {
  const rows = await tx.$queryRaw<{ count: number }[]>`
    INSERT INTO "NewsletterRateBucket" ("key","count","expiresAt") VALUES (${key},1,${expiresAt})
    ON CONFLICT ("key") DO UPDATE SET "count" = "NewsletterRateBucket"."count" + 1
    WHERE "NewsletterRateBucket"."count" < ${limit} RETURNING "count"`;
  return rows.length > 0;
}

export function newsletterStore(db: PrismaClient): NewsletterStore {
  return {
    reserve(input, now, window) {
      return db.$transaction(async (tx) => {
        await tx.newsletterRateBucket.deleteMany({
          where: { expiresAt: { lte: now } },
        });
        if (
          !(await takeQuota(tx, window.clientKey, 5, window.expiresAt)) ||
          !(await takeQuota(tx, window.globalKey, 60, window.expiresAt))
        )
          return { status: "limited" };
        const retryAfter = new Date(now.getTime() - hour / 6);
        // A single atomic reservation per address, including simultaneous first submissions.
        // Opted-out addresses keep their suppression record and can never be reactivated by this form.
        const rows = await tx.$queryRaw<{ id: string }[]>`
          INSERT INTO "NewsletterSubscriber"
            ("id","email","locale","consentVersion","source","requestedAt","lastAttemptAt")
          VALUES (${randomUUID()}::uuid,${input.email},${input.locale},${consentVersion},${requestSource},${now},${now})
          ON CONFLICT ("email") DO UPDATE SET "locale"=EXCLUDED."locale",
            "consentVersion"=EXCLUDED."consentVersion","requestedAt"=EXCLUDED."requestedAt","lastAttemptAt"=EXCLUDED."lastAttemptAt"
          WHERE "NewsletterSubscriber"."confirmedAt" IS NULL AND "NewsletterSubscriber"."unsubscribedAt" IS NULL
            AND ("NewsletterSubscriber"."lastAttemptAt" IS NULL OR "NewsletterSubscriber"."lastAttemptAt" < ${retryAfter})
          RETURNING "id"`;
        return rows[0]
          ? { status: "reserved", id: rows[0].id }
          : { status: "duplicate" };
      });
    },
    async releaseFailedAttempt(id, now) {
      await db.newsletterSubscriber.updateMany({
        where: {
          id,
          lastAttemptAt: now,
          confirmedAt: null,
          unsubscribedAt: null,
        },
        data: { lastAttemptAt: null },
      });
    },
    async apply(action, id, now) {
      if (action === "unsubscribe") {
        await db.newsletterSubscriber.updateMany({
          where: { id, unsubscribedAt: null },
          data: { unsubscribedAt: now },
        });
        return true; // Redemption is idempotent, including after later record erasure.
      }
      await db.newsletterSubscriber.updateMany({
        where: { id, confirmedAt: null, unsubscribedAt: null },
        data: { confirmedAt: now },
      });
      return Boolean(
        await db.newsletterSubscriber.findFirst({
          where: { id, confirmedAt: { not: null }, unsubscribedAt: null },
          select: { id: true },
        }),
      );
    },
  };
}
