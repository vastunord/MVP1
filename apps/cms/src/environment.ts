export function cmsEnvironment(
  env: Record<string, string | undefined>,
  mode: "runtime" | "migration" = "runtime",
) {
  if (env.PAYLOAD_DROP_DATABASE === "true")
    throw new Error("Database destruction is disabled.");
  const migration = mode === "migration";
  if (!migration && env.VASTUNORD_CMS_MIGRATION_DATABASE_URL)
    throw new Error(
      "Keep the CMS migration credential in the protected operator context.",
    );
  const secret = env.VASTUNORD_CMS_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("Configure a dedicated CMS secret of at least 32 bytes.");
  }
  let connection: URL;
  try {
    connection = new URL(
      (migration
        ? env.VASTUNORD_CMS_MIGRATION_DATABASE_URL
        : env.VASTUNORD_CMS_DATABASE_URL) || "",
    );
  } catch {
    throw new Error("Configure the dedicated CMS database connection.");
  }
  const validHost =
    connection.hostname ===
      (migration
        ? env.VASTUNORD_CMS_DATABASE_HOST?.replace("-pooler.", ".")
        : env.VASTUNORD_CMS_DATABASE_HOST) &&
    connection.hostname.endsWith(".neon.tech");
  if (
    !validHost ||
    !["postgresql:", "postgres:"].includes(connection.protocol) ||
    connection.pathname !== "/vastunord_cms" ||
    connection.username !==
      (migration ? "vastunord_cms_migrator" : "vastunord_cms_runtime") ||
    (migration && connection.hostname.includes("-pooler.")) ||
    (!!connection.port && connection.port !== "5432") ||
    [...connection.searchParams.keys()].some(
      (key) => !["sslmode", "channel_binding"].includes(key),
    ) ||
    !connection.password ||
    !["require", "verify-full"].includes(
      connection.searchParams.get("sslmode") || "",
    )
  ) {
    throw new Error(
      "The CMS needs the pinned Neon host, dedicated role, CMS database and TLS.",
    );
  }
  return { connectionString: connection.toString(), secret };
}
