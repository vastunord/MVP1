// The existing demo can build with private services closed. A release enabling
// them must prove that the actual protected Vercel configuration is usable.
import pg from "pg";
import { releaseServiceChecks } from "../src/server/release-service-checks.ts";
import { studioPersistenceReady } from "../src/server/studio-readiness.ts";
import { controlledRenderingAllowanceReady } from "../src/lib/studio-test-access.ts";
import {
  isProductionDatabase,
  productionRuntimeRole,
} from "../src/server/production-target.ts";
if (process.env.VERCEL_ENV === "production") {
  if (process.env.VN_PROBE_RELEASE_PROVIDERS === "1") {
    const { probeReleaseProviders, checkPranaReplies } = await import("./probe-release-providers.mjs");
    console.log("VN read-only provider evidence", await probeReleaseProviders(process.env));
    if (process.env.VN_CHECK_PRANA_REPLIES === "1")
      console.log("VN synthetic Prana provider replies", await checkPranaReplies(process.env));
  }
  const url = process.env.DATABASE_URL;
  const serviceChecks = releaseServiceChecks(process.env);
  if (Object.keys(serviceChecks).length) console.log("VN Production service bindings", serviceChecks);
  if (Object.values(serviceChecks).includes(false)) throw new Error("An enabled Production service binding failed verification.");
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
      if (verified && serviceChecks.authentication) {
        const { rows: [permission] } = await db.query(`SELECT NOT EXISTS (
          SELECT 1 FROM (VALUES
            ('User', 'SELECT,INSERT,UPDATE'), ('Account','SELECT,INSERT,UPDATE'),
            ('Session','SELECT,INSERT,UPDATE,DELETE'), ('Verification','SELECT,INSERT,UPDATE,DELETE'),
            ('RateLimit','SELECT,INSERT,UPDATE,DELETE'), ('Project','SELECT,INSERT'),
            ('Workspace','SELECT,INSERT'), ('Membership','SELECT,INSERT')
          ) AS perms(rel,ops) CROSS JOIN LATERAL unnest(string_to_array(ops,',')) AS op
          WHERE NOT coalesce(has_table_privilege(current_user,to_regclass(format('public.%I',rel)),op),false)
        ) AS ready`);
        verified = permission.ready === true;
        console.log("VN Production authentication table permissions", verified);
      }
      if (verified && serviceChecks.privateMedia) {
        const { rows: [permission] } = await db.query(`SELECT
          has_table_privilege(current_user,'public."Asset"','SELECT') AND
          has_table_privilege(current_user,'public."Asset"','INSERT') AND
          has_table_privilege(current_user,'public."Asset"','DELETE') AND
          has_column_privilege(current_user,'public."Asset"','state','UPDATE') AND
          has_table_privilege(current_user,'public."UploadIntent"','INSERT') AND
          has_column_privilege(current_user,'public."UploadIntent"','completedAt','UPDATE') AND
          has_table_privilege(current_user,'public."AssetVersion"','INSERT') AS ready`);
        verified = permission.ready === true;
        console.log("VN Production private asset permissions", verified);
      }
      if (verified && serviceChecks.rendering) {
        // Reuse the exact parameterized schema/permission checks from the Studio.
        const queryAdapter = { async $queryRaw(parts, ...values) {
          const sql = parts.reduce((text, part, i) => text + (i ? "$" + i : "") + part, "");
          return (await db.query(sql, values)).rows;
        }};
        verified = await studioPersistenceReady(queryAdapter);
        console.log("VN Production rendering schema and permissions", verified);
        // Exhausting the test campaign must never stop sign-in or saved gallery reads.
        // The same allowance check runs before every dispatch. Here it also gates a new build.
        if (verified && serviceChecks.controlledSubmission && process.env.VN_VERIFY_RELEASE !== "1") {
          const { rows } = await db.query('SELECT id FROM "User" WHERE email=$1 AND "emailVerified"=true',
            ["contact@vastu.no"]);
          verified = rows.length === 1 && await controlledRenderingAllowanceReady(queryAdapter, rows[0].id);
          console.log("VN Production enrolled tester and available allowance", verified);
        }
      }
      console.log(
        "VN Production verification | pinned pool: matched | actual restricted identity:",
        restricted ? "matched" : "failed",
        "| base tables/history:",
        r.history && r.tables ? "present" : "missing",
      );
      await db.query("ROLLBACK");
    } catch {
      verified = false;
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
