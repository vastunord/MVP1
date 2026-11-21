import { apiError, requestContext } from "@/server/request-auth";

export async function POST(request: Request) {
  const ctx = await requestContext(request, true);
  if ("response" in ctx) return ctx.response;
  try {
    const space = await ctx.projects.getWorkspace(ctx.userId);
    await ctx.db.$transaction(async (tx) => {
      const changed = await tx.user.updateMany({
        where: { id: ctx.userId, deletionRequestedAt: null },
        data: { deletionRequestedAt: new Date() },
      });
      if (changed.count)
        await tx.auditEvent.create({
          data: {
            workspaceId: space.id,
            actorId: ctx.userId,
            action: "ACCOUNT_DELETION_REQUESTED",
            targetType: "User",
            targetId: ctx.userId,
          },
        });
    });
    return Response.json({ status: "request-recorded" }, { status: 202 });
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
