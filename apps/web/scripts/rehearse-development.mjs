// The protected Windows runner is the only entry point. The app never imports this file.
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import pg from "pg";

const expected = new Map([
  ["20261121_phase02c_initial", "d79088cf6d074033a017e28fe888f22cc65dee7136e9fd9d044de227497c8a3a"],
  ["20261121_phase02d_auth_projects", "0676683c33f1377708ec8e94e8b1b3357c0e686fb190de69dc86b4b4f7d04b31"],
  ["20261122_phase01_newsletter", "a70a340d8cda8e1ca34d6647d3948a166350e604c8d50e771d316c76ffc1e281"],
  ["20261122_studio_mnml", "c1fe3ae758eefcf1e9b50f9b269be1e99ee1df2be8e8da22b8b8b1e4b5b0c0e1"],
]);
const names = [...expected.keys()];
const endpoint = "ep-purple-fog-bhs946ij";
const branch = "br-mute-resonance-bhea4dyx";
const host = endpoint + ".c-10.eu-central-1.aws.neon.tech";
const role = "vastunord_dev_migrator";
const root = new URL("../prisma/migrations/", import.meta.url);
const password = process.env.VASTUNORD_DEV_MIGRATOR_PASSWORD;
delete process.env.VASTUNORD_DEV_MIGRATOR_PASSWORD;
const db = new pg.Client({ host, database: "neondb", user: role, password, ssl: { rejectUnauthorized: true }, connectionTimeoutMillis: 12000 });
const cli = fileURLToPath(new URL("../node_modules/prisma/build/index.js", import.meta.url));
const app = fileURLToPath(new URL("../", import.meta.url));
const url = new URL(`postgresql://${host}/neondb?sslmode=require&sslaccept=strict&schema=public&connect_timeout=12`);
url.username = role;
url.password = encodeURIComponent(password || "");
const childEnv = { ...process.env, CHECKPOINT_DISABLE: "1", DIRECT_DATABASE_URL: url.href };
const mode = process.argv[2];
let stage = "protected configuration";
let attempted = false;

function validate(condition) {
  if (!condition) throw new Error();
}

function prisma(action, pending = []) {
  const run = spawnSync(process.execPath, [cli, "migrate", action], {
    env: childEnv, cwd: app, encoding: "utf8", timeout: 90000,
  });
  // Raw Prisma output may contain a connection URL. Only allowlisted codes leave the process.
  const output = (run.stdout || "") + (run.stderr || "");
  if (pending.length && run.status === 1 && /not yet been applied/i.test(output) && pending.every(name => output.includes(name))) return;
  if (run.status === 0 && !pending.length) return;
  const error = new Error();
  error.code = run.error?.code ?? output.match(/\bP(?:10|30)\d{2}\b/)?.[0];
  throw error;
}

async function history() {
  const {rows} = await db.query("SELECT migration_name, checksum, finished_at, rolled_back_at FROM public._prisma_migrations ORDER BY migration_name");
  validate(rows.length === 2 || rows.length === 4);
  validate(rows.every((row, i) => row.finished_at && !row.rolled_back_at && names[i] === row.migration_name && expected.get(row.migration_name) === row.checksum));
  return rows.length;
}

async function verifySchema(applied) {
  const {rows: [schema]} = await db.query(`SELECT
    (SELECT count(*)::int FROM pg_class c WHERE c.relnamespace = 'public'::regnamespace AND c.relname IN ('NewsletterSubscriber','NewsletterRateBucket') AND c.relkind='r') AS tables,
    (SELECT count(*)::int FROM pg_attribute a WHERE a.attrelid = 'public."RenderJob"'::regclass AND NOT a.attisdropped AND a.attname = ANY($1::text[])) AS columns,
    (SELECT count(*)::int FROM pg_index i JOIN pg_class c ON c.oid=i.indexrelid WHERE c.relnamespace='public'::regnamespace AND c.relname IN ('NewsletterSubscriber_email_key','NewsletterRateBucket_expiresAt_idx','RenderJob_providerJobId_key') AND i.indisvalid) AS indexes`,
    [["sourceAssetId", "outputAssetId", "outputMedia", "requestHash", "providerJobId", "chargedUsd", "refundedUsd"]]);
  validate(applied === 4 ? schema.tables === 2 && schema.columns === 7 && schema.indexes === 3 : schema.tables === 0 && schema.columns === 0 && schema.indexes === 0);
}

try {
  validate(password && !process.env.VERCEL && !process.env.DATABASE_URL && ["verify", "apply"].includes(mode));
  stage = "migration file set";
  const folders = (await readdir(root, { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name).sort();
  validate(folders.join() === names.join());
  for (const name of names) {
    stage = `checksum ${name}`;
    const hash = createHash("sha256").update(await readFile(new URL(`${name}/migration.sql`, root))).digest("hex");
    validate(hash === expected.get(name));
  }
  stage = "direct PostgreSQL connection";
  await db.connect();
  stage = "development branch, endpoint, database and role";
  const {rows: [identity]} = await db.query(`SELECT current_database()='neondb' AND current_user=$1 AND
    current_setting('neon.branch_id',true)=$2 AND current_setting('neon.endpoint_id',true)=$3 AND current_schema()='public' AS ok`, [role, branch, endpoint]);
  validate(identity.ok);
  stage = "schema privileges and RenderJob ownership";
  const {rows: [grants]} = await db.query(`SELECT has_schema_privilege('public','CREATE') AND has_schema_privilege('public','USAGE') AND
    NOT has_database_privilege(current_database(),'CREATE') AND NOT pg_has_role(current_user,'neon_superuser','MEMBER') AND
    pg_has_role(current_user,relowner,'USAGE') AS ok FROM pg_class WHERE oid='public."RenderJob"'::regclass`);
  validate(grants.ok);
  stage = "existing Prisma history";
  const applied = await history();
  stage = "existing newsletter and render schema";
  await verifySchema(applied);
  stage = "Prisma migration status";
  prisma("status", names.slice(applied));
  console.log(`Development identity, limited role and four checksums verified. ${applied} migrations recorded.`);
  if (mode === "apply" && applied === 2) {
    stage = "Prisma deploy";
    attempted = true;
    prisma("deploy");
    stage = "post-deploy history";
    validate(await history() === 4);
    stage = "post-deploy tables, columns and indexes";
    await verifySchema(4);
    stage = "post-deploy Prisma status";
    prisma("status");
    console.log("Development newsletter and Studio migrations applied. Four successful checksums, up-to-date history and new tables, columns and indexes verified.");
  }
} catch (error) {
  const safeCode = /^(?:[0-9A-Z]{5}|P(?:10|30)\d{2}|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ETIMEDOUT|EACCES|EPERM|ENOENT|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|UNABLE_TO_GET_ISSUER_CERT_LOCALLY)$/.test(String(error?.code)) ? ` (${error.code})` : "";
  console.error(`Development ${mode === "apply" ? "migration" : "preflight"} stopped at ${stage}${safeCode}. ${attempted ? "Deployment was attempted. Inspect history before further action." : "No deployment was attempted."}`);
  process.exitCode = 1;
} finally {
  delete childEnv.DIRECT_DATABASE_URL;
  await db.end().catch(() => {});
}
