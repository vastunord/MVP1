import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.ts';
import { studioPersistenceReady } from '../src/server/studio-readiness.ts';

const require = createRequire(import.meta.url);
const dev = createRequire(createRequire(require.resolve('prisma/package.json')).resolve('@prisma/dev'));
const { PGlite } = dev('@electric-sql/pglite');
const { PGLiteSocketServer } = dev('@electric-sql/pglite-socket');
const memory = await PGlite.create();
const socket = new PGLiteSocketServer({ db: memory, host: '127.0.0.1', port: 0 });
let db;
const started = Date.now();
try {
  const migrations = ['20261121_phase02c_initial','20261121_phase02d_auth_projects','20261122_studio_mnml','20261127_maya_submission_settings','20261128_controlled_render_campaign'];
  for (const migration of migrations) {
    await memory.exec(await readFile(new URL(`../prisma/migrations/${migration}/migration.sql`, import.meta.url), 'utf8'));
    console.log('applied fixture migration:', migration);
  }
  await socket.start();
  db = new PrismaClient({adapter: new PrismaPg({host:'127.0.0.1',database:'postgres',user:'postgres',max:1,ssl:false,port:Number(socket.getServerConn().split(':').at(-1))})});
  console.log('identity:', await db.$queryRaw`SELECT current_database() AS database, current_schema() AS schema, current_user AS role`);
  console.log('tables and columns:', await db.$queryRaw`SELECT table_name::text, string_agg(column_name::text, ',' ORDER BY column_name) AS columns FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('RenderJob','Asset','Workspace','Project','TestRenderCampaign','TestRenderAttempt','TestRenderTester') GROUP BY table_name ORDER BY table_name`);
  const ready = await studioPersistenceReady({$queryRaw: (...args) => db.$queryRaw(...args).catch((error) => { console.log('readiness query failed:', {code:error.code, sqlstate:error.meta?.code}); throw error; })});
  console.log('readiness:', ready);
  if (!ready) throw new Error('Expected migrated fixture to pass readiness');
  console.log('elapsed ms:', Date.now()-started);
} finally {
  await db?.$disconnect();
  await socket.stop();
  await memory.close();
}
