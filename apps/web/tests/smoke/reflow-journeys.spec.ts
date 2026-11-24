import { expect, test } from "@playwright/test";

// 640 CSS pixels approximates the layout viewport of a 1280px screen at 200%
// zoom. It does not claim to test browser zoom or a physical touch device.
for (const width of [390, 640, 768, 1280, 1440, 1920]) {
  for (const route of ["/en", "/en/login", "/app/tools/room-reimagination", "/app/renders"]) {
    test(`local ${route} reflows at ${width}px with keyboard access`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addInitScript(() => {
        localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      });
      await page.goto(route);
      await expect(page.locator("body")).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      for (let index = 0; index < 4; index++) {
        await page.keyboard.press("Tab");
        const focus = page.locator(":focus-visible");
        await expect(focus).toBeVisible();
        const box = await focus.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x + box!.width).toBeGreaterThan(0);
        expect(box!.x).toBeLessThan(width);
      }
    });
  }
}
