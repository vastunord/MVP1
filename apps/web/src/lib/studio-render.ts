export const renderEngines = [
  { id: "low", label: "Low", providerId: "v4.3-fast", verified: false },
  { id: "medium", label: "Medium", providerId: "v4.4-ultra", verified: false },
  { id: "high", label: "High", providerId: "v4.5-ultra", verified: false },
  { id: "ultra", label: "Ultra", providerId: "v4.6-ultra", verified: false },
  // A single synthetic interior image was generated using this provider model.
  // This is not evidence that every tool or workflow has been verified live.
  { id: "fast", label: "Fast", providerId: "v4.5-fast", verified: true },
] as const;
export type RenderEngine = (typeof renderEngines)[number]["id"];
export type BriefValues = Record<string, string | number | boolean>;
// Presentation aliases do not replace stored tool IDs or provider models.
export function mayaExperience(toolId: string) {
  if (toolId === "resolution-enhancement") return "enhance";
  return renderMode(toolId) ? "create" : "refine";
}
export const mayaExperiences = [
  { id: "create", en: "Maya 7.0 · Create", nb: "Maya 7.0 · Skap" },
  { id: "refine", en: "Maya 7.1 · Refine", nb: "Maya 7.1 · Tilpass" },
  { id: "enhance", en: "Maya 7.2 · Enhance", nb: "Maya 7.2 · Forbedre" },
  { id: "motion", en: "Maya 7.3 · Motion", nb: "Maya 7.3 · Bevegelse" },
] as const;
// These modes need capabilities that are not implemented in the shared editor.
export function unsupportedStudioOption(toolId: string, controlId: string, value: string) {
  return controlId === "mode" && (
    (toolId === "visual-cleanup" && value === "Brush & delete") ||
    (toolId === "resolution-enhancement" && value === "Manual controls")
  );
}
export const sceneWorkflows = [
  { id: "design", en: "Design from photo", nb: "Design fra bilde" },
  { id: "sketch", en: "Sketch to scene", nb: "Fra skisse til motiv" },
  { id: "plan", en: "Floor plan", nb: "Plantegning" },
  { id: "masterplan", en: "Masterplan", nb: "Situasjonsplan" },
  { id: "style", en: "Style from references", nb: "Stil fra referanser" },
  { id: "concept", en: "Concept from words", nb: "Konsept fra tekst" },
  { id: "video", en: "Video walkthrough", nb: "Videovandring" },
] as const;
export type StudioWorkflow = (typeof sceneWorkflows)[number]["id"] | "upscale";
// Keep speculative cross-tool modes unavailable until their individual UI and
// provider behavior have been verified. The server enforces the same policy.
export function supportedWorkflows(toolId: string, hasReference: boolean): StudioWorkflow[] {
  if (toolId === "resolution-enhancement") return ["design", "upscale"];
  return hasReference && renderMode(toolId) ? ["design", "style"] : ["design"];
}
export type StudioResult = {
  source: string | null;
  output: string;
  media: "image" | "video";
};

export function renderMode(tool: string) {
  switch (tool) {
    case "room-reimagination":
    case "virtual-home-staging":
    case "furniture-refresh":
    case "seasonal-styling":
    case "material-refinement":
    case "lighting-reimagination":
    case "decor-redefinition":
      return "interior";
    case "outdoor-visualization":
    case "sky-transformation":
    case "seasonal-transformation":
      return "exterior";
    case "garden-design":
    case "hardscape-design":
    case "pool-redesign":
      return "landscape";
    default:
      return null;
  }
}

export interface RenderSelection {
  projectId: string;
  sourceAssetId: string;
  referenceIds: string[];
}

export interface RenderStatus {
  id: string;
  toolId: string;
  state: "QUEUED" | "RUNNING" | "FAILED" | "CANCELLED" | "SUCCEEDED";
  sourceAssetId: string | null;
  outputAssetId: string | null;
  waitingForSubmission: boolean;
  media: "image" | "video";
}
