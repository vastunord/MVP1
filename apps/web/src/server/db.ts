import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import { readServerConfig } from './config';

export function createDatabase() {
  const url = readServerConfig().databaseUrl;
  if (!url) throw new Error('Vastu Nord app database is unconfigured');
  return new PrismaClient({adapter: new PrismaPg({connectionString:url})});
}

export async function checkDatabase(client: { $queryRawUnsafe: (sql:string)=>Promise<unknown> }) {
  try { await client.$queryRawUnsafe('SELECT 1'); return {status:'ok' as const}; }
  catch { return {status:'unavailable' as const}; }
}
