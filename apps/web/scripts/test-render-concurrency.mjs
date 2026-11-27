import { createInterface } from 'node:readline';
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.ts';
import { reserveTestRender } from '../src/server/test-render-budget.ts';

const lines = createInterface({input:process.stdin});
const input = await new Promise(resolve => lines.once('line', resolve));
lines.close();
const url = new URL(input);
if (url.hostname !== 'ep-holy-waterfall-bheg01mu.c-10.eu-central-1.aws.neon.tech' || url.pathname !== '/neondb' || url.username !== 'vastunord_dev_migrator') throw Error('Wrong isolated target');
const dbs = Array.from({length:2}, () => new PrismaClient({adapter:new PrismaPg({connectionString:input, max:1, ssl:{rejectUnauthorized:true}, connectionTimeoutMillis:12000})}));
const id = `fixture-${randomUUID()}`;
let seeded = false;
try {
  for (const db of dbs) {
    const [identity] = await db.$queryRaw`SELECT current_database()::text AS db, current_user::text AS role, current_setting('neon.branch_id',true) AS branch, current_setting('neon.endpoint_id',true) AS endpoint`;
    if (identity.db !== 'neondb' || identity.role !== 'vastunord_dev_migrator' || identity.branch !== 'br-lively-wildflower-bhwpjl4q' || identity.endpoint !== 'ep-holy-waterfall-bheg01mu') throw Error('Live identity mismatch');
  }
  await dbs[0].testRenderCampaign.create({data:{id,model:'v4.5-fast',active:true,startsAt:new Date(Date.now()-10000),expiresAt:new Date(Date.now()+300000),maxAttempts:1,maxMicrousd:99000,perAttemptMicrousd:99000}});
  seeded = true;
  await dbs[0].testRenderTester.createMany({data:['fixture-a','fixture-b'].map(userId=>({campaignId:id,userId,maxAttempts:1,maxMicrousd:99000}))});
  let arrived=0, release;
  const barrier = new Promise(resolve => { release=resolve; });
  const pids=[];
  const tasks=dbs.map((db,i)=>db.$transaction(async tx=>{
    const [row]=await tx.$queryRaw`SELECT pg_backend_pid() AS pid`;
    pids.push(row.pid);
    if (++arrived===2) release();
    await barrier;
    return reserveTestRender(tx,{campaignId:id,userId:i ? 'fixture-b':'fixture-a',id:randomUUID(),requestHash:`fixture-${i}`,endpoint:'renders',model:'v4.5-fast',count:1,quoteMicrousd:99000});
  },{timeout:20000,maxWait:12000}));
  const outcomes=await Promise.allSettled(tasks);
  const count=await dbs[0].testRenderAttempt.count({where:{campaignId:id}});
  if (pids.length!==2 || pids[0]===pids[1] || outcomes.filter(x=>x.status==='fulfilled').length!==1 || outcomes.filter(x=>x.status==='rejected' && x.reason?.status===429).length!==1 || count!==1) throw Error('Concurrency invariant failed');
  console.log('Independent Neon backends:',pids.length,'distinct:',pids[0]!==pids[1],'; last campaign attempt: one committed, one rejected; count:',count);
  await dbs[0].testRenderAttempt.deleteMany({where:{campaignId:id}});
  const duplicateId=randomUUID();
  arrived=0;
  let releaseDuplicate;
  const duplicateBarrier=new Promise(resolve=>{releaseDuplicate=resolve;});
  const duplicate=await Promise.all(dbs.map(db=>db.$transaction(async tx=>{
    await tx.$queryRaw`SELECT pg_backend_pid()`;
    if (++arrived===2) releaseDuplicate();
    await duplicateBarrier;
    return reserveTestRender(tx,{campaignId:id,userId:'fixture-a',id:duplicateId,requestHash:'same',endpoint:'renders',model:'v4.5-fast',count:1,quoteMicrousd:99000});
  },{timeout:20000,maxWait:12000})));
  if (duplicate.some(x=>x.id!==duplicateId) || await dbs[0].testRenderAttempt.count({where:{campaignId:id}})!==1) throw Error('Duplicate reservation invariant failed');
  const claims=await Promise.all(dbs.map(db=>db.testRenderAttempt.updateMany({where:{id:duplicateId,state:'RESERVED'},data:{state:'UNCERTAIN'}})));
  if (claims.reduce((sum,x)=>sum+x.count,0)!==1) throw Error('Duplicate dispatch claim invariant failed');
  console.log('Duplicate request: one reservation; concurrent dispatch: one claim.');
  await dbs[0].testRenderAttempt.deleteMany({where:{campaignId:id}});
  try {
    await dbs[0].$transaction(async tx=>{
      await reserveTestRender(tx,{campaignId:id,userId:'fixture-a',id:randomUUID(),requestHash:'rollback',endpoint:'renders',model:'v4.5-fast',count:1,quoteMicrousd:99000});
      throw Error('intentional rollback');
    });
    throw Error('Rollback did not throw');
  } catch (error) { if (error.message!=='intentional rollback') throw error; }
  if (await dbs[0].testRenderAttempt.count({where:{campaignId:id}})!==0) throw Error('Reservation rollback failed');
  console.log('Aborted transaction left no reservation.');
} catch(error) {
  console.error('Concurrency fixture failed:', error.code ?? error.message);
  process.exitCode=1;
} finally {
  if (seeded) {
    try {
      await dbs[0].testRenderAttempt.deleteMany({where:{campaignId:id}});
      await dbs[0].testRenderTester.deleteMany({where:{campaignId:id}});
      await dbs[0].testRenderCampaign.delete({where:{id}});
      console.log('Synthetic campaign records removed.');
    } catch { console.error('Synthetic cleanup incomplete for fixture:',id); process.exitCode=1; }
  }
  await Promise.all(dbs.map(db=>db.$disconnect()));
}
