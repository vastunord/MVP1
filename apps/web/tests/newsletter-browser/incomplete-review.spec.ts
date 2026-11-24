import { expect, test } from "@playwright/test";

function contrast(foreground: string, background: string) {
  function rgb(value: string) {
    const match = value.match(/^rgb\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)\s*\)$/);
    if (!match) throw new Error(`Expected opaque RGB: ${value}`);
    return match.slice(1).map(Number);
  }
  function luminance(color: number[]) {
    const linear = color.map((v) => v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  }
  const a = luminance(rgb(foreground)), b = luminance(rgb(background));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test.beforeEach(async ({ page }) => {
  await page.route("https://**/*", (route) => route.abort());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
  });
});

test("icon-only favourite and close controls expose text names and hide the glyph", async ({ page }) => {
  await page.goto("/app/renders");
  const favorites = page.locator(".vn-favourite");
  expect(await favorites.count()).toBeGreaterThan(0);
  for (const button of await favorites.all()) {
    await expect(button).toHaveAccessibleName(/^(Favoritt|Favourite) .+/);
    await expect(button.locator('span[aria-hidden="true"]')).toHaveCount(1);
  }
  await page.goto("/en");
  for (const item of [
    { launcher: "Newsletter", panel: "Vastu Nord newsletter" },
    { launcher: "Open Prana assistant", panel: "VastuNord Prana" },
    { launcher: "Change cookie preferences", panel: "Cookie settings" },
  ]) {
    await page.getByRole("button", { name: item.launcher, exact: true }).click();
    const close = page.getByRole("dialog", { name: item.panel }).getByRole("button", { name: "Close", exact: true }).first();
    await expect(close).toHaveAccessibleName("Close");
    await expect(close.locator('span[aria-hidden="true"]')).toHaveText("×");
    await page.keyboard.press("Escape");
  }
});

for (const theme of ["light", "dark"]) test(`enabled Studio choice labels use contrasting opaque backgrounds in ${theme}`, async ({ page, context }) => {
  await context.addCookies([{ name: "vn-theme", value: theme, url: "http://127.0.0.1:3111" }]);
  await page.goto("/app/tools/room-reimagination");
  const labels = page.locator(".studio-choice:not(:has(:disabled)) .choice-label");
  expect(await labels.count()).toBeGreaterThan(10);
  for (const label of await labels.all()) {
    const values = await label.evaluate((node) => ({
      foreground: getComputedStyle(node).color,
      background: getComputedStyle(node.parentElement!).backgroundColor,
    }));
    expect(contrast(values.foreground, values.background), `${values.foreground} / ${values.background}`).toBeGreaterThanOrEqual(4.5);
  }
});

test("gallery favourite icons contrast in both toggle states", async ({ page }) => {
  await page.goto("/app/renders");
  const favorite = page.locator(".vn-favourite").first();
  for (const state of ["false", "true"]) {
    await expect(favorite).toHaveAttribute("aria-pressed", state);
    const values = await favorite.evaluate((node) => ({ foreground: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor }));
    expect(contrast(values.foreground, values.background)).toBeGreaterThanOrEqual(3);
    if (state === "false") await favorite.click();
  }
});

test("cookie save and newsletter submit controls meet text contrast on opaque fills", async ({ page }) => {
  await page.goto("/en");
  for (const item of [
    { launcher: "Newsletter", panel: "Vastu Nord newsletter", action: "Sign up" },
    { launcher: "Change cookie preferences", panel: "Cookie settings", action: "Save choices" },
  ]) {
    await page.getByRole("button", { name: item.launcher, exact: true }).click();
    const dialog = page.getByRole("dialog", { name: item.panel });
    const action = dialog.getByRole("button", { name: item.action, exact: true });
    const values = await action.evaluate((node) => ({ foreground: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor }));
    expect(contrast(values.foreground, values.background), `${item.action}: ${values.foreground} / ${values.background}`).toBeGreaterThanOrEqual(4.5);
    await page.keyboard.press("Escape");
  }
});
