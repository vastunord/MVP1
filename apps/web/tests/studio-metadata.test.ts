import { strict as assert } from "node:assert";
import { test } from "node:test";
import { findTool, tools } from "../../../packages/contracts/src/tools.ts";
import { studioPageTitle } from "../src/lib/studio-metadata.ts";

const destinations = [
  {href:"/app", title:["Oversikt", "Overview"] as const},
  {href:"/app/library", title:["Studio-bibliotek", "Studio library"] as const},
  {href:"/app/projects", title:["Prosjekter", "Projects"] as const},
  {href:"/app/renders", title:["Bildegalleri", "Render gallery"] as const},
];

test("all Studio tool titles identify the route without private data", () => {
  assert.equal(tools.length, 17);
  for (const tool of tools) for (const locale of ["nb-NO", "en"] as const) {
    assert.equal(studioPageTitle(["tools", tool.id], locale, destinations, findTool), `${tool.name} · Studio`);
  }
  assert.equal(studioPageTitle(["projects", "sensitive-id"], "en", destinations, findTool), "Project · Studio");
  assert.equal(studioPageTitle(["projects", "sensitive-id"], "nb-NO", destinations, findTool), "Prosjekt · Studio");
  assert.equal(studioPageTitle(["gallery"], "en", destinations, findTool), "Render gallery · Studio");
  assert.equal(studioPageTitle(["library"], "nb-NO", destinations, findTool), "Studio-bibliotek · Studio");
  assert.equal(studioPageTitle(["settings", "security"], "en", destinations, findTool), "Security · Studio");
  assert.equal(studioPageTitle(["unknown", "sensitive-id"], "en", destinations, findTool), "Studio");
});
