import { createInterface } from 'node:readline';
import pg from 'pg';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const lines = createInterface({ input: process.stdin });
const input = await new Promise(resolve => lines.once('line', resolve));
lines.close();
let client;
try {
  const url = new URL(input);
  if (url.hostname !== 'ep-holy-waterfall-bheg01mu.c-10.eu-central-1.aws.neon.tech' || url.pathname !== '/neondb' || url.username !== 'vastunord_dev_migrator') throw new Error('target mismatch');
  client = new pg.Client({ connectionString: input, ssl: { rejectUnauthorized: true }, connectionTimeoutMillis: 12000 });
  await client.connect();
  const result = await client.query(`SELECT current_database() AS db, current_user AS role, current_schema() AS schema, current_setting('neon.branch_id',true) AS branch, current_setting('neon.endpoint_id',true) AS endpoint, to_regclass('public."TestRenderCampaign"') IS NOT NULL AS campaign_schema`);
  const x = result.rows[0];
  if (x.db !== 'neondb' || x.role !== 'vastunord_dev_migrator' || x.schema !== 'public' || x.branch !== 'br-lively-wildflower-bhwpjl4q' || x.endpoint !== 'ep-holy-waterfall-bheg01mu') throw new Error('live identity mismatch');
  console.log('Isolated test identity verified; campaign schema present:', x.campaign_schema);
  const history = await client.query(`SELECT migration_name, checksum, finished_at IS NOT NULL AS finished, rolled_back_at IS NOT NULL AS rolled_back FROM public."_prisma_migrations" ORDER BY started_at`);
  console.log('Migration history:', history.rows);
  if (process.argv.includes('--apply-reviewed')) {
    const expected = ['20261121_phase02c_initial','20261121_phase02d_auth_projects','20261122_phase01_newsletter','20261122_studio_mnml','20261127_maya_submission_settings','20261128_controlled_render_campaign'];
    const root = fileURLToPath(new URL('../', import.meta.url));
    const dirs = (await readdir(new URL('../prisma/migrations/', import.meta.url), {withFileTypes:true})).filter(x => x.isDirectory()).map(x => x.name).sort();
    if (JSON.stringify(dirs) !== JSON.stringify(expected) || x.campaign_schema || history.rows.length !== 2) throw new Error('Unexpected test migration state');
    for (const row of history.rows) {
      if (!row.finished || row.rolled_back || !expected.includes(row.migration_name)) throw new Error('Unexpected test migration history');
      const bytes = await readFile(new URL(`../prisma/migrations/${row.migration_name}/migration.sql`, import.meta.url));
      if (createHash('sha256').update(bytes).digest('hex') !== row.checksum) throw new Error('Applied migration checksum mismatch');
    }
    await client.end();
    client = undefined;
    const prisma = fileURLToPath(new URL('../node_modules/prisma/build/index.js', import.meta.url));
    url.searchParams.set('sslmode', 'verify-full');
    const result = spawnSync(process.execPath, [prisma, 'migrate', 'deploy'], {cwd:root, env:{...process.env,DIRECT_DATABASE_URL:url.toString()}, stdio:'ignore', timeout:120000});
    if (result.status !== 0) throw new Error('Prisma test migration failed; preserve state and inspect history');
    console.log('Reviewed pending migrations applied to isolated test branch.');
  }
} catch (error) {
  console.error('Isolated test operation did not pass:', error.code ?? (['target mismatch','live identity mismatch','Unexpected test migration state','Unexpected test migration history','Applied migration checksum mismatch','Prisma test migration failed; preserve state and inspect history'].includes(error.message) ? error.message : 'unverified'));
  process.exitCode = 1;
} finally {
  await client?.end().catch(() => {});
}
