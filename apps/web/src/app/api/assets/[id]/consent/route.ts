import { apiError, requestBody, requestContext } from "@/server/request-auth";
import {
  assetSharing,
  changeAssetSharing,
  consentChange,
} from "@/server/asset-consent";
import { readServerConfig } from "@/server/config";

type Context = { params: Promise<{ id: string }> };
async function respond(request: Request, context: Context, mutation: boolean) {
  if (!readServerConfig().uploadsEnabled)
    return Response.json(
      { error: "Private media unavailable" },
      { status: 503 },
    );
  const ctx = await requestContext(request, mutation);
  if ("response" in ctx) return ctx.response;
  try {
    const id = (await context.params).id;
    const versions = mutation
      ? await changeAssetSharing(
          ctx.db,
          ctx.userId,
          id,
          consentChange(await requestBody(request)),
        )
      : await assetSharing(ctx.db, ctx.userId, id);
    return Response.json(versions, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
export function GET(request: Request, context: Context) {
  return respond(request, context, false);
}
export function PATCH(request: Request, context: Context) {
  return respond(request, context, true);
}
