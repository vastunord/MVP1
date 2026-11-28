import { isPreviewDatabase, previewStore } from "./preview-target.ts";
import { isProductionDatabase, productionStore } from "./production-target.ts";

export type AppEnvironment = "development" | "preview" | "production";

// In hosted functions the Blob SDK retrieves a rotating token from the Vercel
// request context. Only local CLI sessions receive it as an environment variable.
export function hasBlobIdentity(env: Record<string, string | undefined>) {
  return Boolean(
    env.VERCEL_OIDC_TOKEN ||
    (env.VERCEL === "1" &&
      env.VERCEL_ENV === env.APP_ENV &&
      ["preview", "production"].includes(env.APP_ENV || "") &&
      env.BLOB_STORE_ID),
  );
}
export type ServerConfig = {
  environment: AppEnvironment;
  databaseUrl?: string;
  migrationUrl?: string;
  blobStoreId?: string;
  uploadsEnabled: boolean;
};
export function readServerConfig(
  env: Record<string, string | undefined> = process.env,
): ServerConfig {
  const environment = env.APP_ENV || "development";
  if (!["development", "preview", "production"].includes(environment))
    throw new Error("Invalid APP_ENV");
  if (env.VERCEL_ENV && env.VERCEL_ENV !== environment)
    throw new Error("APP_ENV does not match Vercel environment");
  const databaseUrl = env.DATABASE_URL || undefined;
  const migrationUrl = env.DIRECT_DATABASE_URL || undefined;
  for (const url of [databaseUrl, migrationUrl]) {
    if (!url) continue;
    if (!URL.canParse(url)) throw new Error("Invalid PostgreSQL URL");
    const parsed = new URL(url);
    if (
      !["postgresql:", "postgres:"].includes(parsed.protocol) ||
      !parsed.hostname ||
      !parsed.username ||
      !parsed.pathname ||
      parsed.pathname === "/"
    )
      throw new Error("Invalid PostgreSQL URL");
  }
  if (
    environment !== "development" &&
    databaseUrl &&
    migrationUrl &&
    new URL(databaseUrl).hostname === new URL(migrationUrl).hostname &&
    databaseUrl === migrationUrl
  )
    throw new Error(
      "Runtime and migration URLs must be distinct outside development",
    );
  const uploadsEnabled = env.MEDIA_UPLOADS_ENABLED === "true";
  if (
    env.MEDIA_UPLOADS_ENABLED &&
    !["true", "false"].includes(env.MEDIA_UPLOADS_ENABLED)
  )
    throw new Error("Invalid MEDIA_UPLOADS_ENABLED");
  if (
    uploadsEnabled &&
    (!databaseUrl ||
      !env.BLOB_STORE_ID ||
      !(hasBlobIdentity(env) || env.BLOB_READ_WRITE_TOKEN))
  )
    throw new Error(
      "Uploads require the dedicated database, private Blob store, and server credential",
    );
  if (
    uploadsEnabled &&
    environment === "preview" &&
    (!isPreviewDatabase(databaseUrl) || env.BLOB_STORE_ID !== previewStore)
  )
    throw new Error("Preview private media target is unverified");
  if (uploadsEnabled && environment === "production" &&
      (env.VERCEL_ENV !== "production" || env.AUTH_ENABLED !== "true" ||
       !isProductionDatabase(databaseUrl) || env.BLOB_STORE_ID !== productionStore))
    throw new Error("Production private media target is unverified");
  return {
    environment: environment as AppEnvironment,
    databaseUrl,
    migrationUrl,
    blobStoreId: env.BLOB_STORE_ID || undefined,
    uploadsEnabled,
  };
}
