import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const plugin = createRequire(createRequire(require.resolve("eslint-config-next")).resolve("eslint-plugin-jsx-a11y"));
const axeScript = plugin.resolve("axe-core/axe.min.js");

for (const theme of ["light", "dark"]) {
  for (const route of ["/", "/en", "/en/login", "/app/tools/room-reimagination", "/app/renders"]) {
    test(`axe WCAG-tagged sample on ${route} in ${theme}`, async ({ page, context }) => {
      const home = route === "/" || route === "/en";
      await page.setViewportSize(home ? { width: 375, height: 568 } : { width: 390, height: 844 });
      await context.addCookies([{ name: "vn-theme", value: theme, url: "http://127.0.0.1:3111" }]);
      await page.addInitScript(() => {
        localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
        localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
      });
      await page.route("https://**/*", (route) => route.abort());
      await page.goto(route);
      if (home) {
        await expect(page.locator("html")).toHaveAttribute("lang", route === "/" ? "nb-NO" : "en");
        const cta = page.locator(".photo-hero-actions .mk-action").first();
        await expect(cta).toHaveCSS("font-size", "24px");
        const usesLocalFont = await cta.evaluate(async (element) => {
          const faces = await document.fonts.load('600 24px "Inter Variable"');
          return faces.length > 0 && getComputedStyle(element).fontFamily.includes("Inter Variable");
        });
        expect(usesLocalFont).toBe(true);
      }
      await page.addScriptTag({ path: axeScript });
      const result = await page.evaluate(async () => {
        const axe = (window as unknown as { axe: { run: (context: Document, options: unknown) => Promise<{ violations: { id: string; nodes: { target: string[]; html: string; failureSummary?: string }[] }[]; incomplete: { id: string; nodes: { target: string[] }[] }[] }> } }).axe;
        const result = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
        return { violations: result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => ({ target: node.target, html: node.html, reason: node.failureSummary })) })), incomplete: result.incomplete.map(({ id, nodes }) => ({ id, count: nodes.length, sample: nodes.slice(0, 5).map((node) => node.target) })) };
      });
      console.log(JSON.stringify({ route, theme, incomplete: result.incomplete }));
      expect(result.violations).toEqual([]);
    });
  }
  test(`axe WCAG-tagged sample for open overlays in ${theme}`, async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await context.addCookies([{ name: "vn-theme", value: theme, url: "http://127.0.0.1:3111" }]);
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
    });
    await page.route("https://**/*", (route) => route.abort());
    await page.goto("/en");
    await page.addScriptTag({ path: axeScript });
    for (const item of [
      { launcher: "Newsletter", panel: "Vastu Nord newsletter" },
      { launcher: "Open Prana assistant", panel: "VastuNord Prana" },
      { launcher: "Change cookie preferences", panel: "Cookie settings" },
    ]) {
      await page.getByRole("button", { name: item.launcher, exact: true }).click();
      await expect(page.getByRole("dialog", { name: item.panel })).toBeVisible();
      const result = await page.evaluate(async () => {
        const axe = (window as unknown as { axe: { run: (context: Document, options: unknown) => Promise<{ violations: { id: string; nodes: { target: string[]; html: string; failureSummary?: string }[] }[]; incomplete: { id: string; nodes: { target: string[] }[] }[] }> } }).axe;
        const result = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
        return { violations: result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => ({ target: node.target, html: node.html, reason: node.failureSummary })) })), incomplete: result.incomplete.map(({ id, nodes }) => ({ id, count: nodes.length, sample: nodes.slice(0, 5).map((node) => node.target) })) };
      });
      console.log(JSON.stringify({ overlay: item.panel, theme, incomplete: result.incomplete }));
      expect(result.violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog", { name: item.panel })).toHaveCount(0);
    }
  });
}
