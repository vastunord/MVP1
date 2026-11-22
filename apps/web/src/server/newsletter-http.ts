import "server-only";
import { isTrustedMutationOrigin } from "./auth-readiness";
import { createDatabase } from "./db";
import { requestBody } from "./request-auth";
import { newsletterStore } from "./prisma-newsletter-store";
import {
  consentRequest,
  newsletterSettings,
  requestConfirmation,
  subscriberFromToken,
  type NewsletterAction,
} from "./newsletter";
import { sendTransactionalEmail } from "./resend-delivery";

export const newsletterReply = (status: string, code: number) =>
  Response.json(
    { status },
    { status: code, headers: { "Cache-Control": "no-store" } },
  );

export async function newsletterPost(
  request: Request,
  action: NewsletterAction | "request",
) {
  const settings = newsletterSettings(process.env, action === "unsubscribe");
  if (!settings) return newsletterReply("unavailable", 503);
  if (!isTrustedMutationOrigin(request.headers.get("origin"), settings.origin))
    return newsletterReply("invalid-origin", 403);
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return newsletterReply("invalid", 400);
  let body: Record<string, unknown>;
  try {
    body = await requestBody(request);
  } catch {
    return newsletterReply("invalid", 400);
  }
  let db: ReturnType<typeof createDatabase> | undefined;
  try {
    if (action === "request") {
      const input = consentRequest(body);
      if (!input) return newsletterReply("invalid", 400);
      db = createDatabase();
      // Local integration clients share one bucket. Only trust Vercel's overwritten header on Vercel.
      const client =
        process.env.VERCEL === "1"
          ? request.headers
              .get("x-vercel-forwarded-for")
              ?.split(",")[0]
              .trim() || "shared"
          : "local";
      const result = await requestConfirmation(
        newsletterStore(db),
        sendTransactionalEmail,
        input,
        settings,
        client,
      );
      return result === "limited"
        ? newsletterReply("rate-limited", 429)
        : newsletterReply("check-email", 202);
    }
    const now = new Date();
    const id = subscriberFromToken(action, body.token, now, settings.secret);
    if (!id) return newsletterReply("invalid-link", 400);
    db = createDatabase();
    const applied = await newsletterStore(db).apply(action, id, now);
    return applied
      ? newsletterReply(
          action === "confirm" ? "confirmed" : "unsubscribed",
          200,
        )
      : newsletterReply("invalid-link", 400);
  } catch {
    return newsletterReply("unavailable", 503);
  } finally {
    await db?.$disconnect();
  }
}
