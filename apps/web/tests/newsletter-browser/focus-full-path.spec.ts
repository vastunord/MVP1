import { expect, test } from "@playwright/test";

for (const route of ["/en", "/en/login", "/app/renders"]) {
  for (const height of [600, 750, 900]) test(`keyboard focus stays clear of fixed launchers throughout ${route} at ${height}px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
    });
    await page.goto(route);
    if (route === "/en") await expect(page.locator(".vn-newsletter-dock")).toBeVisible();
    const seen = new Set<string>();
    for (let index = 0; index < 100; index++) {
      await page.keyboard.press("Tab");
      const focus = page.locator(":focus");
      if (!await focus.count()) break;
      const state = await focus.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const docks = [...document.querySelectorAll(".vn-cookie-dock, .vn-prana-dock, .vn-newsletter-dock")];
        const blocked = docks.some((dock) => {
          if (dock === node || dock.contains(node)) return false;
          const obstacle = dock.getBoundingClientRect();
          return rect.left < obstacle.right && rect.right > obstacle.left && rect.top < obstacle.bottom && rect.bottom > obstacle.top;
        });
        return { blocked, description: `${node.tagName} ${node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 60)} ${rect.top}-${rect.bottom}` };
      });
      if (seen.has(state.description)) break;
      seen.add(state.description);
      expect(state.blocked, state.description).toBe(false);
    }
    expect(seen.size).toBeGreaterThan(5);
  });
}
