import assert from "node:assert/strict";
import test from "node:test";
import { findTool, primaryAction, visibleControls } from "@vastunord/contracts/tools";
import { parseRender } from "../src/server/mnml.ts";
import { readMayaDraft } from "../src/lib/maya-drafts.ts";

const request = {
  id: "19272b7a-989a-4229-a98d-984065cee206", consent: true, engine: "v4.5-fast",
  projectId: "example-project", sourceAssetId: "example-source", referenceIds: [],
  values: {}, prompt: "Keep the original windows.", avoid: "",
};
test("room options match the designer defaults and existing saved settings reopen", () => {
  const room = findTool("room-reimagination")!;
  const field = (id: string) => visibleControls(room, {}).find(c => c.id === id)!;
  assert.equal(field("style").defaultValue, "Scandinavian");
  assert.deepEqual(field("furnishing").options, ["Keep existing", "Light", "Balanced", "Full"]);
  assert.deepEqual(field("floor").options, ["Keep existing", "Pale oak", "Walnut", "Concrete", "Stone", "Terrazzo"]);
  assert.equal(room.avoidLimit, 400);
  const old = { version: 1, prompt: "x".repeat(1200), avoid: "", engine: "fast", workflow: "design", values: { style: "Auto", floor: "Polished" } };
  assert.deepEqual(readMayaDraft(JSON.stringify(old), room), old);
  assert.doesNotThrow(() => parseRender({ ...request, toolId: room.id, values: old.values }));
  assert.throws(() => parseRender({ ...request, toolId: room.id, avoid: "x".repeat(401) }));
});
test("seven designer editors enforce their observed prompt limit server-side", () => {
  for (const toolId of ["room-reimagination", "virtual-home-staging", "outdoor-visualization", "hardscape-design", "furniture-refresh", "seasonal-styling", "visual-cleanup"]) {
    assert.equal(findTool(toolId)?.briefLimit, 1000);
    assert.doesNotThrow(() => parseRender({ ...request, toolId, prompt: "x".repeat(1000) }));
    assert.throws(() => parseRender({ ...request, toolId, prompt: "x".repeat(1001) }));
  }
});
test("staging, outdoor, furniture, interior season and clutter keep their separate settings", () => {
  const fields = (id: string) => findTool(id)!.controls;
  assert.equal(fields("virtual-home-staging").find(c => c.id === "buyer")?.defaultValue, "Family");
  assert.equal(fields("outdoor-visualization").find(c => c.id === "style")?.defaultValue, "Naturalistic");
  assert(fields("hardscape-design").some(c => c.id === "surfaces"));
  assert(!fields("hardscape-design").some(c => c.id === "area"));
  assert.equal(fields("furniture-refresh").find(c => c.id === "cleanup")?.kind, "toggle");
  const seasonal = findTool("seasonal-styling")!;
  for (const season of ["Spring", "Summer", "Autumn", "Winter"]) {
    assert.equal(primaryAction(seasonal, { season }), "Style for " + season.toLowerCase());
    assert.doesNotThrow(() => parseRender({ ...request, toolId: seasonal.id, values: { season, palette: "Season’s own" } }));
  }
  const cleanup = parseRender({ ...request, toolId: "visual-cleanup", values: { "remove-0": true, "remove-6": true } });
  assert.match(String(cleanup.fields.prompt), /Remove: Bins/);
  assert.match(String(cleanup.fields.prompt), /Remove: Power lines/);
  assert.doesNotMatch(String(cleanup.fields.prompt), /Remove: Cars/);
});
