import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";

// Resolve the already installed, lockfile-pinned axe-core through the existing
// eslint-config-next -> eslint-plugin-jsx-a11y dependency; no network or new package.
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("eslint-config-next"));
const pluginRequire = createRequire(nextRequire.resolve("eslint-plugin-jsx-a11y"));
const axeScript = pluginRequire.resolve("axe-core/axe.min.js");

for (const route of ["/", "/en", "/en/login", "/app/tools/room-reimagination", "/app/renders"]) {
  test(`sampled accessibility names and ARIA references on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto(route);
    await page.addScriptTag({ path: axeScript });
    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (context: Document, options: unknown) => Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }> } }).axe;
      const result = await axe.run(document, { runOnly: { type: "rule", values: ["label", "button-name", "link-name", "image-alt", "duplicate-id-aria", "aria-valid-attr-value"] } });
      return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
    });
    expect(violations).toEqual([]);
  });
}

test("sampled accessible names and ARIA references while each overlay is open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
  });
  await page.goto("/en");
  await page.addScriptTag({ path: axeScript });
  for (const item of [
    { launcher: "Newsletter", panel: "Vastu Nord newsletter" },
    { launcher: "Open Prana assistant", panel: "VastuNord Prana" },
    { launcher: "Change cookie preferences", panel: "Cookie settings" },
  ]) {
    await page.getByRole("button", { name: item.launcher, exact: true }).click();
    await expect(page.getByRole("dialog", { name: item.panel })).toBeVisible();
    const violations = await page.evaluate(async () => {
      const axe = (window as unknown as { axe: { run: (context: Document, options: unknown) => Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }> } }).axe;
      const result = await axe.run(document, { runOnly: { type: "rule", values: ["label", "button-name", "link-name", "image-alt", "duplicate-id-aria", "aria-valid-attr-value"] } });
      return result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }));
    });
    expect(violations).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: item.panel })).toHaveCount(0);
  }
});
