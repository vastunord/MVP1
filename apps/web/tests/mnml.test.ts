import { test } from "node:test";
import assert from "node:assert/strict";
import { tools } from "@vastunord/contracts/tools";
import {
  parseRender,
  mnmlConfig,
  submitRender,
  checkRender,
  signedOutput,
} from "../src/server/mnml.ts";
const input = {
  id: "19272b7a-989a-4229-a98d-984065cee206",
  consent: true,
  toolId: "room-reimagination",
  engine: "v4.6-ultra",
  projectId: "project-a",
  sourceAssetId: "asset-a",
  referenceIds: [],
  values: {},
  prompt: "Light oak shelving",
  avoid: "",
};
test("MNML is opt-in and restricted to a development environment with a finite daily budget", () => {
  const env = {
    APP_ENV: "development",
    MNML_RENDERING_ENABLED: "true",
    MNML_API_KEY: "test-key",
    MNML_DAILY_JOB_LIMIT: "2",
  };
  assert(mnmlConfig(env));
  for (const change of [
    { VERCEL_ENV: "production" },
    { APP_ENV: "preview" },
    { MNML_DAILY_JOB_LIMIT: "0" },
    { MNML_DAILY_JOB_LIMIT: "1001" },
    { MNML_API_KEY: "" },
    { MNML_RENDERING_ENABLED: "false" },
  ])
    assert.equal(mnmlConfig({ ...env, ...change }), null);
});
test("All 17 editors select an appropriate provider operation", () => {
  for (const tool of tools) {
    const spec = parseRender({
      ...input,
      toolId: tool.id,
      prompt:
        tool.id === "resolution-enhancement" ? "" : "Change the selected area",
    });
    assert(["renders", "edits", "enhancements"].includes(spec.endpoint));
  }
  assert.equal(
    parseRender({ ...input, values: { seed: "123", ratio: "16:9" } }).fields
      .seed,
    123,
  );
  assert.equal(
    parseRender({ ...input, toolId: "object-placement" }).endpoint,
    "edits",
  );
  assert.equal(
    parseRender({ ...input, toolId: "resolution-enhancement", prompt: "" })
      .fields.kind,
    "enhance",
  );
});
test("Scene, plan, style, concept and walkthrough modes use documented endpoints and fields", () => {
  for (const [workflow, mode] of [
    ["design", "interior"],
    ["sketch", "interior"],
    ["masterplan", "masterplan"],
    ["plan", "plan"],
  ]) {
    assert.equal(parseRender({ ...input, workflow }).fields.mode, mode);
  }
  assert.equal(
    parseRender({ ...input, workflow: "style", referenceIds: ["photo-b"] })
      .fields.mode,
    "interior",
  );
  assert.throws(() => parseRender({ ...input, workflow: "style" }));
  const textOnly = parseRender({ ...input, workflow: "concept" });
  assert.equal(textOnly.fields.mode, "text-to-render");
  assert.equal(textOnly.sourceAssetId, null);
  assert.throws(() =>
    parseRender({ ...input, workflow: "concept", prompt: "" }),
  );
  const video = parseRender({ ...input, workflow: "video" });
  assert.equal(video.endpoint, "videos");
  assert.deepEqual(video.fields, {
    model: "v2.0-flash",
    duration_seconds: 10,
    camera_movement: "dolly-in",
    motion: "subtle",
  });
  assert.throws(() =>
    parseRender({ ...input, workflow: "video", referenceIds: ["photo-b"] }),
  );
  assert.equal(
    parseRender({
      ...input,
      toolId: "resolution-enhancement",
      workflow: "upscale",
    }).fields.kind,
    "upscale",
  );
  assert.throws(() => parseRender({ ...input, workflow: "upscale" }));
});
test("MNML validates asset selection, options, consent and single-image mode before dispatch", () => {
  for (const change of [
    { consent: false },
    { sourceAssetId: "https://foreign.example/photo" },
    { id: "invalid" },
    { prompt: "a".repeat(4001) },
    { referenceIds: ["asset-a"] },
    { toolId: "unknown" },
    { engine: "other" },
    { values: { seed: "4294967296" } },
    { values: { room: "unknown" } },
    { values: { extra: 123 } },
    { toolId: "resolution-enhancement", values: { mode: "Manual controls" } },
    { toolId: "visual-cleanup", values: { mode: "Brush & delete" } },
  ])
    assert.throws(() => parseRender({ ...input, ...change }));
  assert.equal(parseRender(input).hash, parseRender(input).hash);
  assert.notEqual(
    parseRender(input).hash,
    parseRender({ ...input, prompt: "Different brief" }).hash,
  );
});
test("One provider submission sends explicit private input and reuses the stable local key", async () => {
  const spec = parseRender(input);
  const provider: typeof fetch = async (url, opts) => {
    assert.equal(String(url), "https://api.mnml.ai/v2/renders");
    assert.equal(new Headers(opts?.headers).get("Idempotency-Key"), input.id);
    assert.equal(opts?.redirect, "error");
    const body = JSON.parse(String(opts?.body));
    assert.equal(body.count, 1);
    assert.equal(body.mode, "interior");
    assert.equal(body.image, "data:image/png;base64,test");
    assert.equal(body.webhook_url, undefined);
    assert.equal(body.engine, "v4.6-ultra");
    return Response.json(
      {
        success: true,
        data: { id: "23", status: "queued", charged_usd: 0.2475 },
      },
      { status: 202 },
    );
  };
  assert.equal(
    (
      await submitRender(
        "fixture",
        spec,
        "data:image/png;base64,test",
        [],
        provider,
      )
    ).id,
    "23",
  );
});
test("Provider job status and private output URLs stay bound to the requested MNML job", async () => {
  const job = await checkRender("fixture", "23", async () =>
    Response.json({
      success: true,
      data: {
        id: "23",
        status: "succeeded",
        outputs: [
          {
            media: "image",
            url: "https://api.mnml.ai/v2/files/23?exp=123&sig=fixture",
          },
        ],
      },
    }),
  );
  assert.equal(signedOutput(job).pathname, "/v2/files/23");
  for (const url of [
    "https://example.org/23",
    "https://api.mnml.ai/v2/files/24?exp=123&sig=f",
    "https://api.mnml.ai/v2/files/23",
  ])
    assert.throws(() =>
      signedOutput({ ...job, outputs: [{ url, media: "image" }] }),
    );
  await assert.rejects(
    checkRender("fixture", "23", async () =>
      Response.json({ success: true, data: { id: "24", status: "queued" } }),
    ),
  );
});
