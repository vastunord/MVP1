import { PranaQuotaReached, reservePranaQuery } from "@/server/prana-quota";
import { isTrustedMutationOrigin } from "@/server/auth-readiness";
import { createDatabase } from "@/server/db";
import { requestBody } from "@/server/request-auth";
import {
  askPrana,
  obviousMisuse,
  pranaRedirect,
  pranaSettings,
  validQuestion,
} from "@/server/prana";
import { guides } from "@/components/workspace-experience-data";

export const runtime = "nodejs";
const reply = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const settings = pranaSettings(process.env);
  if (!settings) return reply({ status: "unavailable" }, 503);
  if (!isTrustedMutationOrigin(request.headers.get("origin"), settings.origin))
    return reply({ status: "forbidden" }, 403);
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    return reply({ status: "invalid" }, 415);
  let body;
  try {
    body = await requestBody(request);
  } catch {
    return reply({ status: "invalid" }, 400);
  }
  const { question, language } = body;
  if (!validQuestion(question) || (language !== "en" && language !== "nb-NO"))
    return reply({ status: "invalid" }, 400);
  if (obviousMisuse(question)) return reply(pranaRedirect("abuse", language));
  // Quotas are reserved together, before any paid call, across all app instances.
  const client =
    process.env.VERCEL === "1"
      ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
        "shared"
      : "local";
  let db: ReturnType<typeof createDatabase> | undefined;
  try {
    db = createDatabase();
    await reservePranaQuery(db, settings.secret, client, settings.dailyLimit);
  } catch (error) {
    return error instanceof PranaQuotaReached
      ? reply({ status: "limited" }, 429)
      : reply({ status: "unavailable" }, 503);
  } finally {
    await db?.$disconnect();
  }
  try {
    const index = language === "en" ? 1 : 0;
    const notes = guides.map((guide) => guide.body[index]).join("\n");
    return reply(
      await askPrana({
        question: question.trim(),
        language,
        key: settings.key,
        notes,
      }),
    );
  } catch {
    return reply({ status: "unavailable" }, 503);
  }
}
