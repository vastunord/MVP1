import { requestContext, apiError } from "@/server/request-auth";
import { createPrivateMedia } from "@/server/media";
import { createPrismaMediaRepository } from "@/server/prisma-media-repository";
import { createVercelPrivateDriver } from "@/server/vercel-private-media";
import { readServerConfig } from "@/server/config";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const ctx = await requestContext(request, true);
  if ("response" in ctx) return ctx.response;
  try {
    if (!readServerConfig().uploadsEnabled)
      return Response.json(
        { error: "Private media is unavailable" },
        { status: 503 },
      );
    const space = await ctx.projects.getWorkspace(ctx.userId);
    const media = createPrivateMedia(
      createPrismaMediaRepository(ctx.db),
      createVercelPrivateDriver(process.env.BLOB_READ_WRITE_TOKEN),
    );
    await media.deleteOwned(
      { userId: ctx.userId, workspaceId: space.id },
      (await context.params).id,
    );
    return Response.json(
      { deleted: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
