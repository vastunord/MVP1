// Pass "preview" to run this check with the isolated Vercel CLI environment.
import pg from "pg";
import {
  isPreviewDatabase,
  previewBranch,
  previewPool,
  previewRole,
  previewStore,
} from "../src/server/preview-target.ts";

const env = process.env;
if (env.VERCEL_ENV === "preview" || process.argv[2] === "preview") {
  const match = isPreviewDatabase(env.DATABASE_URL);
  const checks = {
    stage: env.APP_ENV === "preview",
    database: match,
    privateStore: env.BLOB_STORE_ID === previewStore,
    authSecret: (env.BETTER_AUTH_SECRET || "").length >= 32,
    email:
      env.AUTH_EMAIL_PROVIDER === "resend" &&
      Boolean(env.AUTH_EMAIL_FROM && env.RESEND_API_KEY),
    groq: Boolean(env.GroqAPI || env.GROQ_API_KEY),
    mnml: Boolean(env.MNMLAPI || env.MNML_API_KEY),
    newsletterSecret: (env.NEWSLETTER_TOKEN_SECRET || "").length >= 32,
  };
  console.log("Vastu Nord Preview configuration", JSON.stringify(checks));
  if (!match) {
    const candidate = URL.canParse(env.DATABASE_URL || "") ? new URL(env.DATABASE_URL) : null;
    console.log("Preview connection components", JSON.stringify({
      present: Boolean(env.DATABASE_URL), validUrl: Boolean(candidate),
      expectedPool: candidate?.hostname === previewPool,
      expectedRole: candidate?.username === previewRole,
      expectedDatabase: candidate?.pathname === "/neondb",
      tls: ["require","verify-full"].includes(candidate?.searchParams.get("sslmode")),
      mailProvider: env.AUTH_EMAIL_PROVIDER === "resend",
      sender: Boolean(env.AUTH_EMAIL_FROM), mailCredential: Boolean(env.RESEND_API_KEY)
    }));
  }
  if (
    !checks.stage ||
    !match ||
    !checks.privateStore ||
    !checks.authSecret ||
    !checks.email
  )
    throw new Error("Protected Preview configuration requires correction.");
  const url = new URL(env.DATABASE_URL);
  const db = new pg.Client({
    host: url.hostname,
    user: previewRole,
    password: decodeURIComponent(url.password),
    database: "neondb",
    ssl: { rejectUnauthorized: true },
    connectionTimeoutMillis: 8000,
    statement_timeout: 5000,
  });
  try {
    await db.connect();
    await db.query("BEGIN READ ONLY");
    const {
      rows: [r],
    } = await db.query(
      `SELECT current_database()='neondb' AND current_user=$1 AND
      current_setting('neon.branch_id',true)=$2 AND NOT has_database_privilege(current_user,current_database(),'CREATE') AND
      NOT pg_has_role(current_user,'neon_superuser','MEMBER') AS identity,
      has_table_privilege(current_user,'public."User"','INSERT') AS registration,
      to_regclass('public."NewsletterSubscriber"') IS NOT NULL AS newsletter,
      EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='RenderJob' AND column_name='providerJobId') AS rendering`,
      [previewRole, previewBranch],
    );
    console.log("Vastu Nord Preview database", JSON.stringify(r));
    if (!r.identity || !r.registration) throw new Error();
    await db.query("ROLLBACK");
  } catch {
    throw new Error(
      "Protected Preview database identity or application access could not be verified.",
    );
  } finally {
    await db.end().catch(() => {});
  }
}
