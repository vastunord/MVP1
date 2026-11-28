// Safe public checks for the explicitly gated demonstration.
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import { tools } from "@vastunord/contracts/tools";

const origin = "https://vastunord-web.vercel.app";
const report = {origin, checkedAt: new Date().toISOString(), pages: {}, editors: [], closed: {}};
for (const route of ["/", "/en", "/app", "/app/library"]) {
  const response = await fetch(origin + route);
  report.pages[route] = response.status;
  assert.equal(response.status, 200, route);
  await response.body?.cancel();
}
for (const route of ["/api/health", "/api/projects", "/api/auth/get-session", "/api/studio/renders"]) {
  const response = await fetch(origin + route);
  report.closed[route] = response.status;
  assert.equal(response.status, 503, route);
  await response.body?.cancel();
}
const browser = await chromium.launch({ channel: "msedge" });
try {
  const context = await browser.newContext({viewport:{width:1363,height:936}, reducedMotion:"reduce"});
  await context.addCookies([{name:"vn-locale",value:"en",url:origin},{name:"vn-theme",value:"dark",url:origin}]);
  const page = await context.newPage();
  for (const tool of tools) {
    const response = await page.goto(origin+tool.route);
    assert.equal(response?.status(),200,tool.id);
    await expect(page.locator(".studio-canvas h1")).toHaveText(tool.name);
    await expect(page.locator(".editor-reset")).toBeAttached();
    report.editors.push(tool.id);
  }
  await page.goto(origin+"/app/tools/perspective-correction");
  await page.locator("#option-guides").check();
  await expect(page.locator(".sample-guides")).toBeVisible();
  await page.locator("#option-guides").uncheck();
  await expect(page.locator(".sample-guides")).toHaveCount(0);
  report.guides = "checked and cleared";
  await writeFile(new URL("../../../docs/evidence/designer-parity/public-origin.json",import.meta.url),JSON.stringify(report,null,2)+"\n");
  console.log("Live public checks passed:",report.editors.length,"editors, 4 public routes, 4 closed services, guide toggle.");
} finally {await browser.close();}
