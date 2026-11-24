import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"]) {
  for (const route of ["/en", "/en/login", "/app/tools/room-reimagination", "/app/renders"]) {
    test(`${route} shows a focus indicator in ${theme} mode`, async ({ page, context }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await context.addCookies([{ name: "vn-theme", value: theme, url: "http://127.0.0.1:3111" }]);
      await page.addInitScript(() => {
        localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
        localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
      });
      await page.goto(route);
      await page.keyboard.press("Tab"); // Establish keyboard modality.
      const target = route.includes("room-reimagination")
        ? page.locator("#prompt")
        : page.locator("main a:visible, main button:visible:not(:disabled), main input:visible:not(:disabled), main textarea:visible:not(:disabled)").first();
      await target.focus();
      await expect(target).toBeFocused();
      expect(await target.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
      const indicator = await target.evaluate((element) => {
        const style = getComputedStyle(element);
        return { outline: style.outlineStyle, width: Number.parseFloat(style.outlineWidth), shadow: style.boxShadow };
      });
      expect((indicator.outline !== "none" && indicator.width > 0) || indicator.shadow !== "none").toBe(true);
    });
  }
}
