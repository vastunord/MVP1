import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const dev = createRequire(createRequire(require.resolve("prisma/package.json")).resolve("@prisma/dev"));
const { PGlite } = dev("@electric-sql/pglite");
test("restricted release grants permit core operations and leave administration outside the runtime", async () => {
  const db = new PGlite();
  try {
    const migrations = new URL("../prisma/migrations/", import.meta.url);
    for (const entry of (await readdir(migrations, {withFileTypes:true})).filter(e=>e.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))) {
      await db.exec(await readFile(new URL(entry.name + "/migration.sql",migrations),"utf8"));
    }
    await db.exec('CREATE ROLE vastunord_prod_runtime LOGIN; CREATE TABLE _prisma_migrations (id text)');
    await db.exec(await readFile(new URL("../scripts/production-runtime-grants.sql",import.meta.url),"utf8"));
    await db.exec("SET ROLE vastunord_prod_runtime");
    for (const [table,operation] of [["User","INSERT"],["Session","DELETE"],["Workspace","INSERT"],["Project","SELECT"],["Asset","INSERT"],["RenderJob","SELECT"]]) {
      const {rows:[result]} = await db.query("SELECT has_table_privilege(current_user,$1,$2) AS allowed",['"'+table+'"',operation]);
      assert.equal(result.allowed,true,table+" "+operation);
    }
    for (const [table,column,allowed] of [["TestRenderAttempt","settledMicrousd",true],["TestRenderCampaign","id",true],["TestRenderCampaign","maxMicrousd",false],["TestRenderAttempt","reservedMicrousd",false],["TestRenderTester","maxAttempts",false],["RenderJob","providerJobId",true],["RenderJob","projectId",false],["Project","name",true]]) {
      const {rows:[result]} = await db.query("SELECT has_column_privilege(current_user,$1,$2,'UPDATE') AS allowed",['"'+table+'"',column]);
      assert.equal(result.allowed,allowed,table+"."+column);
    }
    for (const table of ["_prisma_migrations","NewsletterSubscriber","NewsletterRateBucket"]) {
      const {rows:[result]} = await db.query("SELECT has_table_privilege(current_user,$1,'SELECT') AS allowed",['"'+table+'"']);
      assert.equal(result.allowed,false,table);
    }
  } finally {await db.close();}
});
