import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createInterface } from "node:readline";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { parseRender } from "../src/server/mnml.ts";
import { startJob, syncJob } from "../src/server/studio-jobs.ts";
import sharp from "sharp";
import { controlledRenderingAllowanceReady } from "../src/lib/studio-test-access.ts";

const reader = createInterface({ input: process.stdin });
const direct = new URL(await new Promise(resolve => reader.once("line", resolve)));
reader.close();
assert.equal(direct.hostname, "ep-holy-waterfall-bheg01mu.c-10.eu-central-1.aws.neon.tech");
assert.equal(direct.pathname, "/neondb");
assert.equal(direct.username, "vastunord_dev_migrator");
const dbs = [0, 1].map(() => new PrismaClient({adapter: new PrismaPg({
  connectionString: direct.toString(), max: 1, ssl: {rejectUnauthorized: true},
  statement_timeout: 10000, connectionTimeoutMillis: 10000
})}));
const db = dbs[0];
const actors = dbs.map(() => ({ userId: randomUUID(), workspaceId: randomUUID(), projectId: randomUUID(), sourceAssetId: randomUUID() }));
const campaigns = [];
let seeded = false;
async function campaign() {
  const id = "fixture-job-" + randomUUID();
  campaigns.push(id);
  await db.testRenderCampaign.create({data: {
    id, model:"v4.5-fast", active:true, startsAt:new Date(Date.now()-10000),
    expiresAt:new Date(Date.now()+300000), maxAttempts:1, maxMicrousd:99000, perAttemptMicrousd:99000,
    testers:{create:actors.map(({userId}) => ({userId, maxAttempts:1, maxMicrousd:99000}))}
  }});
  return {key:"fixture", campaignId:id, quoteMicrousd:99000};
}
function brief(actor) {
  return parseRender({id:randomUUID(), toolId:"room-reimagination", consent:true, engine:"v4.5-fast",
    sourceAssetId:actor.sourceAssetId, referenceIds:[], projectId:actor.projectId, prompt:"Fixture room", values:{}});
}
const io = {
  calls:[],
  async readSource() {return "data:image/png;base64,AA==";},
  async submit(_key, request) {
    io.calls.push(request.id);
    return {id:"stub-" + request.id, status:"queued", charged_usd:0.099};
  },
};

// Pause only the first real transaction on each connection, before startJob
// takes the project lock. The winner can commit without waiting for the loser.
async function race(config, users, requests) {
  const pids = new Set();
  const gate = Promise.withResolvers();
  const timeout = setTimeout(() => gate.reject(new Error("Timed out reaching both transactions")), 8000);
  try {
    const calls = dbs.map((client, index) => {
      let first = true;
      const boundary = {
        asset:client.asset, renderJob:client.renderJob, testRenderAttempt:client.testRenderAttempt,
        async $transaction(operation) {
          return client.$transaction(async tx => {
            if (first) {
              first = false;
              const [identity] = await tx.$queryRaw`SELECT pg_backend_pid() AS pid`;
              pids.add(identity.pid);
              if (pids.size === 2) gate.resolve();
              await gate.promise;
            }
            return operation(tx);
          }, {timeout:20000});
        },
      };
      return startJob(boundary, config, users[index], requests[index], io);
    });
    const result = await Promise.allSettled(calls);
    assert.equal(pids.size, 2, "Transactions must overlap on distinct backends");
    return result;
  } finally { clearTimeout(timeout); }
}
try {
  for (const client of dbs) {
    const [identity] = await client.$queryRaw`SELECT current_database()::text AS db, current_user::text AS role, current_schema()::text AS schema, current_setting('neon.branch_id') AS branch, current_setting('neon.endpoint_id') AS endpoint`;
    assert.deepEqual(identity, {db:"neondb", role:"vastunord_dev_migrator", schema:"public", branch:"br-lively-wildflower-bhwpjl4q", endpoint:"ep-holy-waterfall-bheg01mu"});
  }
  await db.$transaction(async tx => {
    for (const a of actors) {
      await tx.user.create({data:{id:a.userId, email:a.userId+"@example.invalid"}});
      await tx.workspace.create({data:{id:a.workspaceId, name:"Synthetic test", personalOwnerId:a.userId}});
      await tx.project.create({data:{id:a.projectId, workspaceId:a.workspaceId, name:"Synthetic room"}});
      await tx.asset.create({data:{id:a.sourceAssetId, workspaceId:a.workspaceId, projectId:a.projectId, ownerId:a.userId, state:"VALIDATED", mimeType:"image/png", byteSize:1, privateObjectKey:"fixture-"+a.sourceAssetId}});
    }
  });
  seeded = true;
  const config = await campaign();
  const releaseFlags = {APP_ENV:"production",VERCEL_ENV:"production",MNML_TEST_CAMPAIGN_ID:config.campaignId,MNML_SUBMISSION_ENABLED:"true"};
  assert.equal(await controlledRenderingAllowanceReady(db,actors[0].userId,releaseFlags),true);
  assert.equal(await controlledRenderingAllowanceReady(db,randomUUID(),releaseFlags),false);
  const requests = actors.map(brief);
  const outcomes = await race(config, actors, requests);
  assert.equal(outcomes.filter(x => x.status==="fulfilled").length, 1);
  assert.equal(outcomes.filter(x => x.status==="rejected" && x.reason.status===429).length, 1);
  assert.equal(io.calls.length, 1);
  const committed = await db.renderJob.findMany({where:{id:{in:requests.map(x=>x.id)}}});
  assert.equal(committed.length, 1);
  assert.equal(committed[0].id, io.calls[0]);
  const attempt = await db.testRenderAttempt.findUniqueOrThrow({where:{id:io.calls[0]}});
  assert.equal(attempt.state, "SETTLED");
  assert.equal(attempt.settledMicrousd, 99000);
  assert.equal(await controlledRenderingAllowanceReady(db,actors[0].userId,releaseFlags),false);
  console.log("PASS startJob final-slot race on two backends: one job, one provider call, one settled charge");
  const owner = actors.find(actor => actor.workspaceId === committed[0].workspaceId);
  const providerId = committed[0].providerJobId;
  const image = await sharp({create:{width:4,height:4,channels:3,background:"#eee"}}).png().toBuffer();
  const storedKeys = [];
  const output = {
    ...io,
    async check(_key,id) {
      assert.equal(id,providerId);
      return {id,status:"succeeded",charged_usd:0.099,outputs:[{media:"image",url:`https://api.mnml.ai/v2/files/${id}?exp=1&sig=fixture`}]};
    },
    async fetchFile() {return new Response(image);},
    async writeOutput(key) {
      storedKeys.push(key);
      if (storedKeys.length===1) throw new Error("simulated storage failure");
    }
  };
  await assert.rejects(syncJob(db,"fixture",owner,owner.projectId,committed[0].id,output), /simulated storage failure/);
  const recovered = await syncJob(db,"fixture",owner,owner.projectId,committed[0].id,output);
  assert.equal(recovered.state,"SUCCEEDED");
  assert.equal(storedKeys.length,2);
  assert.equal(storedKeys[0],storedKeys[1]);
  assert.equal(io.calls.length,1);
  console.log("PASS syncJob private storage retry reused one provider result and one object key");

  const duplicate = brief(actors[0]);
  const repeated = await race(await campaign(), [actors[0], actors[0]], [duplicate,duplicate]);
  assert.ok(repeated.some(x=>x.status==="fulfilled" && x.value.id===duplicate.id));
  assert.ok(repeated.every(x=>x.status==="fulfilled" || x.reason.status===409));
  assert.equal(io.calls.filter(id=>id===duplicate.id).length,1);
  assert.equal(await db.testRenderAttempt.count({where:{id:duplicate.id}}),1);
  console.log("PASS concurrent duplicate startJob: one durable attempt and one provider call");

  const failed = brief(actors[1]);
  // Inject a checked DB failure at the job insert, after the real reservation.
  const invalidInsert = db.$extends({query:{renderJob:{create({args,query}) {
    args.data.projectId=randomUUID();
    return query(args);
  }}}});
  await assert.rejects(startJob(invalidInsert,await campaign(),actors[1],failed,io), {code:"P2003"});
  assert.equal(await db.testRenderAttempt.count({where:{id:failed.id}}),0);
  assert.equal(await db.renderJob.count({where:{id:failed.id}}),0);
  assert.ok(!io.calls.includes(failed.id));
  console.log("PASS startJob insert failure rolled back reservation without dispatch");
} catch (error) {
  console.error("Isolated job race failed:", error.code || error.name, error.operator || "");
  process.exitCode=1;
} finally {
  if (seeded) {
    const projectIds=actors.map(a=>a.projectId);
    await db.$transaction(async tx=>{
      await tx.testRenderAttempt.deleteMany({where:{campaignId:{in:campaigns}}});
      await tx.testRenderTester.deleteMany({where:{campaignId:{in:campaigns}}});
      await tx.testRenderCampaign.deleteMany({where:{id:{in:campaigns}}});
      await tx.renderJob.deleteMany({where:{projectId:{in:projectIds}}});
      await tx.asset.deleteMany({where:{projectId:{in:projectIds}}});
      await tx.project.deleteMany({where:{id:{in:projectIds}}});
      await tx.workspace.deleteMany({where:{id:{in:actors.map(a=>a.workspaceId)}}});
      await tx.user.deleteMany({where:{id:{in:actors.map(a=>a.userId)}}});
    });
    console.log("Removed isolated fixtures");
  }
  await Promise.all(dbs.map(client=>client.$disconnect()));
}
