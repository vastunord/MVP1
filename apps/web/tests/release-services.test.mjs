import assert from "node:assert/strict";
import test from "node:test";
import { checkPranaReplies, probeReleaseProviders } from "../scripts/probe-release-providers.mjs";
import { releaseServiceChecks } from "../src/server/release-service-checks.ts";
import { productionGoogleClientId } from "../src/server/auth-readiness.ts";
import { productionStore, productionRuntimeRole, productionPool } from "../src/server/production-target.ts";
import { pranaModel } from "../src/server/prana.ts";

const release = {
  VERCEL_PROJECT_ID: "prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0", APP_ENV: "production", VERCEL_ENV: "production", VERCEL: "1",
  AUTH_ENABLED: "true", BETTER_AUTH_URL: "https://vastunord-web.vercel.app", BETTER_AUTH_SECRET: "f".repeat(32),
  DATABASE_URL: "postgresql://" + productionRuntimeRole + ":fixture@" + productionPool + "/neondb?sslmode=require",
  AUTH_EMAIL_PROVIDER: "resend", AUTH_EMAIL_FROM: "no-reply@vastu.no", RESEND_API_KEY: "fixture",
  GOOGLE_OAUTH_ENABLED: "true", GOOGLE_CLIENT_ID: productionGoogleClientId, GoogleOauth: "fixture",
  PRANA_ENABLED: "true", GroqAPI: "gsk_fixture", MEDIA_UPLOADS_ENABLED: "true", BLOB_STORE_ID: productionStore,
  MNML_RENDERING_ENABLED: "true", MNMLAPI: "mk_live_fixture", MNML_SUBMISSION_ENABLED: "true", MNML_TEST_CAMPAIGN_ID: "fixture",
};

test("optional bilingual provider check issues only two synthetic text requests", async () => {
  const calls = [];
  const http = async (url, init) => {
    assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
    const body = JSON.parse(init.body);
    calls.push(body.model);
    const sentence = calls.length === 1 ? "Try a reading lamp." : "Velg en leselampe.";
    return Response.json({choices:[{finish_reason:"stop",message:{content:JSON.stringify({kind:"home",sentences:[sentence]})}}]});
  };
  assert.deepEqual(await checkPranaReplies(release, http), {en:true, nb:true});
  assert.deepEqual(calls, [pranaModel, pranaModel]);
  await assert.rejects(checkPranaReplies({...release, VERCEL_ENV:"preview"}, http));
});

test("release features require their bindings individually", () => {
  assert.deepEqual(releaseServiceChecks({}), {});
  assert(Object.values(releaseServiceChecks(release)).every(Boolean));
  for (const [override, feature] of [
    [{ BETTER_AUTH_SECRET: "" }, "authentication"], [{ AUTH_EMAIL_FROM: "no-reply@other.test" }, "sender"],
    [{ GOOGLE_CLIENT_ID: "another-client" }, "google"], [{ PRANA_ENABLED: "false" }, "prana"],
    [{ BLOB_STORE_ID: "wrong-store" }, "privateMedia"], [{ DATABASE_URL: "postgresql://host.test/different" }, "privateMedia"],
    [{ MNMLAPI: "" }, "rendering"], [{ MNML_TEST_CAMPAIGN_ID: "" }, "controlledSubmission"],
  ]) assert(!releaseServiceChecks({ ...release, ...override })[feature]);
});

test("release probe uses only read-only account and model catalogs; output contains booleans only", async () => {
  const paths = new Set();
  const catalog = async (url, init) => {
    assert.equal(init.method ?? "GET", "GET");
    assert.equal(init.redirect, "error");
    paths.add(url);
    if (url === "https://api.mnml.ai/v2/engines")
      return Response.json({ data: { engines: [{ id: "v4.5-fast", available: true, prices: { render_usd: 0.099 } }] } });
    if (url === "https://api.mnml.ai/v2/account") return Response.json({ data: { balance_usd: 0.099 } });
    assert.equal(url, "https://api.groq.com/openai/v1/models");
    return Response.json({ data: [{ id: pranaModel, active: true }] });
  };
  const result = await probeReleaseProviders(release, catalog);
  assert.equal(paths.size, 3);
  assert(Object.values(result).every(x => x === true));
  await assert.rejects(probeReleaseProviders({ ...release, VERCEL_PROJECT_ID: "other" }, catalog));
  const failed = await probeReleaseProviders(release, async () => new Response("fixture-private", { status: 403 }));
  assert.equal(failed.mnmlApprovedCatalogAndBalance, false);
  assert.equal(failed.groqAuthorizedModelListed, false);
  assert(Object.values(failed).every(x => typeof x === "boolean"));
});
