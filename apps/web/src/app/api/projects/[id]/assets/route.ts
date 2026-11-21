import { apiError, requestContext } from "@/server/request-auth";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const ctx = await requestContext(request);
  if ("response" in ctx) return ctx.response;
  try {
    const id = (await context.params).id;
    await ctx.projects.get(ctx.userId, id);
    const space = await ctx.projects.getWorkspace(ctx.userId);
    const rows = await ctx.db.asset.findMany({
      where: {
        projectId: id,
        workspaceId: space.id,
        ownerId: ctx.userId,
        state: "VALIDATED",
      },
      select: {
        id: true,
        mimeType: true,
        byteSize: true,
        width: true,
        height: true,
        createdAt: true,
      },
      take: 100,
      orderBy: { createdAt: "desc" },
    });
    return Response.json(
      rows.map((row) => ({ ...row, byteSize: Number(row.byteSize) })),
    );
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
