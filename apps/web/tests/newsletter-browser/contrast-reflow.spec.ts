import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  test(`representative opaque brand controls have readable text in ${theme} mode`, async ({ page, context }) => {
    await context.addCookies([{ name: "vn-theme", value: theme, url: "http://127.0.0.1:3111" }]);
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    for (const locator of [page.locator("a.mk-action:not(.secondary)").first(), page.locator(".vn-prana-dock")]) {
      await expect(locator).toBeVisible();
      const values = await locator.evaluate((element) => {
        const style = getComputedStyle(element);
        return { color: style.color, background: style.backgroundColor, size: Number.parseFloat(style.fontSize), weight: Number.parseInt(style.fontWeight, 10) };
      });
      function rgb(value: string) {
        const match = value.match(/^rgb\(\s*([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)\s*\)$/);
        if (!match) throw new Error(`Expected opaque rgb, received ${value}`);
        return match.slice(1).map(Number);
      }
      function luminance(color: number[]) {
        const linear = color.map((v) => v / 255 <= 0.04045 ? v / 255 / 12.92 : ((v / 255 + 0.055) / 1.055) ** 2.4);
        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      }
      const a = luminance(rgb(values.color)), b = luminance(rgb(values.background));
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      const largeText = values.size >= 24 || (values.size >= 56 / 3 && values.weight >= 700);
      expect(ratio, `${values.color} against ${values.background} (${values.size}px / ${values.weight})`).toBeGreaterThanOrEqual(largeText ? 3 : 4.5);
    }
  });
}

for (const route of ["/en", "/en/login", "/app/tools/room-reimagination", "/app/renders"]) {
  for (const width of [390, 768, 1280, 1440]) {
    test(`${route} has no page-level horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      const geometry = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(geometry.scroll).toBeLessThanOrEqual(geometry.client);
    });
  }
}
