import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { acceptanceIdentityPolicy } from "../src/server/auth-acceptance.ts";
import { productionAuthOrigin, productionGoogleClientId, oauthConfiguration, verifiedSessionUserId } from "../src/server/auth-readiness.ts";

const env = {
  APP_ENV: "production", VERCEL_ENV: "production", BETTER_AUTH_URL: productionAuthOrigin,
  GOOGLE_OAUTH_ENABLED: "true", GOOGLE_CLIENT_ID: productionGoogleClientId, GoogleOauth: "fixture-only",
};
const email = "contact@vastu.no";

test("controlled acceptance permits only the approved, verified session and the approved Google application", () => {
  for (const [address, verified, allowed] of [
    [email, true, true], [email.toUpperCase(), true, true], [email, false, false],
    ["other@example.invalid", true, false], [undefined, true, false],
  ] as const) {
    assert.equal(Boolean(verifiedSessionUserId({ user: { id: "fixture", email: address, emailVerified: verified } }, env)), allowed);
  }
  assert.deepEqual(Object.keys(oauthConfiguration({ ...env, GITHUB_OAUTH_ENABLED: "true", GITHUB_CLIENT_ID: "fixture", GITHUB_CLIENT_SECRET: "fixture" }).socialProviders), ["google"]);
  assert.deepEqual(oauthConfiguration({ ...env, GOOGLE_CLIENT_ID: "different" }).socialProviders, {});
  assert.deepEqual(oauthConfiguration({ ...env, GoogleOauth: "" }).socialProviders, {});
});

test("real Better Auth handlers enforce invitation, email verification, explicit linking, session invalidation and password recovery using isolated fixtures", async () => {
  // All credentials, URLs and messages remain in memory. No mail or external OAuth requests.
  const records = { verification: [], User: [], Account: [], session: [] };
  const sent: { address: string; url: string; kind: string }[] = [];
  const auth = betterAuth({
    ...oauthConfiguration(env), ...acceptanceIdentityPolicy(env),
    database: memoryAdapter(records), baseURL: productionAuthOrigin,
    secret: randomBytes(32).toString("hex"), logger: { disabled: true },
    emailAndPassword: {
      enabled: true, requireEmailVerification: true, autoSignIn: false, revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => { sent.push({ address: user.email, url, kind: "reset" }); },
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: async ({ user, url }) => { sent.push({ address: user.email, url, kind: "verify" }); },
    },
  });
  const post = (path: string, body: object, cookie = "") => auth.handler(new Request(productionAuthOrigin + "/api/auth/" + path, {
    method: "POST", headers: { Origin: productionAuthOrigin, "Content-Type": "application/json", Cookie: cookie }, body: JSON.stringify(body),
  }));
  const get = (path: string, cookie = "") => auth.handler(new Request(productionAuthOrigin + "/api/auth/" + path, { headers: { Cookie: cookie } }));
  const password = randomBytes(18).toString("hex");
  const signup = { name: "Acceptance fixture", email, password, callbackURL: "/login?verified=1" };
  const foreign = { ...signup, email: "fixture@example.invalid" };
  for (const path of ["sign-up/email", "sign-in/email", "send-verification-email", "request-password-reset"]) {
    assert.equal((await post(path, foreign)).status, 403, path);
  }
  assert.equal(records.User.length, 0);
  assert.equal(sent.length, 0);
  assert.equal((await post("link-social", { provider: "google" })).status, 401);
  assert.equal((await post("sign-up/email", signup)).status, 200);
  assert.equal(records.User.length, 1);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].address, email);
  assert.equal((await post("sign-in/email", { email, password })).status, 403);
  const confirmation = await auth.handler(new Request(sent[0].url));
  assert.equal(confirmation.status, 302);
  assert.ok(confirmation.headers.get("location")?.endsWith("/login?verified=1"));
  const rejected = await post("sign-in/email", { email, password: "incorrect-fixture-only" });
  assert.equal(rejected.status, 401);
  const signedIn = await post("sign-in/email", { email, password });
  assert.equal(signedIn.status, 200);
  const cookie = signedIn.headers.getSetCookie().map((entry) => entry.split(";")[0]).join("; ");
  assert.equal((await (await get("get-session", cookie)).json()).user.emailVerified, true);
  const link = await post("link-social", { provider: "google", callbackURL: "/app/settings", disableRedirect: true }, cookie);
  assert.equal(link.status, 200);
  const next = new URL((await link.json()).url);
  assert.equal(next.origin, "https://accounts.google.com");
  assert.equal(next.searchParams.get("redirect_uri"), productionAuthOrigin + "/api/auth/callback/google");
  assert.equal((await post("sign-out", {}, cookie)).status, 200);
  assert.equal(await (await get("get-session", cookie)).json(), null);
  const recovery = await post("request-password-reset", { email, redirectTo: productionAuthOrigin + "/en/reset-password" });
  assert.equal(recovery.status, 200);
  const reset = sent.find((entry) => entry.kind === "reset");
  assert.ok(reset);
  assert.equal(reset.address, email);
  const follow = await auth.handler(new Request(reset.url));
  assert.equal(follow.status, 302);
  const destination = new URL(follow.headers.get("location")!, productionAuthOrigin);
  assert.equal(destination.pathname, "/en/reset-password");
  const replacement = randomBytes(18).toString("hex");
  assert.equal((await post("reset-password", { token: destination.searchParams.get("token"), newPassword: replacement })).status, 200);
  assert.equal((await post("sign-in/email", { email, password })).status, 401);
  assert.equal((await post("sign-in/email", { email, password: replacement })).status, 200);
  assert.equal(records.User.length, 1);
  assert.equal(records.Account.length, 1);
});
