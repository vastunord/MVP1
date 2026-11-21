import { apiError, requestBody, requestContext } from "@/server/request-auth";

export async function GET(request: Request) {
  const ctx = await requestContext(request);
  if ("response" in ctx) return ctx.response;
  try {
    return Response.json(await ctx.projects.getWorkspace(ctx.userId));
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}

export async function POST(request: Request) {
  const ctx = await requestContext(request, true);
  if ("response" in ctx) return ctx.response;
  try {
    const body = await requestBody(request);
    return Response.json(
      await ctx.projects.createWorkspace(ctx.userId, body.name),
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
