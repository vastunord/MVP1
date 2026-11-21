import { test } from "node:test";
import assert from "node:assert/strict";
import {
  tools,
  categories,
  findTool,
  visibleControls,
  primaryAction,
} from "../../../packages/contracts/src/tools.ts";
import {
  dictionaries,
  publicHref,
  switchLocalePath,
  formatDate,
  formatNumber,
} from "../src/lib/i18n.ts";
import { integrationState } from "../../../packages/contracts/src/integrations.ts";
import { readFileSync } from "node:fs";
test("tool names and routes match the committed reference matrix", () => {
  const matrix = readFileSync(
    new URL(
      "../../../docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md",
      import.meta.url,
    ),
    "utf8",
  );
  const rows = matrix.split("\n").filter((line) => /^\| \d+ /.test(line));
  assert.equal(rows.length, 17);
  for (const [i, row] of rows.entries()) {
    assert.ok(row.includes(tools[i].name));
    assert.ok(row.includes(tools[i].route));
  }
});
test("semantic palette combinations meet normal-text contrast", () => {
  const colors = {
    ink: [0.051, 0.055, 0.055],
    paper: [0.969, 0.949, 0.925],
    navy: [0.004, 0.235, 0.333],
    sage: [0.737, 0.8, 0.788],
    orange: [0.984, 0.376, 0.169],
  };
  const lum = (rgb: number[]) =>
    rgb
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  for (const [a, b] of [
    [colors.ink, colors.paper],
    [colors.navy, colors.paper],
    [colors.paper, colors.navy],
    [colors.sage, colors.ink],
    [colors.ink, colors.orange],
  ]) {
    const x = lum(a),
      y = lum(b);
    assert.ok((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) >= 4.5);
  }
});
test("all 17 unique tool routes/configs are valid", () => {
  assert.equal(tools.length, 17);
  assert.equal(new Set(tools.map((t) => t.id)).size, 17);
  for (const t of tools) {
    assert.equal(findTool(t.id), t);
    assert.equal(t.route, "/app/tools/" + t.id);
    assert.ok(categories.includes(t.category));
    assert.equal(new Set(t.controls.map((c) => c.id)).size, t.controls.length);
    for (const c of t.controls) {
      if (c.kind === "select" && c.defaultValue !== undefined)
        assert.ok(c.options?.includes(String(c.defaultValue)));
      if (c.when) assert.ok(t.controls.some((x) => x.id === c.when?.id));
    }
  }
  assert.equal(findTool("invented"), undefined);
});
test("conditional controls and actions follow mode", () => {
  const season = findTool("seasonal-transformation")!;
  assert.ok(
    !visibleControls(season, { season: "Spring" }).some((c) => c.id === "snow"),
  );
  assert.ok(
    visibleControls(season, { season: "Winter" }).some((c) => c.id === "snow"),
  );
  assert.equal(
    primaryAction(season, { season: "Winter" }),
    "Show it in winter",
  );
  assert.equal(
    primaryAction(findTool("resolution-enhancement")!, {
      mode: "Manual controls",
    }),
    "Apply adjustments",
  );
});
test("locale parity, paths and Intl formatting", () => {
  assert.deepEqual(
    Object.keys(dictionaries.en).sort(),
    Object.keys(dictionaries["nb-NO"]).sort(),
  );
  assert.equal(publicHref("/", "nb-NO"), "/");
  assert.equal(publicHref("/features", "en"), "/en/features");
  assert.equal(switchLocalePath("/en/features", "nb-NO"), "/features");
  assert.equal(switchLocalePath("/app/library", "en"), "/app/library");
  assert.notEqual(formatNumber(1234.5, "en"), formatNumber(1234.5, "nb-NO"));
  assert.match(formatDate(new Date("2026-01-01"), "en"), /2026/);
});
test("every integration is unavailable, never a fake balance or service", () => {
  assert.ok(Object.values(integrationState).every((s) => s === "unavailable"));
});
