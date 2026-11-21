import "server-only";
import {
  authReadiness,
  isTrustedMutationOrigin,
  verifiedSessionUserId,
} from "./auth-readiness";
import { createDatabase } from "./db";
import { prismaProjectStore } from "./prisma-project-store";
import { ProjectError, projectService } from "./projects";

export function apiError(error: unknown) {
  if (error instanceof ProjectError)
    return Response.json({ error: error.message }, { status: error.status });
  return Response.json({ error: "Service unavailable" }, { status: 503 });
}

export async function requestContext(request: Request, mutation = false) {
  if (!authReadiness().ready)
    return {
      response: Response.json(
        { error: "Authentication is not configured" },
        { status: 503 },
      ),
    };
  if (mutation) {
    const origin = request.headers.get("origin");
    if (!isTrustedMutationOrigin(origin, process.env.BETTER_AUTH_URL))
      return {
        response: Response.json(
          { error: "Invalid request origin" },
          { status: 403 },
        ),
      };
  }
  const { auth } = await import("./auth");
  const session = await auth.api.getSession({ headers: request.headers });
  const userId = verifiedSessionUserId(session);
  if (!userId)
    return {
      response: Response.json(
        { error: "Verified sign-in required" },
        { status: 401 },
      ),
    };
  const db = createDatabase();
  return { userId, db, projects: projectService(prismaProjectStore(db)) };
}

export async function requestBody(
  request: Request,
): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 16_384) throw new ProjectError(400, "Request too large");
  const reader = request.body?.getReader();
  if (!reader) throw new ProjectError(400, "Request body required");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const part = await reader.read();
    if (part.done) break;
    total += part.value.byteLength;
    if (total > 16_384) {
      await reader.cancel();
      throw new ProjectError(400, "Request too large");
    }
    chunks.push(part.value);
  }
  const raw = new TextDecoder().decode(Buffer.concat(chunks));
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new ProjectError(400, "Invalid JSON");
  }
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new ProjectError(400, "Invalid request body");
  return data as Record<string, unknown>;
}
