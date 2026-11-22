import { isPreviewDatabase, previewStore } from "./preview-target.ts";
import { createHash } from "node:crypto";
import { findTool, visibleControls } from "@vastunord/contracts/tools";
import {
  renderEngines,
  renderMode,
  sceneWorkflows,
  type BriefValues,
} from "../lib/studio-render.ts";

const root = "https://api.mnml.ai/v2";
export const jobIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const providerId = /^[a-zA-Z0-9_-]{1,100}$/;
export class RenderError extends Error {
  status: number;
  confirmedRejection: boolean;
  constructor(status: number, message: string, confirmedRejection = false) {
    super(message);
    this.status = status;
    this.confirmedRejection = confirmedRejection;
  }
}
export function mnmlConfig(
  env: Record<string, string | undefined> = process.env,
) {
  const key = env.MNMLAPI?.trim() || env.MNML_API_KEY?.trim();
  const development =
    env.APP_ENV === "development" &&
    (!env.VERCEL_ENV || env.VERCEL_ENV === "development");
  const preview =
    env.APP_ENV === "preview" &&
    env.VERCEL_ENV === "preview" &&
    env.BLOB_STORE_ID === previewStore &&
    isPreviewDatabase(env.DATABASE_URL);
  if (
    !key ||
    (!development && !preview) ||
    env.MNML_RENDERING_ENABLED === "false"
  )
    return null;
  return { key };
}
function text(value: unknown, limit: number) {
  if (typeof value !== "string" || value.length > limit)
    throw new RenderError(400, "Invalid render brief");
  return value.trim();
}
function assetId(value: unknown) {
  if (typeof value !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(value))
    throw new RenderError(400, "Invalid image selection");
  return value;
}
export function parseRender(input: Record<string, unknown>) {
  const id = text(input.id, 36);
  if (!jobIdPattern.test(id) || input.consent !== true)
    throw new RenderError(400, "Confirm external image processing");
  const workflow = input.workflow ?? "design";
  if (!sceneWorkflows.some((w) => w.id === workflow) && workflow !== "upscale")
    throw new RenderError(400, "Invalid workflow");
  const projectId = assetId(input.projectId),
    sourceAssetId =
      workflow === "concept" ? null : assetId(input.sourceAssetId);
  if (!Array.isArray(input.referenceIds) || input.referenceIds.length > 2)
    throw new RenderError(400, "Invalid references");
  const referenceIds = input.referenceIds.map(assetId);
  if (
    new Set([sourceAssetId, ...referenceIds]).size !==
    1 + referenceIds.length
  )
    throw new RenderError(400, "Duplicate references");
  const tool = findTool(text(input.toolId, 100));
  const engine = renderEngines.find(
    (level) => level.id === input.engine || level.providerId === input.engine,
  );
  if (!tool || !engine) throw new RenderError(400, "Invalid tool or engine");
  const prompt = text(input.prompt, 4000),
    avoid = text(input.avoid ?? "", 1000);
  if (
    !input.values ||
    typeof input.values !== "object" ||
    Array.isArray(input.values)
  )
    throw new RenderError(400, "Invalid design settings");
  const values = input.values as BriefValues;
  if (
    Object.keys(values).some(
      (id) => !tool.controls.some((field) => field.id === id),
    )
  )
    throw new RenderError(400, "Unknown design setting");
  const options = visibleControls(tool, values);
  const details = [];
  for (const field of options) {
    const v = values[field.id] ?? field.defaultValue;
    if (
      v === undefined ||
      v === "" ||
      field.kind === "unknown" ||
      field.kind === "action"
    )
      continue;
    if (field.kind === "toggle" && typeof v !== "boolean")
      throw new RenderError(400, "Invalid switch");
    if (field.kind === "select" && !field.options?.includes(String(v)))
      throw new RenderError(400, "Invalid selection");
    if (field.kind === "integer" || field.kind === "range") {
      if (
        (typeof v !== "string" && typeof v !== "number") ||
        !Number.isFinite(Number(v)) ||
        (field.kind === "integer" && !Number.isInteger(Number(v))) ||
        Number(v) < (field.min ?? -10000) ||
        Number(v) > (field.max ?? 10000)
      )
        throw new RenderError(400, "Invalid numeric setting");
    }
    if (!["seed", "ratio", "guides", "preview"].includes(field.id))
      details.push(field.label + ": " + String(v));
  }
  const description = [
    tool.name + ". " + prompt,
    ...details,
    avoid ? "Avoid: " + avoid : "",
  ]
    .filter(Boolean)
    .join("\n");
  const mode = renderMode(tool.id);
  let endpoint: "renders" | "edits" | "enhancements" | "videos" = "renders";
  let fields: Record<string, unknown>;
  if (workflow === "video") {
    if (!mode || referenceIds.length)
      throw new RenderError(400, "Video requires one source photo");
    endpoint = "videos";
    fields = {
      model: "v2.0-flash",
      duration_seconds: 10,
      camera_movement: "dolly-in",
      motion: "subtle",
    };
  } else if (workflow === "upscale") {
    if (tool.id !== "resolution-enhancement")
      throw new RenderError(400, "Choose the enhancement tool for upscaling");
    endpoint = "enhancements";
    fields = { kind: "upscale" };
  } else if (mode) {
    if (workflow === "style" && !referenceIds.length)
      throw new RenderError(400, "Choose a style reference");
    if (workflow === "concept" && (!prompt || referenceIds.length))
      throw new RenderError(400, "Write a concept without image references");
    const actualMode =
      workflow === "concept"
        ? "text-to-render"
        : workflow === "plan" || workflow === "masterplan"
          ? workflow
          : mode;
    fields = {
      mode: actualMode,
      engine: engine.providerId,
      prompt: description,
      aspect_ratio:
        values.ratio && values.ratio !== "Original" ? values.ratio : "auto",
      count: 1,
    };
  } else if (workflow !== "design")
    throw new RenderError(400, "Workflow unavailable for this tool");
  else if (tool.id === "resolution-enhancement") {
    if (values.mode === "Manual controls" || prompt || avoid)
      throw new RenderError(
        400,
        "Automatic enhancement uses the source image only",
      );
    endpoint = "enhancements";
    fields = { kind: "enhance" };
  } else {
    if (tool.id === "visual-cleanup" && values.mode === "Brush & delete")
      throw new RenderError(400, "This operation requires a brush mask");
    if (!prompt)
      throw new RenderError(400, "Describe the change and its location");
    endpoint = "edits";
    fields = { prompt: description };
  }
  if (referenceIds.length && (endpoint !== "renders" || !tool.reference))
    throw new RenderError(400, "References are unavailable for this tool");
  const spec = {
    projectId,
    sourceAssetId,
    referenceIds,
    toolId: tool.id,
    endpoint,
    fields,
  };
  return {
    ...spec,
    id,
    hash: createHash("sha256").update(JSON.stringify(spec)).digest("hex"),
  };
}
export type RenderBrief = ReturnType<typeof parseRender>;
interface ApiJob {
  id: string;
  status: string;
  outputs?: { url: string; media: string }[];
  charged_usd?: number;
  refunded_usd?: number;
}
export async function mnmlRequest(
  key: string,
  path: string,
  init: RequestInit,
  http: typeof fetch = fetch,
): Promise<ApiJob> {
  const response = await http(root + path, {
    ...init,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(20000),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + key,
      ...init.headers,
    },
  });
  if (!response.ok) {
    throw new RenderError(
      response.status === 401 ? 503 : [402, 403, 429].includes(response.status) ? response.status : 502,
      response.status === 401
        ? "The rendering provider rejected its credentials"
        : "The rendering provider could not complete this request",
      [400, 401, 402, 403, 404, 422, 429].includes(response.status),
    );
  }
  const envelope = await response.json();
  if (
    envelope.success !== true ||
    typeof envelope.data?.id !== "string" ||
    !providerId.test(envelope.data.id)
  )
    throw new RenderError(502, "Invalid provider response");
  return envelope.data;
}
export function submitRender(
  key: string,
  brief: RenderBrief,
  image: string | undefined,
  references: string[],
  http: typeof fetch = fetch,
) {
  return mnmlRequest(
    key,
    "/" + brief.endpoint,
    {
      method: "POST",
      headers: { "Idempotency-Key": brief.id },
      body: JSON.stringify({
        ...brief.fields,
        ...(image ? { image } : {}),
        ...(references.length
          ? {
              references: references.map((image) => ({ image, mode: "style" })),
            }
          : {}),
      }),
    },
    http,
  );
}
export async function checkRender(
  key: string,
  id: string,
  http: typeof fetch = fetch,
) {
  if (!providerId.test(id)) throw new RenderError(502, "Invalid provider job");
  const job = await mnmlRequest(key, "/jobs/" + id, { method: "GET" }, http);
  if (
    job.id !== id ||
    !["queued", "processing", "succeeded", "failed", "canceled"].includes(
      job.status,
    )
  )
    throw new RenderError(502, "Invalid provider status");
  return job;
}
export function signedOutput(job: ApiJob, media: "image" | "video" = "image") {
  const output = job.outputs?.find((entry) => entry.media === media);
  if (!output) throw new RenderError(502, "Missing output image");
  const url = new URL(output.url);
  if (
    url.origin !== "https://api.mnml.ai" ||
    url.username ||
    url.password ||
    url.pathname !== "/v2/files/" + job.id ||
    !url.searchParams.get("exp") ||
    !url.searchParams.get("sig")
  )
    throw new RenderError(502, "Invalid provider file");
  return url;
}
