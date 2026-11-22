import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { test } from "node:test";
import { previewPool, previewRole } from "../src/server/preview-target.ts";
import {
  consentRequest,
  hour,
  newsletterSettings,
  newsletterToken,
  rateWindow,
  requestConfirmation,
  subscriberFromToken,
  type NewsletterStore,
} from "../src/server/newsletter.ts";

const secret = randomBytes(32).toString("hex");
const origin = "http://127.0.0.1:3100";
const now = new Date("2026-11-22T12:00:00.000Z");
const input = { email: "example@example.invalid", locale: "en" } as const;
const id = randomUUID();
const enabled = {
  APP_ENV: "development",
  DATABASE_URL: "postgres://local:fixture@localhost/fixture",
  BETTER_AUTH_URL: origin,
  AUTH_EMAIL_PROVIDER: "resend",
  AUTH_EMAIL_FROM: "newsletter@example.invalid",
  RESEND_API_KEY: "fixture",
  NEWSLETTER_ENABLED: "true",
  NEWSLETTER_TOKEN_SECRET: secret,
};

test("Preview enrollment and withdrawal use the isolated pool and exact deployment origin", () => {
  const preview = {
    ...enabled, APP_ENV: "preview", VERCEL_ENV: "preview",
    VERCEL_URL: "vastunord-web-fixture.vercel.app",
    DATABASE_URL: `postgresql://${previewRole}:fixture@${previewPool}/neondb?sslmode=require`,
  };
  assert.equal(newsletterSettings(preview)?.origin, "https://" + preview.VERCEL_URL);
  assert.equal(newsletterSettings({ ...preview, DATABASE_URL: enabled.DATABASE_URL }), null);
  assert.equal(newsletterSettings({ ...preview, VERCEL_URL: "example.invalid" }), null);
  assert.equal(newsletterSettings({ ...preview, VERCEL_ENV: "production" }), null);
  assert.equal(newsletterSettings({ ...preview, NEWSLETTER_ENABLED: "false" }), null);
  assert.ok(newsletterSettings({ ...preview, NEWSLETTER_ENABLED: "false" }, true));
});

test("newsletter activation requires a scoped origin, sender, database and key and an approved commercial Production release", () => {
  assert.deepEqual(newsletterSettings(enabled), { origin, secret });
  const production = {...enabled, APP_ENV:"production", VERCEL_ENV:"production", BETTER_AUTH_URL:"https://vastunord-web.vercel.app", COMMERCIAL_LAUNCH_APPROVED:"true"};
  assert.equal(newsletterSettings(production)?.origin, production.BETTER_AUTH_URL);
  assert.equal(newsletterSettings({...production, COMMERCIAL_LAUNCH_APPROVED:"false"}), null);
  assert.equal(newsletterSettings({...production, BETTER_AUTH_URL:origin}), null);
  assert.ok(newsletterSettings({...production, NEWSLETTER_ENABLED:"false", COMMERCIAL_LAUNCH_APPROVED:"false"}, true));
  assert.equal(newsletterSettings({ ...enabled, VERCEL: "1" }), null);
  for (const key of Object.keys(enabled))
    assert.equal(newsletterSettings({ ...enabled, [key]: "" }), null);
  for (const env of ["preview", "production"]) {
    assert.equal(newsletterSettings({ ...enabled, APP_ENV: env }), null);
    assert.equal(newsletterSettings({ ...enabled, VERCEL_ENV: env }), null);
  }
  for (const url of [
    "ftp://localhost",
    "http://example.invalid",
    origin + "/path",
  ]) {
    assert.equal(
      newsletterSettings({ ...enabled, BETTER_AUTH_URL: url }),
      null,
    );
  }
  assert.ok(
    newsletterSettings(
      { ...enabled, NEWSLETTER_ENABLED: "false", RESEND_API_KEY: "" },
      true,
    ),
  );
  assert.equal(
    newsletterSettings({ ...enabled, VERCEL_ENV: "production" }, true),
    null,
  );
});

test("newsletter input requires an explicit independent consent and a supported locale", () => {
  assert.deepEqual(
    consentRequest({
      email: " Example@Example.Invalid ",
      consent: true,
      locale: "en",
    }),
    input,
  );
  for (const invalid of [
    { consent: false },
    { consent: "yes" },
    { email: "invalid" },
    { email: "<test@example.invalid>" },
    { email: "a..b@example.invalid" },
    { email: "x\n@example.invalid" },
    { locale: "fr" },
  ]) {
    assert.equal(consentRequest({ ...input, consent: true, ...invalid }), null);
  }
});

test("only a purpose-bound intact confirmation is valid for 24 hours; withdrawal remains available", () => {
  const confirm = newsletterToken("confirm", id, now, secret);
  const withdraw = newsletterToken("unsubscribe", id, now, secret);
  assert.equal(subscriberFromToken("confirm", confirm, now, secret), id);
  assert.equal(
    subscriberFromToken("confirm", confirm, new Date(+now + 24 * hour), secret),
    null,
  );
  assert.equal(
    subscriberFromToken(
      "unsubscribe",
      withdraw,
      new Date(+now + 365 * 24 * hour),
      secret,
    ),
    id,
  );
  assert.equal(subscriberFromToken("unsubscribe", confirm, now, secret), null);
  assert.equal(subscriberFromToken("confirm", withdraw, now, secret), null);
  assert.equal(
    subscriberFromToken("confirm", confirm, now, secret + "different"),
    null,
  );
  assert.equal(
    subscriberFromToken("unsubscribe", withdraw + "X", now, secret),
    null,
  );
});

test("limits use short-lived pseudonymous client keys", () => {
  const client = "192.0.2.40";
  const first = rateWindow(now, client, secret);
  assert.equal(first.expiresAt.getTime(), +now + hour);
  assert.ok(!first.clientKey.includes(client));
  assert.notEqual(
    rateWindow(first.expiresAt, client, secret).clientKey,
    first.clientKey,
  );
  assert.notEqual(
    rateWindow(now, "192.0.2.42", secret).clientKey,
    first.clientKey,
  );
});

test("only a persisted reservation sends a localized email, without marking the recipient confirmed", async () => {
  const state: {
    reservation: "reserved" | "limited" | "duplicate";
    releases: number;
  } = { reservation: "reserved", releases: 0 };
  const store: NewsletterStore = {
    reserve: async () =>
      state.reservation === "reserved"
        ? { status: "reserved", id }
        : { status: state.reservation },
    releaseFailedAttempt: async () => {
      state.releases += 1;
    },
    apply: async () => assert.fail("Confirmation needs a separate visit"),
  };
  for (const locale of ["en", "nb-NO"] as const) {
    const prefix = locale === "en" ? "/en" : "";
    const result = await requestConfirmation(
      store,
      async (email, subject, text) => {
        assert.equal(email, input.email);
        assert.match(subject, locale === "en" ? /Confirm/ : /Bekreft/);
        const links = text
          .split("\n")
          .filter((line) => line.startsWith(origin))
          .map((value) => new URL(value));
        assert.deepEqual(
          links.map((link) => link.pathname),
          [prefix + "/newsletter/confirm", prefix + "/newsletter/unsubscribe"],
        );
        assert.ok(links.every((link) => link.search === ""));
        assert.equal(
          subscriberFromToken("confirm", links[0].hash.slice(1), now, secret),
          id,
        );
        assert.equal(
          subscriberFromToken(
            "unsubscribe",
            links[1].hash.slice(1),
            now,
            secret,
          ),
          id,
        );
      },
      { ...input, locale },
      { origin, secret },
      "local",
      now,
    );
    assert.equal(result, "requested");
  }
  await assert.rejects(
    requestConfirmation(
      store,
      async () => {
        throw Error("delivery failure");
      },
      input,
      { origin, secret },
      "local",
      now,
    ),
    /delivery unavailable/,
  );
  assert.equal(state.releases, 1);
  for (const status of ["limited", "duplicate"] as const) {
    state.reservation = status;
    assert.equal(
      await requestConfirmation(
        store,
        async () => assert.fail("Unexpected send"),
        input,
        { origin, secret },
        "local",
        now,
      ),
      status,
    );
  }
});
