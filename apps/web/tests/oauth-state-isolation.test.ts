import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { oauthConfiguration } from "../src/server/auth-readiness.ts";

test("a Google callback without its original state cookie creates no account or session", async () => {
  const origin = "https://vastunord-oauth.example.invalid";
  const secret = randomBytes(32).toString("hex");
  const records = { verification: [], user: [], account: [], session: [] };
  const auth = betterAuth({
    ...oauthConfiguration({
      BETTER_AUTH_URL: origin,
      GOOGLE_OAUTH_ENABLED: "true",
      GOOGLE_CLIENT_ID: "synthetic-client",
      GOOGLE_CLIENT_SECRET: "synthetic-secret",
    }),
    database: memoryAdapter(records),
    baseURL: origin,
    secret,
    account: { accountLinking: { enabled: false }, storeStateStrategy: "database", skipStateCookieCheck: false },
    logger: { disabled: true },
  });
  const started = await auth.handler(new Request(origin + "/api/auth/sign-in/social", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ provider: "google", callbackURL: "/app", disableRedirect: true }),
  }));
  assert.equal(started.status, 200);
  const state = new URL((await started.json()).url).searchParams.get("state");
  assert.ok(state);
  const callback = new URL(origin + "/api/auth/callback/google");
  callback.searchParams.set("state", state);
  callback.searchParams.set("code", "synthetic-code");
  const rejected = await auth.handler(new Request(callback));
  assert.equal(rejected.status, 302);
  assert.equal(records.user.length, 0);
  assert.equal(records.account.length, 0);
  assert.equal(records.session.length, 0);
});
