import { apiError, requestBody, requestContext } from "@/server/request-auth";
type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const ctx = await requestContext(request);
  if ("response" in ctx) return ctx.response;
  try {
    return Response.json(
      await ctx.projects.get(ctx.userId, (await context.params).id),
    );
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}

export async function PATCH(request: Request, context: Context) {
  const ctx = await requestContext(request, true);
  if ("response" in ctx) return ctx.response;
  try {
    const body = await requestBody(request);
    const id = (await context.params).id;
    const project =
      body.action === "archive"
        ? await ctx.projects.archive(ctx.userId, id)
        : body.action === "restore"
          ? await ctx.projects.restore(ctx.userId, id)
          : await ctx.projects.update(ctx.userId, id, {
              name: body.name,
              description: body.description,
            });
    return Response.json(project);
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}

export async function DELETE(request: Request, context: Context) {
  const ctx = await requestContext(request, true);
  if ("response" in ctx) return ctx.response;
  try {
    const body = await requestBody(request);
    return Response.json(
      await ctx.projects.remove(
        ctx.userId,
        (await context.params).id,
        body.confirmation,
      ),
    );
  } catch (error) {
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
