export const renderEngines = [
  { id: "low", label: "Low", providerId: "v4.3-fast" },
  { id: "medium", label: "Medium", providerId: "v4.4-ultra" },
  { id: "high", label: "High", providerId: "v4.5-ultra" },
  { id: "ultra", label: "Ultra", providerId: "v4.6-ultra" },
  { id: "fast", label: "Fast", providerId: "v4.5-fast" },
] as const;
export type RenderEngine = (typeof renderEngines)[number]["id"];
export type BriefValues = Record<string, string | number | boolean>;
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
