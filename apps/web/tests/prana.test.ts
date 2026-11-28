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
  GroqAPI: "fixture",
  BETTER_AUTH_URL: "http://127.0.0.1:3100",
};
test("Groq uses the server credential and the matching environment origin", () => {
  assert.equal(pranaSettings(development)?.origin, development.BETTER_AUTH_URL);
  assert.equal(
    pranaSettings({
      ...development,
      APP_ENV: "preview",
      VERCEL_ENV: "preview",
      VERCEL_URL: "vastunord-fixture.vercel.app",
    })?.origin,
    "https://vastunord-fixture.vercel.app",
  );
  for (const config of [
    { GroqAPI: "" },
    { BETTER_AUTH_URL: "https://example.org/path" },
    { APP_ENV: "preview" },
    { APP_ENV: "production", VERCEL_ENV: "production" },
    { APP_ENV: "development", VERCEL_ENV: "production" },
  ])
    assert.equal(pranaSettings({ ...development, ...config }), null);
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
    assert.equal(url, "https://api.groq.com/openai/v1/chat/completions");
    observe?.(init!);
    return Response.json({
      choices: [
        {
          finish_reason: "stop",
          message: { content: JSON.stringify({ kind, sentences }) },
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
      assert.equal(sent.response_format.json_schema.strict, true);
      assert.equal(sent.messages.length, 2);
      assert.deepEqual(sent.messages[1], {
        role: "user",
        content: consultation.question,
      });
      assert.equal(sent.model, "openai/gpt-oss-20b");
      assert.ok(sent.messages[0].content.includes(consultation.notes));
      assert.ok(!sent.messages[0].content.includes(consultation.question));
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
test("Studio uses the same provider and requests a brief rewrite preserving visitor constraints", async () => {
  const result = await askPrana(
    { ...consultation, mode: "improve" },
    respond("home", ["Keep the oak floor and warm light."], (request) => {
      const { messages } = JSON.parse(String(request.body));
      assert.match(messages[0].content, /Preserve requested room/);
      assert.equal(messages[1].content, consultation.question);
    }),
  );
  assert.equal(result.answer, "Keep the oak floor and warm light.");
});

test("controlled Production consultation requires the canonical origin and explicit switches", () => {
  const release = {
    ...development, APP_ENV: "production", VERCEL_ENV: "production", PRANA_ENABLED: "true",
    AUTH_ENABLED: "true", BETTER_AUTH_URL: "https://vastunord-web.vercel.app",
  };
  assert.equal(pranaSettings(release)?.origin, release.BETTER_AUTH_URL);
  for (const changed of [{ PRANA_ENABLED: "false" }, { PRANA_ENABLED: undefined }, { AUTH_ENABLED: "false" },
    { BETTER_AUTH_URL: "https://other.vercel.app" }, { VERCEL_ENV: "preview" }, { GroqAPI: "xai-fixture" }])
    assert.equal(pranaSettings({ ...release, ...changed }), null);
});

test("Groq rate limit and timeout never automatically resend the question", async () => {
  for (const fail of [async () => new Response(null, { status: 429 }), async () => { throw new DOMException("Timed out", "TimeoutError"); }]) {
    let requests = 0;
    await assert.rejects(askPrana(consultation, async (_url, init) => {
      requests++;
      assert.equal(init?.redirect, "error");
      assert.ok(init?.signal instanceof AbortSignal);
      return fail();
    }));
    assert.equal(requests, 1);
  }
});
