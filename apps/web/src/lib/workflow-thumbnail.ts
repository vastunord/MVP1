/** These three approved single-scene tool photos already show the operation clearly. */
const singleScene = new Set(["hardscape-design", "pool-redesign", "garden-design"]);

export function workflowThumbnail(toolId: string) {
  const directory = singleScene.has(toolId) ? "tools" : "workflow-studies";
  return `/media/${directory}/${toolId}.webp`;
}
