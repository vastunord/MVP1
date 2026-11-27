import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const development = createRequire(
  createRequire(require.resolve("prisma/package.json")).resolve("@prisma/dev"),
);
const { PGlite } = development("@electric-sql/pglite");

test("synthetic project and private render survive a local database close and reopen", async () => {
  const directory = await mkdtemp(join(tmpdir(), "vn-persistence-"));
  let database;
  try {
    database = await PGlite.create(directory);
    await database.exec(await readFile(new URL("../prisma/migrations/20261121_phase02c_initial/migration.sql", import.meta.url), "utf8"));
    await database.exec(await readFile(new URL("../prisma/migrations/20261127_maya_submission_settings/migration.sql", import.meta.url), "utf8"));
    await database.exec(`
      INSERT INTO "User" (id,email) VALUES ('owner','owner@example.invalid');
      INSERT INTO "Workspace" (id,name) VALUES ('workspace','Synthetic');
      INSERT INTO "Membership" ("userId","workspaceId",role) VALUES ('owner','workspace','OWNER');
      INSERT INTO "Project" (id,"workspaceId",name) VALUES ('project','workspace','Synthetic');
      INSERT INTO "Asset" (id,"workspaceId","projectId","ownerId","privateObjectKey","mimeType","byteSize") VALUES ('result','workspace','project','owner','synthetic-result','image/webp',42);
      INSERT INTO "RenderJob" (id,"workspaceId","projectId","toolId","updatedAt") VALUES ('job','workspace','project','room-reimagination',CURRENT_TIMESTAMP);
    `);
    const snapshot = { version: 1, operation: "renders", resolved: { values: { medium: "Watercolor" } } };
    await database.query('UPDATE "RenderJob" SET "submissionSettings"=$1::jsonb WHERE id=$2', [JSON.stringify(snapshot), "job"]);
    await database.close();
    database = undefined;
    database = await PGlite.create(directory);
    const result = await database.query(`SELECT p.id AS project, a.id AS asset, a."ownerId" AS owner, j.id AS job
      FROM "Project" p JOIN "Asset" a ON a."projectId"=p.id
      JOIN "RenderJob" j ON j."projectId"=p.id
      JOIN "Membership" m ON m."workspaceId"=p."workspaceId"
      WHERE m."userId"=$1 AND a."ownerId"=$1`, ["owner"]);
    assert.deepEqual(result.rows, [{ project: "project", asset: "result", owner: "owner", job: "job" }]);
    const saved = await database.query('SELECT "submissionSettings" FROM "RenderJob" WHERE id=$1', ["job"]);
    assert.deepEqual(saved.rows[0].submissionSettings, snapshot);
    const foreign = await database.query('SELECT id FROM "Asset" WHERE "ownerId"=$1', ["other"]);
    assert.equal(foreign.rows.length, 0);
  } finally {
    await database?.close();
    await rm(directory, { recursive: true, force: true });
  }
});
