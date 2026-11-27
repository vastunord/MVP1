import { apiError, requestContext } from "@/server/request-auth";
import {
  createPrivateMedia,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/server/media";
import { createPrismaMediaRepository } from "@/server/prisma-media-repository";
import { createVercelPrivateDriver } from "@/server/vercel-private-media";
import { readServerConfig } from "@/server/config";
import sharp from "sharp";
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
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}

export async function POST(request: Request, context: Context) {
  const ctx = await requestContext(request, true);
  if ("response" in ctx) return ctx.response;
  try {
    if (!readServerConfig().uploadsEnabled)
      return Response.json(
        { error: "Private media is unavailable" },
        { status: 503 },
      );
    const projectId = (await context.params).id;
    await ctx.projects.get(ctx.userId, projectId);
    const space = await ctx.projects.getWorkspace(ctx.userId);
    const contentType = request.headers.get("content-type") || "";
    if (!IMAGE_TYPES.includes(contentType as (typeof IMAGE_TYPES)[number]))
      return Response.json(
        { error: "Unsupported image type" },
        { status: 400 },
      );
    const declared = Number(request.headers.get("content-length") || 0);
    if (
      !Number.isSafeInteger(declared) ||
      declared < 0 ||
      declared > MAX_IMAGE_BYTES
    )
      return Response.json({ error: "Image is too large" }, { status: 413 });
    const reader = request.body?.getReader();
    if (!reader)
      return Response.json({ error: "Image is required" }, { status: 400 });
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_IMAGE_BYTES) {
        await reader.cancel();
        return Response.json({ error: "Image is too large" }, { status: 413 });
      }
      chunks.push(part.value);
    }
    if (!size)
      return Response.json({ error: "Image is required" }, { status: 400 });
    const bytes = Buffer.concat(chunks);
    try {
      const image = sharp(bytes, {
        limitInputPixels: 16_000_000,
        failOn: "error",
      });
      const metadata = await image.metadata();
      const format: Record<string, string> = {
        "image/jpeg": "jpeg",
        "image/png": "png",
        "image/webp": "webp",
      };
      if (
        metadata.format !== format[contentType] ||
        !metadata.width ||
        !metadata.height ||
        (metadata.pages ?? 1) > 1
      )
        throw new Error("Invalid image");
      await image.stats();
    } catch {
      return Response.json({ error: "Invalid image" }, { status: 400 });
    }
    const media = createPrivateMedia(
      createPrismaMediaRepository(ctx.db),
      createVercelPrivateDriver(process.env.BLOB_READ_WRITE_TOKEN),
    );
    const result = await media.upload(
      { userId: ctx.userId, workspaceId: space.id },
      { projectId, contentType, byteSize: size, filename: "image" },
      bytes,
    );
    return Response.json(result, {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
