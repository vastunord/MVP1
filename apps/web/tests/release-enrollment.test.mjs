import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { enrollReleaseTester, releaseCampaignId } from "../scripts/enroll-release-tester.mjs";

const require = createRequire(import.meta.url);
const dev = createRequire(createRequire(require.resolve("prisma/package.json")).resolve("@prisma/dev"));
const { PGlite } = dev("@electric-sql/pglite");
test("operator enrollment persists one bounded window, keeps reservations and refuses conflicting history", async () => {
  const db = new PGlite();
  const campaigns = () => db.query('SELECT * FROM "TestRenderCampaign" ORDER BY id');
  try {
    const dir = new URL("../prisma/migrations/", import.meta.url);
    for (const file of (await readdir(dir, {withFileTypes:true})).filter(d => d.isDirectory()).map(d => d.name).sort())
      await db.exec(await readFile(new URL(file + "/migration.sql", dir), "utf8"));
    await assert.rejects(enrollReleaseTester(db), /Verified acceptance account/);
    assert.equal((await campaigns()).rows.length, 0);
    await db.query('INSERT INTO "User" (id,email,"emailVerified") VALUES ($1,$2,false)',["tester","contact@vastu.no"]);
    await assert.rejects(enrollReleaseTester(db), /Verified acceptance account/);
    await db.query('UPDATE "User" SET "emailVerified"=true WHERE id=$1',["tester"]);
    const initial = await enrollReleaseTester(db);
    assert.deepEqual(initial, {campaignId:releaseCampaignId,enrolled:true,createdCampaign:true,retainedAttempts:0,unresolved:0,reservedMicrousd:0});
    const snapshot = (await campaigns()).rows;
    assert.equal(snapshot[0].maxAttempts, 5);
    assert.equal(snapshot[0].maxMicrousd, 495000);
    assert.equal(snapshot[0].expiresAt - snapshot[0].startsAt, 24 * 60 * 60 * 1000);
    assert.equal((await enrollReleaseTester(db)).createdCampaign, false);
    assert.deepEqual((await campaigns()).rows, snapshot);
    await db.query('INSERT INTO "TestRenderAttempt" (id,"campaignId","userId","requestHash","reservedMicrousd",state) VALUES ($1,$2,$3,$4,99000,\'UNCERTAIN\')',
      ["unused-job",releaseCampaignId,"tester","hash"]);
    await assert.rejects(enrollReleaseTester(db), /reservations or jobs/);
    assert.equal((await db.query('SELECT state FROM "TestRenderAttempt"')).rows[0].state, "UNCERTAIN");
    // Complete the synthetic relationships and ensure a held dispatch is counted.
    await db.query('INSERT INTO "Workspace" (id,name,"personalOwnerId") VALUES ($1,$2,$3)',["workspace","Fixture","tester"]);
    await db.query('INSERT INTO "Project" (id,"workspaceId",name) VALUES ($1,$2,$3)',["project","workspace","Fixture"]);
    await db.query('INSERT INTO "RenderJob" (id,"workspaceId","projectId","toolId","requestHash","updatedAt") VALUES ($1,$2,$3,$4,$5,NOW())',
      ["unused-job","workspace","project","room-reimagination","hash"]);
    const held = await enrollReleaseTester(db);
    assert.equal(held.retainedAttempts,1);
    assert.equal(held.unresolved,1);
    assert.equal(held.reservedMicrousd,99000);
    await db.query('INSERT INTO "TestRenderTester" ("campaignId","userId","maxAttempts","maxMicrousd") VALUES ($1,$2,1,99000)',[releaseCampaignId,"another"]);
    await assert.rejects(enrollReleaseTester(db), /Existing enrollment/);
    await db.query('DELETE FROM "TestRenderTester" WHERE "userId"=$1',["another"]);
    await db.query('UPDATE "TestRenderCampaign" SET active=false');
    await assert.rejects(enrollReleaseTester(db), /Existing campaign/);
    assert.equal((await campaigns()).rows[0].active,false);
  } finally { await db.close(); }
});
