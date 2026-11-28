import { apiError, requestBody, requestContext } from "@/server/request-auth";

export async function POST(request: Request) {
  const ctx = await requestContext(request, true);
  if ("response" in ctx) return ctx.response;
  try {
    const { locale } = await requestBody(request);
    const en = locale === "en";
    await ctx.projects.createWorkspace(ctx.userId, en ? "My workspace" : "Mitt arbeidsområde");
    const container = await ctx.projects.create(
      ctx.userId, en ? "Untitled workspace" : "Arbeidsområde uten navn", null,
      request.headers.get("idempotency-key"), true,
    );
    return Response.json(container, { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
