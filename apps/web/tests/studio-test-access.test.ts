import { test } from "node:test";
import assert from "node:assert/strict";
import { controlledRenderingAllowanceReady } from "../src/lib/studio-test-access.ts";
import { verifyTestRenderQuote } from "../src/server/mnml-test-quote.ts";
import type { PrismaClient } from "../src/generated/prisma/client.ts";

test("only Production with the switch and a positive database allowance can submit", async () => {
  let calls = 0;
  let eligible = false;
  const db = {$queryRaw:async () => { calls++; return [{ready:eligible}]; }} as unknown as PrismaClient;
  const env={APP_ENV:"production", VERCEL_ENV:"production", MNML_TEST_CAMPAIGN_ID:"candidate", MNML_SUBMISSION_ENABLED:"true"};
  assert.equal(await controlledRenderingAllowanceReady(db,"tester",{...env,MNML_SUBMISSION_ENABLED:"false"}),false);
  assert.equal(await controlledRenderingAllowanceReady(db,"tester",{...env,VERCEL_ENV:"preview"}),false);
  assert.equal(calls,0);
  assert.equal(await controlledRenderingAllowanceReady(db,"outsider",env),false);
  eligible=true;
  assert.equal(await controlledRenderingAllowanceReady(db,"tester",env),true);
  const unavailable = {$queryRaw:async () => { throw new Error("Fixture database failure"); }} as unknown as PrismaClient;
  assert.equal(await controlledRenderingAllowanceReady(unavailable,"tester",env),false);
});

test("catalogue preflight requires exact model, single-image price and sufficient prepaid funds", async () => {
  const model = {id:"v4.5-fast", available:true, prices:{render_usd:0.099}};
  function provider(engine:typeof model, balance:number): typeof fetch {
    return async (url, init) => {
      assert.equal(init?.redirect,"error");
      assert.equal(new Headers(init?.headers).get("authorization"),"Bearer fixture");
      assert.ok(String(url).startsWith("https://api.mnml.ai/v2/"));
      return Response.json({data:String(url).endsWith("/engines") ? {engines:[engine]} : {balance_usd:balance}});
    };
  }
  assert.equal(await verifyTestRenderQuote("fixture",provider(model,0.099)),99000);
  await assert.rejects(verifyTestRenderQuote("fixture",provider(model,0.098)));
  await assert.rejects(verifyTestRenderQuote("fixture",provider({...model,prices:{render_usd:0.099001}},1)));
  await assert.rejects(verifyTestRenderQuote("fixture",provider({...model,id:"v4.6"},1)));
  await assert.rejects(verifyTestRenderQuote("fixture",provider({...model,available:false},1)));
});
