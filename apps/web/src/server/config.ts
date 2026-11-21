export type AppEnvironment = 'development' | 'preview' | 'production';
export type ServerConfig = { environment: AppEnvironment; databaseUrl?: string; migrationUrl?: string; blobStoreId?: string; uploadsEnabled: boolean };
export function readServerConfig(env: Record<string, string | undefined> = process.env): ServerConfig {
  const environment = env.APP_ENV || 'development';
  if (!['development', 'preview', 'production'].includes(environment)) throw new Error('Invalid APP_ENV');
  if (env.VERCEL_ENV && env.VERCEL_ENV !== environment) throw new Error('APP_ENV does not match Vercel environment');
  const databaseUrl = env.DATABASE_URL || undefined;
  const migrationUrl = env.DIRECT_DATABASE_URL || undefined;
  for (const url of [databaseUrl, migrationUrl]) {
    if (!url) continue;
    const parsed = new URL(url);
    if (!['postgresql:', 'postgres:'].includes(parsed.protocol) || !parsed.hostname || !parsed.username || !parsed.pathname || parsed.pathname === '/') throw new Error('Invalid PostgreSQL URL');
  }
  if (environment !== 'development' && databaseUrl && migrationUrl && new URL(databaseUrl).hostname === new URL(migrationUrl).hostname && databaseUrl === migrationUrl) throw new Error('Runtime and migration URLs must be distinct outside development');
  const uploadsEnabled = env.MEDIA_UPLOADS_ENABLED === 'true';
  if (env.MEDIA_UPLOADS_ENABLED && !['true','false'].includes(env.MEDIA_UPLOADS_ENABLED)) throw new Error('Invalid MEDIA_UPLOADS_ENABLED');
  if (uploadsEnabled && (!databaseUrl || !env.BLOB_STORE_ID || !(env.VERCEL_OIDC_TOKEN || env.BLOB_READ_WRITE_TOKEN))) throw new Error('Uploads require the dedicated database, private Blob store, and server credential');
  return {environment: environment as AppEnvironment,databaseUrl,migrationUrl,blobStoreId:env.BLOB_STORE_ID || undefined,uploadsEnabled};
}
