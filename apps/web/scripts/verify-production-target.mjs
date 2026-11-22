// The existing demo can build with private services closed. A release enabling
// them must prove that the actual protected Vercel configuration is usable.
import pg from "pg";
import {
  isProductionDatabase,
  productionRuntimeRole,
} from "../src/server/production-target.ts";
if (process.env.VERCEL_ENV === "production") {
  const url = process.env.DATABASE_URL;
  const enabled = [
    "AUTH_ENABLED",
    "MEDIA_UPLOADS_ENABLED",
    "MEDIA_RECONCILIATION_ENABLED",
    "PRANA_ENABLED",
    "MNML_RENDERING_ENABLED",
    "NEWSLETTER_ENABLED",
  ].some((key) => process.env[key] === "true");
  let verified = false;
  if (isProductionDatabase(url)) {
    const parsed = new URL(url);
    const db = new pg.Client({
      host: parsed.hostname,
      database: "neondb",
      user: productionRuntimeRole,
      password: decodeURIComponent(parsed.password),
      ssl: { rejectUnauthorized: true },
      connectionTimeoutMillis: 6000,
      statement_timeout: 4000,
      application_name: "vastunord-release-readiness",
    });
    try {
      await db.connect();
      await db.query("BEGIN READ ONLY");
      const {
        rows: [r],
      } = await db.query(
        `SELECT current_database()='neondb' AS db,
        current_setting('neon.branch_id', true)='br-wild-unit-bhin6sli' AS branch,
        current_user=$1 AS role, NOT has_database_privilege(current_user, current_database(), 'CREATE') AS limited_db,
        NOT has_schema_privilege(current_user, 'public', 'CREATE') AS limited_schema,
        NOT pg_has_role(current_user,'neon_superuser','MEMBER') AS limited_role,
        to_regclass('public."_prisma_migrations"') IS NOT NULL AS history,
        to_regclass('public."User"') IS NOT NULL AND to_regclass('public."Session"') IS NOT NULL
          AND to_regclass('public."Project"') IS NOT NULL AND to_regclass('public."Asset"') IS NOT NULL AS tables`,
        [productionRuntimeRole],
      );
      const restricted =
        r.branch &&
        r.db &&
        r.role &&
        r.limited_db &&
        r.limited_schema &&
        r.limited_role;
      verified = Boolean(restricted && r.tables && r.history);
      console.log(
        "VN Production verification | pinned pool: matched | actual restricted identity:",
        restricted ? "matched" : "failed",
        "| base tables/history:",
        r.history && r.tables ? "present" : "missing",
      );
      await db.query("ROLLBACK");
    } catch {
      console.log(
        "VN Production verification | pinned pool: matched | read-only connection: unverified",
      );
    } finally {
      await db.end().catch(() => {});
    }
  } else {
    console.log(
      "VN Production verification | pinned pool/database/role configuration: mismatch or absent | connection skipped",
    );
  }
  if (enabled && !verified)
    throw new Error(
      "Cannot enable Production services on an unverified database.",
    );
}
