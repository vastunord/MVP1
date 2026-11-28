import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import pg from "pg";

const manifest = {
  "20261121_phase02c_initial": "d79088cf6d074033a017e28fe888f22cc65dee7136e9fd9d044de227497c8a3a",
  "20261121_phase02d_auth_projects": "0676683c33f1377708ec8e94e8b1b3357c0e686fb190de69dc86b4b4f7d04b31",
  "20261122_phase01_newsletter": "a70a340d8cda8e1ca34d6647d3948a166350e604c8d50e771d316c76ffc1e281",
  "20261122_studio_mnml": "c1fe3ae758eefcf1e9b50f9b269be1e99ee1df2be8e8da22b8b8b1e4b5b0c0e1",
  "20261127_maya_submission_settings": "5825ab4799f85af62d58d8129e13b930cf753dd3527197a24c3a13926a0e7708",
  "20261128_controlled_render_campaign": "039120e84b647352504cabe8e7c0bfc994c2cacffb28a0b16a8ab78e5d7237bc",
};
const role = "vastunord_prod_migrator";
const host = "ep-shiny-block-bhmlplzm.c-10.eu-central-1.aws.neon.tech";
const names = Object.keys(manifest);
const dir = new URL("../prisma/migrations/", import.meta.url);
let client;
let stage = "manifest";
try {
  const files = (await readdir(dir, { withFileTypes: true })).filter(e => e.isDirectory()).map(e => e.name).sort();
  if (JSON.stringify(files) !== JSON.stringify(names)) throw Error();
  for (const name of names) {
    const sql = await readFile(new URL(name + "/migration.sql", dir));
    if (createHash("sha256").update(sql).digest("hex") !== manifest[name]) throw Error();
  }
  const mode = process.argv[2];
  if (!["--apply", "--status", "--check-manifest"].includes(mode)) throw Error();
  if (mode === "--check-manifest") {
    console.log("Verified all six reviewed migration files.");
  } else {
    stage = "pinned connection";
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
      if (input.length > 1024) throw Error();
    }
    const password = input.replace(/\r?\n$/, "");
    if (!password || /[\r\n\0]/.test(password)) throw Error();
    client = new pg.Client({ host, database: "neondb", user: role, password,
      ssl: { rejectUnauthorized: true }, connectionTimeoutMillis: 10000, statement_timeout: 10000 });
    await client.connect();
    const {rows:[identity]} = await client.query(`SELECT current_database()='neondb' AND current_user=$1 AND
      current_setting('neon.branch_id')='br-wild-unit-bhin6sli' AND current_setting('neon.endpoint_id')='ep-shiny-block-bhmlplzm'
      AND current_schema()='public' AND has_schema_privilege(current_user,'public','CREATE')
      AND NOT has_database_privilege(current_user,current_database(),'CREATE')
      AND NOT pg_has_role(current_user,'neon_superuser','MEMBER')
      AND EXISTS (SELECT 1 FROM pg_roles WHERE rolname=current_user AND rolcanlogin
      AND NOT (rolsuper OR rolcreatedb OR rolcreaterole OR rolreplication OR rolbypassrls)) AS ok`,[role]);
    if (!identity.ok) throw Error();
    if (!(await client.query("SELECT pg_try_advisory_lock(72282611) AS locked")).rows[0].locked) throw Error();
    stage = "history";
    async function history() {
      const { rows:[row] } = await client.query(`SELECT to_regclass('public."_prisma_migrations"') AS history`);
      if (!row.history) {
        const existing = await client.query("SELECT 1 FROM pg_tables WHERE schemaname='public' LIMIT 1");
        if (existing.rowCount) throw Error();
        return 0;
      }
      const records = await client.query("SELECT migration_name,checksum,finished_at,rolled_back_at FROM public._prisma_migrations ORDER BY started_at,id");
      if (!records.rows.every((r,i) => r.finished_at && !r.rolled_back_at && r.migration_name===names[i] && r.checksum===manifest[names[i]])) throw Error();
      return records.rowCount;
    }
    const applied = await history();
    console.log("Verified Production identity and reviewed migration history:", applied);
    if (mode === "--apply" && applied < names.length) {
      stage = "Prisma deploy";
      const url = new URL("postgresql://" + host + "/neondb?sslmode=verify-full");
      url.username = role;
      url.password = encodeURIComponent(password);
      const prisma = fileURLToPath(new URL("../node_modules/prisma/build/index.js",import.meta.url));
      const result = spawnSync(process.execPath,[prisma,"migrate","deploy"],{cwd:fileURLToPath(new URL("../",import.meta.url)),env:{...process.env,DIRECT_DATABASE_URL:url.href},stdio:"ignore",timeout:120000});
      if (result.status !== 0 || await history() !== names.length) throw Error();
      console.log("Verified six completed Production migration checksums.");
    }
  }
} catch {
  console.error("Production migration check failed at",stage);
  process.exitCode = 1;
} finally { if (client) await client.end().catch(()=>{}); }
