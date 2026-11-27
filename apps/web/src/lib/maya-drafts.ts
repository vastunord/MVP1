import type { ToolDefinition } from "@vastunord/contracts/tools";
import { renderEngines, supportedWorkflows, unsupportedStudioOption, type BriefValues, type RenderEngine, type StudioWorkflow } from "./studio-render.ts";

export type MayaDraft = { version: 1; values: BriefValues; prompt: string; avoid: string; engine: RenderEngine; workflow: StudioWorkflow };
export function mayaDraftKey(user: string, project: string, tool: string) {
  return `vn-maya-draft:v1:${encodeURIComponent(user)}:${encodeURIComponent(project || "unassigned")}:${encodeURIComponent(tool)}`;
}
export function readMayaDraft(raw: string, tool: ToolDefinition): MayaDraft | null {
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !data.values || typeof data.values !== "object" || Array.isArray(data.values) || typeof data.prompt !== "string" || data.prompt.length > 4000 || typeof data.avoid !== "string" || data.avoid.length > 1000 || !renderEngines.some((e) => e.id === data.engine && e.verified) || !supportedWorkflows(tool.id, tool.reference).includes(data.workflow)) return null;
    const values: BriefValues = {};
    for (const [id, value] of Object.entries(data.values)) {
      const field = tool.controls.find((item) => item.id === id);
      if (!field || !["string", "number", "boolean"].includes(typeof value)) return null;
      if (typeof value === "string" && unsupportedStudioOption(tool.id, id, value)) return null;
      if (field.kind === "select" && (typeof value !== "string" || !field.options?.includes(value))) return null;
      if (field.kind === "toggle" && typeof value !== "boolean") return null;
      if (field.kind === "range" && (typeof value !== "number" || !Number.isFinite(value) || (field.min !== undefined && value < field.min) || (field.max !== undefined && value > field.max))) return null;
      if (field.kind === "integer" && (typeof value !== "number" || !Number.isInteger(value) || (field.min !== undefined && value < field.min) || (field.max !== undefined && value > field.max))) return null;
      if (!["select", "toggle", "range", "integer"].includes(field.kind)) return null;
      values[id] = value as string | number | boolean;
    }
    return { version: 1, values, prompt: data.prompt, avoid: data.avoid, engine: data.engine, workflow: data.workflow };
  } catch { return null; }
}
export function clearMayaDrafts(storage: Storage) {
  for (let i = storage.length - 1; i >= 0; i--) {
    const key = storage.key(i);
    if (key?.startsWith("vn-maya-draft:v1:")) storage.removeItem(key);
  }
}
