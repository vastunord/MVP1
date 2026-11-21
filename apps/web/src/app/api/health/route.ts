import { NextResponse } from 'next/server';
import { readServerConfig } from '@/server/config';
import { checkDatabase, createDatabase } from '@/server/db';
export const dynamic = 'force-dynamic';
export async function GET() {
  // Never connect an unverified Production database while public auth is gated.
  if ((process.env.APP_ENV === 'production' || process.env.VERCEL_ENV === 'production') && process.env.AUTH_ENABLED !== 'true') return NextResponse.json({status:'unconfigured',database:'disabled',storage:'unverified'},{status:503,headers:{'Cache-Control':'no-store'}});
  const config = readServerConfig();
  if (!config.databaseUrl) return NextResponse.json({status:'unconfigured',database:'unconfigured',storage:config.blobStoreId?'unverified':'unconfigured'},{status:503,headers:{'Cache-Control':'no-store'}});
  const db = createDatabase();
  try {
    const database = await checkDatabase(db);
    return NextResponse.json({status:database.status,database:database.status,storage:config.blobStoreId?'unverified':'unconfigured'},{status:database.status==='ok'?200:503,headers:{'Cache-Control':'no-store'}});
  } finally { await db.$disconnect(); }
}
