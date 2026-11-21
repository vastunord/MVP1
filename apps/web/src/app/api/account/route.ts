import { apiError, requestContext } from "@/server/request-auth";

export async function GET(request: Request) {
  const ctx = await requestContext(request);
  if ("response" in ctx) return ctx.response;
  try {
    const row = await ctx.db.user.findUnique({
      where: { id: ctx.userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        deletionRequestedAt: true,
      },
    });
    return Response.json(row);
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
