import { controlledAcceptance, isTrustedMutationOrigin } from "./auth-readiness";
import { requestBody, requestContext } from "./request-auth";
import {
  askPrana,
  GroqLimitReached,
  obviousMisuse,
  pranaRedirect,
  pranaSettings,
  validQuestion,
} from "./prana";
import { guides } from "../components/workspace-experience-data";

function reply(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function answerTextRequest(
  request: Request,
  mode: "consult" | "improve",
) {
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
  if (
    !validQuestion(question, mode === "improve" ? 4000 : 600) ||
    (language !== "en" && language !== "nb-NO")
  )
    return reply({ status: "invalid" }, 400);
  try {
    if (controlledAcceptance()) {
      const context = await requestContext(request);
      if (context.response) return context.response;
    }
    const result = obviousMisuse(question)
      ? pranaRedirect("abuse", language)
      : await askPrana({
          question: question.trim(),
          language,
          key: settings.key,
          mode: mode === "improve" ? "improve" : undefined,
          notes:
            mode === "consult"
              ? guides
                  .map((guide) => guide.body[language === "en" ? 1 : 0])
                  .join("\n")
              : undefined,
        });
    return reply(
      result,
      mode === "improve" && result.kind !== "home" ? 422 : 200,
    );
  } catch (error) {
    return error instanceof GroqLimitReached
      ? reply({ status: "limited" }, 429)
      : reply({ status: "unavailable" }, 503);
  }
}
