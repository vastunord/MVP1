import { test } from "node:test";
import assert from "node:assert/strict";
import {
  askPrana,
  obviousMisuse,
  pranaRedirect,
  pranaSettings,
  validQuestion,
} from "../src/server/prana.ts";

const development = {
  APP_ENV: "development",
  DATABASE_URL: "postgres://localhost/fixture",
  OPENAI_API_KEY: "fixture",
  BETTER_AUTH_SECRET: "a".repeat(40),
  BETTER_AUTH_URL: "http://127.0.0.1:3100",
  PRANA_ENABLED: "true",
  PRANA_DAILY_QUERY_LIMIT: "5",
};
test("consultation requires an explicit environment, cap, quota database and key", () => {
  assert.equal(pranaSettings(development)?.dailyLimit, 5);
  for (const config of [
    { PRANA_ENABLED: "false" },
    { PRANA_DAILY_QUERY_LIMIT: "0" },
    { PRANA_DAILY_QUERY_LIMIT: "other" },
    { DATABASE_URL: "" },
    { OPENAI_API_KEY: "" },
    { BETTER_AUTH_URL: "https://example.org/path" },
    { APP_ENV: "preview" },
    { APP_ENV: "production", VERCEL_ENV: "production" },
    { APP_ENV: "development", VERCEL_ENV: "production" },
  ]) {
    assert.equal(pranaSettings({ ...development, ...config }), null);
  }
  assert(!validQuestion("  "));
  assert(!validQuestion("x".repeat(601)));
  assert(validQuestion("Hva er god stuebelysning?"));
  assert(obviousMisuse("That fucking room"));
  assert(!obviousMisuse("What is a good countertop material?"));
});

const consultation = {
  question: "Can I soften the light in my home?",
  language: "en" as const,
  key: "fixture",
  notes: "Use layered light.",
};
function respond(
  kind: string,
  sentences: string[],
  observe?: (request: RequestInit) => void,
): typeof fetch {
  return async (url, init) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    observe?.(init!);
    return Response.json({
      status: "completed",
      output: [
        {
          type: "message",
          content: [
            { type: "output_text", text: JSON.stringify({ kind, sentences }) },
          ],
        },
      ],
    });
  };
}
test("a short provider answer uses a server-side key, private single-turn input and the published guidance", async () => {
  const answer = "Bounce light from a floor lamp off a pale wall.";
  const result = await askPrana(
    consultation,
    respond("home", [answer], (init) => {
      const sent = JSON.parse(String(init.body));
      assert.equal(sent.store, false);
      assert.equal(sent.text.format.strict, true);
      assert.equal(sent.input.length, 1);
      assert.equal(sent.input[0].content, consultation.question);
      assert.equal(sent.model, "gpt-4.1-mini");
      assert.ok(sent.instructions.includes(consultation.notes));
      assert.ok(!sent.instructions.includes(consultation.question));
    }),
  );
  assert.deepEqual(result, { kind: "home", answer });
});
test("off-topic, abusive and unsafe replies use polite localized redirects", async () => {
  for (const kind of ["outside", "abuse", "unsafe"] as const) {
    const result = await askPrana(
      { ...consultation, language: "nb-NO" },
      respond(kind, ["untrusted provider text"]),
    );
    assert.deepEqual(result, pranaRedirect(kind, "nb-NO"));
    assert(!result.answer.includes("untrusted"));
  }
});
test("overlong, malformed or unavailable answers do not become chat replies", async () => {
  for (const result of [
    respond("home", ["First. Second. Third. Fourth."]),
    respond("home", ["word ".repeat(77)]),
    respond("home", ["Read https://example.com"]),
    respond("other", []),
    async () => new Response(null, { status: 429 }),
  ]) {
    await assert.rejects(askPrana(consultation, result));
  }
});
