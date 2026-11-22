// Read a one-use migration URL from stdin. Print only nonsecret results.
import pg from "pg";
import { createInterface } from "node:readline";
const lines = createInterface({ input: process.stdin, terminal: false });
let input = "";
for await (const line of lines) {
  input = line;
  break;
}
lines.close();
let client;
try {
  const url = new URL(input.trim());
  if (!["postgres:", "postgresql:"].includes(url.protocol) ||
      url.hostname !== "ep-frosty-violet-bhh19hyh.c-10.eu-central-1.aws.neon.tech" ||
      url.username !== "vastunord_dev_migrator" || url.pathname !== "/neondb" || !url.password)
    throw new Error("target");
  client = new pg.Client({
    host: url.hostname, user: url.username, password: decodeURIComponent(url.password),
    database: "neondb", ssl: { rejectUnauthorized: true }, connectionTimeoutMillis: 10000,
    statement_timeout: 5000,
  });
  input = "";
  await client.connect();
  await client.query("BEGIN READ ONLY");
  const { rows: [identity] } = await client.query(`
    SELECT current_database()='neondb' AND current_user='vastunord_dev_migrator'
      AND current_setting('neon.branch_id', true)='br-summer-night-bh70tetr'
      AND current_setting('neon.endpoint_id', true)='ep-frosty-violet-bhh19hyh'
      AND NOT pg_has_role(current_user, 'neon_superuser', 'MEMBER')
      AND NOT has_database_privilege(current_user, current_database(), 'CREATE')
      AND has_schema_privilege(current_user, 'public', 'CREATE') AS valid
  `);
  if (!identity.valid) throw new Error("identity");
  const { rows } = await client.query(`
    SELECT migration_name, checksum, finished_at IS NOT NULL AND rolled_back_at IS NULL AS complete
    FROM public._prisma_migrations ORDER BY migration_name
  `);
  await client.query("ROLLBACK");
  console.log(JSON.stringify({ identity: "verified", migrations: rows }));
} catch (error) {
  const code = typeof error?.code === "string" && /^[0-9A-Z]{5}$/.test(error.code)
    ? error.code : "UNVERIFIED";
  console.log(JSON.stringify({ identity: "blocked", code }));
  process.exitCode = 1;
} finally {
  input = "";
  await client?.end().catch(() => {});
}
