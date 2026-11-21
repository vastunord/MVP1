import { requestContext, apiError } from "@/server/request-auth";
import { createPrivateMedia } from "@/server/media";
import { createPrismaMediaRepository } from "@/server/prisma-media-repository";
import { createVercelPrivateDriver } from "@/server/vercel-private-media";
import { readServerConfig } from "@/server/config";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const ctx = await requestContext(request);
  if ("response" in ctx) return ctx.response;
  try {
    const config = readServerConfig();
    if (!config.uploadsEnabled)
      return Response.json(
        { error: "Private media is unavailable" },
        { status: 503 },
      );
    const space = await ctx.projects.getWorkspace(ctx.userId);
    const service = createPrivateMedia(
      createPrismaMediaRepository(ctx.db),
      createVercelPrivateDriver(process.env.BLOB_READ_WRITE_TOKEN),
    );
    const url = await service.authorizeDownload(
      { userId: ctx.userId, workspaceId: space.id },
      (await context.params).id,
    );
    return new Response(null, {
      status: 302,
      headers: { Location: url, "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
