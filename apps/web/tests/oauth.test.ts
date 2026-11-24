import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import {
  authReadiness,
  oauthConfiguration,
} from "../src/server/auth-readiness.ts";

const origin = "https://vastunord-auth.example.invalid";
const email = {
  BETTER_AUTH_URL: origin,
  BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  DATABASE_URL: "postgres://local@localhost/fixture",
  AUTH_EMAIL_PROVIDER: "resend",
  RESEND_API_KEY: "fixture",
  AUTH_EMAIL_FROM: "fixture@example.invalid",
};
const now = Math.floor(Date.now() / 1000);
function appleCredential(expires: number, clientId = "no.vastu.test") {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return [
    encode({ alg: "ES256", kid: "fixture" }),
    encode({
      iss: "fixture",
      sub: clientId,
      aud: "https://appleid.apple.com",
      iat: now,
      exp: expires,
    }),
    randomBytes(64).toString("base64url"),
  ].join(".");
}
const configured = {
  ...email,
  GOOGLE_OAUTH_ENABLED: "true",
  GOOGLE_CLIENT_ID: "google-test",
  GOOGLE_CLIENT_SECRET: "fixture",
  GITHUB_OAUTH_ENABLED: "true",
  GITHUB_CLIENT_ID: "github-test",
  GITHUB_CLIENT_SECRET: "fixture",
  APPLE_OAUTH_ENABLED: "true",
  APPLE_CLIENT_ID: "no.vastu.test",
  APPLE_CLIENT_SECRET: appleCredential(now + 3600),
};

test("optional providers gate independently of working email authentication", () => {
  assert.deepEqual(authReadiness(email).providers, []);
  assert.deepEqual(authReadiness(configured).providers, [
    "google",
    "github",
    "apple",
  ]);
  for (const patch of [
    { APPLE_CLIENT_SECRET: "incomplete" },
    { APPLE_CLIENT_SECRET: appleCredential(now - 1) },
    { APPLE_CLIENT_SECRET: appleCredential(now + 16_000_000) },
    { APPLE_CLIENT_SECRET: appleCredential(now + 600, "different-service") },
    { BETTER_AUTH_URL: "http://127.0.0.1:3100" },
  ]) {
    const state = authReadiness({ ...configured, ...patch });
    assert.equal(state.ready, true);
    assert.deepEqual(state.providers, ["google", "github"]);
  }
  assert.deepEqual(
    authReadiness({
      ...configured,
      GOOGLE_CLIENT_SECRET: "",
      GITHUB_OAUTH_ENABLED: "false",
    }).providers,
    ["apple"],
  );
  assert.equal(
    authReadiness({
      ...configured,
      APP_ENV: "development",
      VERCEL_ENV: "preview",
    }).ready,
    false,
  );
  assert.equal(
    authReadiness({
      ...configured,
      APP_ENV: "production",
      VERCEL_ENV: "production",
      AUTH_ENABLED: "false",
    }).ready,
    false,
  );
});

test("Better Auth starts each browser flow and rejects Google and Apple cancellations without creating accounts", async () => {
  const config = oauthConfiguration(configured);
  const records = { verification: [], user: [], account: [], session: [] };
  const auth = betterAuth({
    ...config,
    database: memoryAdapter(records),
    baseURL: origin,
    secret: email.BETTER_AUTH_SECRET,
    account: {
      accountLinking: { enabled: false },
      storeStateStrategy: "database",
      skipStateCookieCheck: false,
    },
    logger: { disabled: true },
  });
  const authorizeHosts = {
    google: "accounts.google.com",
    github: "github.com",
    apple: "appleid.apple.com",
  };
  for (const provider of ["google", "github", "apple"] as const) {
    const response = await auth.handler(
      new Request(origin + "/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: origin },
        body: JSON.stringify({
          provider,
          callbackURL: "/app",
          errorCallbackURL: "/en/login?oauth=incomplete",
          disableRedirect: true,
        }),
      }),
    );
    assert.equal(response.status, 200);
    const destination = new URL((await response.json()).url);
    assert.equal(destination.hostname, authorizeHosts[provider]);
    const callback = origin + "/api/auth/callback/" + provider;
    assert.equal(destination.searchParams.get("redirect_uri"), callback);
    const state = destination.searchParams.get("state");
    assert.ok(state);
    if (provider === "google") {
      const cookie = response.headers.getSetCookie().find((entry) => entry.includes(".state="));
      assert.ok(cookie);
      const cancellation = new URL(callback);
      cancellation.searchParams.set("error", "access_denied");
      cancellation.searchParams.set("state", state);
      const denied = await auth.handler(new Request(cancellation, { headers: { Cookie: cookie.split(";")[0] } }));
      assert.equal(denied.status, 302);
      const returned = new URL(denied.headers.get("location")!, origin);
      assert.equal(returned.pathname, "/en/login");
      assert.equal(returned.searchParams.get("error"), "access_denied");
      assert.equal(records.user.length + records.account.length + records.session.length, 0);
      const forged = new URL(callback);
      forged.searchParams.set("code", "synthetic-code");
      forged.searchParams.set("state", "invalid-state");
      const rejected = await auth.handler(new Request(forged, { headers: { Cookie: cookie.split(";")[0] } }));
      assert.equal(rejected.status, 302);
      assert.equal(records.user.length + records.account.length + records.session.length, 0);
      continue;
    }
    if (provider !== "apple") continue;
    assert.equal(destination.searchParams.get("response_mode"), "form_post");
    const cookie = response.headers
      .getSetCookie()
      .find((entry) => entry.includes(".state="));
    assert.ok(cookie);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /;\s*Secure(?:;|$)/i);
    assert.match(cookie, /SameSite=None/i);
    const postback = new Request(callback, {
      method: "POST",
      headers: {
        Origin: "https://appleid.apple.com",
        Cookie: cookie.split(";")[0],
      },
      body: new URLSearchParams({ error: "access_denied", state }),
    });
    assert.deepEqual(await config.trustedOrigins(postback), [
      origin,
      "https://appleid.apple.com",
    ]);
    assert.deepEqual(
      await config.trustedOrigins(
        new Request(origin + "/api/auth/sign-in/email", { method: "POST" }),
      ),
      [origin],
    );
    const posted = await auth.handler(postback);
    assert.equal(posted.status, 302);
    const resumed = await auth.handler(
      new Request(posted.headers.get("location")!, {
        headers: { Cookie: cookie.split(";")[0] },
      }),
    );
    assert.equal(resumed.status, 302);
    const failed = new URL(resumed.headers.get("location")!, origin);
    assert.equal(failed.pathname, "/en/login");
    assert.equal(failed.searchParams.get("error"), "access_denied");
    assert.equal(
      records.user.length + records.account.length + records.session.length,
      0,
    );
  }
});
