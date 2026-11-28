import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { tools } from "../../../packages/contracts/src/tools.ts";

// Uses only the local built application and its public illustrative studies.
const origin = "http://127.0.0.1:31917";
const directory = fileURLToPath(new URL("../../../docs/evidence/designer-parity/candidate/", import.meta.url));
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const rows = [];
async function inspect(locale, theme) {
  const context = await browser.newContext({ reducedMotion: "reduce", deviceScaleFactor: 1 });
  try {
    await context.addCookies([{ name: "vn-locale", value: locale, url: origin }, { name: "vn-theme", value: theme, url: origin }]);
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    for (const tool of tools) {
      errors.length = 0;
      await page.setViewportSize({ width: 1363, height: 936 });
      assert.equal((await page.goto(origin + "/app/tools/" + tool.id)).status(), 200, tool.id);
      try {
        await page.locator(".editor-reset").waitFor({state:"attached"});
      } catch {
        throw new Error([tool.id, locale, theme, page.url(), await page.title(), ...errors].join(" | "));
      }
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      if (locale === "en" && theme === "dark") {
        await page.screenshot({ path: directory + tool.id + ".png", animations: "disabled" });
      }
      for (const width of [390, 768, 1280, 1440]) {
        await page.setViewportSize({width, height: 936});
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const observed = await page.evaluate(() => ({
          locale: document.documentElement.lang, theme: document.documentElement.dataset.theme,
          overflow: document.documentElement.scrollWidth - innerWidth,
          inspector: !!document.querySelector(".inspector")?.getClientRects().length,
          canvas: !!document.querySelector(".studio-canvas")?.getClientRects().length,
          available: [...document.querySelectorAll(".inspector button,.inspector input,.inspector select,.inspector summary,.inspector textarea")].filter(el => el.getClientRects().length).length,
        }));
        const pass = observed.locale === locale && observed.theme === theme && observed.overflow <= 0 && observed.inspector && observed.canvas && observed.available > 0 && !errors.length;
        rows.push({tool:tool.id,width,locale,theme,...observed,pageErrors:errors.slice(),pass});
      }
    }
  } finally { await context.close(); }
}
try {
  const failures = [];
  for (const locale of ["en", "nb-NO"]) for (const theme of ["dark", "light"]) {
    try { await inspect(locale, theme); }
    catch (reason) { failures.push({reason}); }
  }
  const bad = rows.filter(r=>!r.pass);
  await writeFile(directory + "layout.json", JSON.stringify(rows.sort((a,b)=>a.tool.localeCompare(b.tool)||a.locale.localeCompare(b.locale)||a.theme.localeCompare(b.theme)||a.width-b.width),null,2)+"\n");
  console.log("Layout observations:",rows.length,"failed:",bad.length,"incomplete contexts:",failures.length);
  failures.forEach(result=>console.error(result.reason));
  bad.slice(0,12).forEach(row=>console.error(row));
  assert.equal(rows.length,272);
  assert.equal(bad.length+failures.length,0);
} finally { await browser.close(); }
