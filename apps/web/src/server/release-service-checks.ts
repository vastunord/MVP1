import { authReadiness } from "./auth-readiness.ts";
import { readServerConfig } from "./config.ts";
import { pranaSettings } from "./prana.ts";

export const approvedSender = (sender?: string) =>
  /^(?:no-reply@vastu\.no|[^<>\r\n]+<no-reply@vastu\.no>)$/i.test(sender?.trim() || "");

// Labels only. Build/runtime logs never receive provider credentials or URLs.
export function releaseServiceChecks(env: Record<string, string | undefined>) {
  const checks: Record<string, boolean> = {};
  if (env.AUTH_ENABLED === "true") {
    checks.authentication = authReadiness(env).ready;
    checks.sender = approvedSender(env.AUTH_EMAIL_FROM);
  }
  if (env.GOOGLE_OAUTH_ENABLED === "true")
    checks.google = checks.authentication === true && authReadiness(env).providers.includes("google");
  if (env.PRANA_ENABLED === "true")
    checks.prana = checks.authentication === true && Boolean(pranaSettings(env));
  if (env.MEDIA_UPLOADS_ENABLED === "true") {
    try { checks.privateMedia = checks.authentication === true && readServerConfig(env).uploadsEnabled; }
    catch { checks.privateMedia = false; }
  }
  if (env.MNML_RENDERING_ENABLED === "true")
    checks.rendering = checks.privateMedia === true && Boolean((env.MNMLAPI || env.MNML_API_KEY)?.trim());
  if (env.MNML_SUBMISSION_ENABLED === "true")
    checks.controlledSubmission = checks.rendering === true && Boolean(env.MNML_TEST_CAMPAIGN_ID?.trim());
  return checks;
}
