import { test } from "node:test";
import assert from "node:assert/strict";
import { renderEngines, unsupportedStudioOption } from "../src/lib/studio-render.ts";
import {
  previewPool,
  previewRole,
  previewStore,
} from "../src/server/preview-target.ts";
import { tools } from "@vastunord/contracts/tools";
import {
  parseRender,
  mnmlConfig,
  submitRender,
  checkRender,
  signedOutput,
  RenderError,
} from "../src/server/mnml.ts";
const input = {
  id: "19272b7a-989a-4229-a98d-984065cee206",
  consent: true,
  toolId: "room-reimagination",
  engine: "v4.5-fast",
  projectId: "project-a",
  sourceAssetId: "asset-a",
  referenceIds: [],
  values: {},
  prompt: "Light oak shelving",
  avoid: "",
};
test("MNML reads the provider key only in Development and the pinned Preview", () => {
  const env = { APP_ENV: "development", MNMLAPI: "fixture" };
  assert.deepEqual(mnmlConfig(env), { key: "fixture" });
  assert.deepEqual(
    mnmlConfig({ APP_ENV: "development", MNML_API_KEY: "alias" }),
    { key: "alias" },
  );
  assert.equal(mnmlConfig({ ...env, MNML_RENDERING_ENABLED: "false" }), null);
  assert.equal(mnmlConfig({ ...env, VERCEL_ENV: "production" }), null);
  assert.equal(
    mnmlConfig({ ...env, APP_ENV: "production", VERCEL_ENV: "production" }),
    null,
  );
  assert.equal(
    mnmlConfig({ ...env, APP_ENV: "preview", VERCEL_ENV: "preview" }),
    null,
  );
  const preview = {
    ...env,
    APP_ENV: "preview",
    VERCEL_ENV: "preview",
    BLOB_STORE_ID: previewStore,
    DATABASE_URL:
      "postgresql://" +
      previewRole +
      ":fixture@" +
      previewPool +
      "/neondb?sslmode=require",
  };
  assert(mnmlConfig(preview));
  assert.equal(mnmlConfig({ ...preview, BLOB_STORE_ID: "other" }), null);
  assert.equal(
    mnmlConfig({
      ...preview,
      DATABASE_URL: "postgresql://other@localhost/neondb",
    }),
    null,
  );
  assert.equal(mnmlConfig({ ...env, MNMLAPI: "" }), null);
});
test("Only the model with synthetic live evidence is accepted for rendering", () => {
  assert.equal(new Set(renderEngines.map((e) => e.providerId)).size, 5);
  for (const level of renderEngines) {
    if (level.verified)
      assert.equal(parseRender({ ...input, engine: level.id }).fields.engine, level.providerId);
    else
      assert.throws(() => parseRender({ ...input, engine: level.id }), /not available yet/);
  }
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
  assert.throws(() => parseRender({ ...input, values: { seed: "123" } }));
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
test("Only tool-compatible workflows are accepted", () => {
  assert.equal(parseRender({ ...input, workflow: "design" }).fields.mode, "interior");
  assert.equal(
    parseRender({ ...input, workflow: "style", referenceIds: ["photo-b"] })
      .fields.mode,
    "interior",
  );
  assert.throws(() => parseRender({ ...input, workflow: "style" }));
  for (const workflow of ["sketch", "plan", "masterplan", "concept", "video"])
    assert.throws(() => parseRender({ ...input, workflow }), /unavailable/);
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
test("unsupported manual controls share the same client and server policy", () => {
  for (const [toolId, value] of [["visual-cleanup", "Brush & delete"], ["resolution-enhancement", "Manual controls"]]) {
    assert.equal(unsupportedStudioOption(toolId, "mode", value), true);
    assert.throws(() => parseRender({ ...input, toolId, values: { mode: value } }));
  }
  assert.equal(unsupportedStudioOption("visual-cleanup", "mode", "AI object editing"), false);
  assert.equal(unsupportedStudioOption("resolution-enhancement", "mode", "Auto enhance"), false);
});
test("every visible unconditional supported choice is accepted by the same server contract", () => {
  for (const tool of tools) {
    for (const control of tool.controls) {
      if (control.kind !== "select" || control.when || control.id === "palette") continue;
      for (const choice of control.options ?? []) {
        if (unsupportedStudioOption(tool.id, control.id, choice)) continue;
        assert.doesNotThrow(() => parseRender({
          ...input,
          toolId: tool.id,
          prompt: tool.id === "resolution-enhancement" ? "" : "Describe the change",
          values: { [control.id]: choice },
        }), `${tool.id} / ${control.id} / ${choice}`);
      }
    }
  }
});
test("conditional supported choices follow their parent selection without silently accepting hidden precision", () => {
  for (const tool of tools) {
    for (const control of tool.controls) {
      if (control.kind !== "select" || !control.when) continue;
      for (const parent of control.when.values) {
        if (unsupportedStudioOption(tool.id, control.when.id, parent)) continue;
        for (const choice of control.options ?? []) {
          assert.doesNotThrow(() => parseRender({
            ...input, toolId: tool.id, prompt: "Describe the change",
            values: { [control.when!.id]: parent, [control.id]: choice },
          }), `${tool.id} / ${control.id} / ${parent} / ${choice}`);
        }
      }
    }
  }
  const pool = { ...input, toolId: "pool-redesign", values: { mode: "Pool" } };
  assert.equal(parseRender(pool).hash, parseRender({ ...pool, values: { mode: "Pool", "spa-option-0": "In-ground spa" } }).hash);
  assert.throws(() => parseRender({ ...input, toolId: "perspective-correction", values: { mode: "Camera angle", vertical: 12 } }), /unavailable/);
  assert.throws(() => parseRender({ ...input, toolId: "resolution-enhancement", prompt: "", values: { mode: "Auto enhance", "adjust-0": 10 } }), /unavailable/);
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
  assert.throws(
    () => parseRender({ ...input, toolId: "perspective-correction", values: { mode: "Fix distortion", vertical: 12 } }),
    /unavailable/,
  );
  for (const value of [0, 100])
    assert.match(String(parseRender({ ...input, toolId: "lighting-reimagination", values: { brightness: value } }).fields.prompt), new RegExp(`Brightness: ${value}`));
  for (const value of [-1, 101, "not-a-number"])
    assert.throws(() => parseRender({ ...input, toolId: "lighting-reimagination", values: { brightness: value } }), /Invalid numeric/);
  assert.throws(() => parseRender({ ...input, toolId: "lighting-reimagination", values: { temperature: 3000 } }), /unavailable/);
  assert.throws(() => parseRender({ ...input, toolId: "lighting-reimagination", values: { preview: false } }), /preview control is unavailable/);
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
    assert.equal(body.engine, "v4.5-fast");
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
test("a provider credential rejection is a confirmed failure without leaking response details", async () => {
  await assert.rejects(
    submitRender("fixture", parseRender(input), "data:image/png;base64,test", [], async () =>
      new Response("sensitive provider response", { status: 401 }),
    ),
    (error: unknown) =>
      error instanceof RenderError &&
      error.status === 503 &&
      error.confirmedRejection &&
      !error.message.includes("sensitive"),
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
