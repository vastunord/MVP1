// The migration credential arrives through a protected pipe, never arguments.
import { createInterface } from "node:readline";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, realpath, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import pg from "pg";

const web = fileURLToPath(new URL("../", import.meta.url));
const stage = resolve(web, "../../.vercel/preview-maya-only");
const config = join(web, ".preview-maya-prisma.config.ts");
const names = [
  ["20261121_phase02c_initial", "d79088cf6d074033a017e28fe888f22cc65dee7136e9fd9d044de227497c8a3a"],
  ["20261121_phase02d_auth_projects", "0676683c33f1377708ec8e94e8b1b3357c0e686fb190de69dc86b4b4f7d04b31"],
  ["20261122_studio_mnml", "c1fe3ae758eefcf1e9b50f9b269be1e99ee1df2be8e8da22b8b8b1e4b5b0c0e1"],
  ["20261127_maya_submission_settings", "5825ab4799f85af62d58d8129e13b930cf753dd3527197a24c3a13926a0e7708"],
];
const newsletterHash = "a70a340d8cda8e1ca34d6647d3948a166350e604c8d50e771d316c76ffc1e281";
const lines = createInterface({ input: process.stdin, terminal: false });
let secret = "";
for await (const line of lines) { secret = line; break; }
lines.close();
let db, createdStage = false, createdConfig = false;
try {
  const url = new URL(secret.trim());
  if (!["postgres:", "postgresql:"].includes(url.protocol) || url.hostname !== "ep-frosty-violet-bhh19hyh.c-10.eu-central-1.aws.neon.tech" || url.username !== "vastunord_dev_migrator" || url.pathname !== "/neondb" || !url.password) throw Error("target");
  db = new pg.Client({ host: url.hostname, user: url.username, password: decodeURIComponent(url.password), database: "neondb", ssl: { rejectUnauthorized: true }, connectionTimeoutMillis: 10000, statement_timeout: 5000 });
  await db.connect();
  await db.query("BEGIN READ ONLY");
  const { rows: [identity] } = await db.query(`SELECT current_database()='neondb' AND current_user='vastunord_dev_migrator'
    AND current_setting('neon.branch_id',true)='br-summer-night-bh70tetr'
    AND current_setting('neon.endpoint_id',true)='ep-frosty-violet-bhh19hyh'
    AND has_schema_privilege(current_user,'public','CREATE')
    AND NOT has_database_privilege(current_user,current_database(),'CREATE')
    AND NOT pg_has_role(current_user,'neon_superuser','MEMBER')
    AND (SELECT relowner FROM pg_class WHERE oid='public."RenderJob"'::regclass)=(SELECT oid FROM pg_roles WHERE rolname=current_user)
    AND (SELECT relowner FROM pg_class WHERE oid='public._prisma_migrations'::regclass)=(SELECT oid FROM pg_roles WHERE rolname=current_user)
    AND NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid='public."RenderJob"'::regclass AND attname='submissionSettings' AND NOT attisdropped) AS ok`);
  if (!identity.ok) throw Error("identity");
  const { rows } = await db.query("SELECT migration_name,checksum,finished_at IS NOT NULL AND rolled_back_at IS NULL AS complete FROM public._prisma_migrations ORDER BY migration_name");
  if (rows.length !== 3 || rows.some((row, index) => row.migration_name !== names[index][0] || row.checksum !== names[index][1] || !row.complete)) throw Error("history");
  await db.query("ROLLBACK");
  const expected = [...names.map(([name]) => name), "20261122_phase01_newsletter"].sort();
  const present = (await readdir(join(web, "prisma/migrations"), { withFileTypes: true })).filter((item) => item.isDirectory()).map((item) => item.name).sort();
  if (JSON.stringify(present) !== JSON.stringify(expected)) throw Error("history");
  for (const [name, checksum] of [...names, ["20261122_phase01_newsletter", newsletterHash]]) {
    const sql = await readFile(join(web, "prisma/migrations", name, "migration.sql"));
    if (createHash("sha256").update(sql).digest("hex") !== checksum) throw Error("checksum");
  }
  if (await realpath(resolve(web, "../../.vercel")) !== resolve(web, "../../.vercel")) throw Error("stage");
  await mkdir(stage, { recursive: false }); createdStage = true;
  if (await realpath(stage) !== stage) throw Error("stage");
  for (const [name] of names) { await mkdir(join(stage, name)); await copyFile(join(web, "prisma/migrations", name, "migration.sql"), join(stage, name, "migration.sql")); }
  await copyFile(join(web, "prisma/migrations/migration_lock.toml"), join(stage, "migration_lock.toml"));
  await writeFile(config, 'import { defineConfig } from "prisma/config";\nexport default defineConfig({schema:' + JSON.stringify(join(web, "prisma/schema.prisma")) + ',migrations:{path:' + JSON.stringify(stage) + '},datasource:{url:process.env.DIRECT_DATABASE_URL}});\n', { flag: "wx" }); createdConfig = true;
  const cli = join(web, "node_modules/prisma/build/index.js");
  const env = { ...process.env, DIRECT_DATABASE_URL: secret.trim(), CHECKPOINT_DISABLE: "1" };
  const run = (action) => spawnSync(process.execPath, [cli, "migrate", action, "--config", config], { cwd: web, env, encoding: "utf8", timeout: 90000 });
  const before = run("status");
  const output = (before.stdout || "") + (before.stderr || "");
  if (before.status !== 1 || !output.includes(names[3][0]) || !/not yet been applied/i.test(output) || /20261122_phase01_newsletter|Error:|P\d{4}/.test(output)) throw Error("status");
  console.log("Preview identity and the sole staged Maya migration verified; newsletter remains pending.");
  const deploy = run("deploy"); delete env.DIRECT_DATABASE_URL;
  if (deploy.status !== 0) { console.log("Migration failed; preserve state. Prisma codes:", [...new Set(((deploy.stderr || "") + (deploy.stdout || "")).match(/P\d{4}/g) || [])].join(", ") || "none"); throw Error("deploy"); }
  const { rows: applied } = await db.query("SELECT checksum,finished_at IS NOT NULL AND rolled_back_at IS NULL AS complete FROM public._prisma_migrations WHERE migration_name=$1", [names[3][0]]);
  if (applied.length !== 1 || applied[0].checksum !== names[3][1] || !applied[0].complete) throw Error("verification");
  console.log("Preview Maya migration applied; recorded checksum verified. Newsletter not applied.");
} catch (error) {
  console.log("Preview Maya migration stopped:", ["target", "identity", "history", "checksum", "stage", "status", "deploy", "verification"].includes(error.message) ? error.message : "unverified");
  process.exitCode = 1;
} finally {
  secret = ""; await db?.end().catch(() => {});
  if (createdConfig) await rm(config, { force: true });
  if (createdStage) await rm(stage, { recursive: true, force: true });
}
