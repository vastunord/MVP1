import { publicOrigin, publicIndexingEnabled } from "../lib/public-index.ts";
import { authBaseUrl } from "./auth-readiness.ts";
import { isPreviewDatabase } from "./preview-target.ts";

export function sitemapOrigin(env: Record<string, string | undefined>) {
  if (publicIndexingEnabled(env)) return publicOrigin;
  if (env.APP_ENV === "preview" && isPreviewDatabase(env.DATABASE_URL))
    return authBaseUrl(env);
  return undefined;
}
