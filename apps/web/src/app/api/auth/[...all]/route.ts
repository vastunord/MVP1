import { toNextJsHandler } from "better-auth/next-js";
import { authReadiness } from "@/server/auth-readiness";

async function handle(request: Request) {
  if (!authReadiness().ready)
    return Response.json(
      { error: "Authentication is not configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  const { auth } = await import("@/server/auth");
  const handler = toNextJsHandler(auth);
  return request.method === "GET"
    ? handler.GET(request)
    : handler.POST(request);
}

export const GET = handle;
export const POST = handle;
