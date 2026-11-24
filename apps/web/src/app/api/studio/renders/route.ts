import { studioPersistenceReady } from "@/server/studio-readiness";
import { requestBody, requestContext, apiError } from "@/server/request-auth";
import { readServerConfig } from "@/server/config";
import {
  mnmlConfig,
  parseRender,
  RenderError,
  jobIdPattern,
} from "@/server/mnml";
import { startJob, syncJob, projectJobs } from "@/server/studio-jobs";

export const runtime = "nodejs";
export const maxDuration = 60;
const privateHeaders = { "Cache-Control": "private, no-store" };

async function handle(request: Request, write: boolean) {
  const provider = mnmlConfig();
  // Saved history must remain available when new provider requests are off or
  // the provider credential is unavailable. Writes still require a provider.
  if (!readServerConfig().uploadsEnabled || (write && !provider))
    return Response.json(
      { error: "Rendering unavailable" },
      { status: 503, headers: privateHeaders },
    );
  const ctx = await requestContext(request, write);
  if ("response" in ctx) return ctx.response;
  try {
    if (!(await studioPersistenceReady(ctx.db)))
      throw new RenderError(503, "Render storage is unavailable");
    const query = new URL(request.url).searchParams;
    const input = write ? await requestBody(request) : {};
    const id = write ? input.projectId : query.get("projectId");
    if (typeof id !== "string" || !id || id.length > 100)
      throw new RenderError(400, "Project required");
    const project = await ctx.projects.get(ctx.userId, id);
    if (project.archivedAt)
      throw new RenderError(409, "Restore the project to render");
    const space = await ctx.projects.getWorkspace(ctx.userId);
    const actor = { userId: ctx.userId, workspaceId: space.id };
    if (!write)
      return Response.json(
        await projectJobs(ctx.db, actor, id, query.get("toolId") || undefined),
        { headers: privateHeaders },
      );
    if (input.action === "status") {
      if (typeof input.id !== "string" || !jobIdPattern.test(input.id))
        throw new RenderError(400, "Invalid render ID");
      return Response.json(
        await syncJob(ctx.db, provider!.key, actor, id, input.id),
        { headers: privateHeaders },
      );
    }
    if (process.env.MNML_SUBMISSION_ENABLED !== "true")
      throw new RenderError(503, "New rendering is unavailable");
    const brief = parseRender(input);
    return Response.json(await startJob(ctx.db, provider!, actor, brief), {
      status: 202,
      headers: privateHeaders,
    });
  } catch (error) {
    if (error instanceof RenderError)
      return Response.json(
        { error: error.message },
        { status: error.status, headers: privateHeaders },
      );
    return apiError(error);
  } finally {
    await ctx.db.$disconnect();
  }
}
export function GET(request: Request) {
  return handle(request, false);
}
export function POST(request: Request) {
  return handle(request, true);
}
