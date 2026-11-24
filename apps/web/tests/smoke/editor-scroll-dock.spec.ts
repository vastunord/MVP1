import { expect, test } from "@playwright/test";

for (const height of [600, 750, 900]) {
  test(`keyboard focus remains unobscured through Studio controls at ${height}px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto("/app/tools/room-reimagination");
    const region = page.locator(".inspector-scroll");
    await region.focus();
    for (let index = 0; index < 55; index++) {
      await page.keyboard.press("Tab");
      const focus = page.locator(":focus");
      if (!await focus.count()) continue;
      const result = await focus.evaluate((node) => {
        const target = node instanceof HTMLInputElement && node.type === "radio" ? node.closest("label") ?? node : node;
        const rect = target.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return { visible: false, label: node.outerHTML.slice(0, 150) };
        const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2));
        const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2));
        const hit = document.elementFromPoint(x, y);
        const blocked = !target.classList.contains("inspector-scroll") && [...document.querySelectorAll(".vn-cookie-dock, .vn-prana-dock")].some((dock) => {
          if (dock === target || dock.contains(target)) return false;
          const obstacle = dock.getBoundingClientRect();
          return rect.left < obstacle.right && rect.right > obstacle.left && rect.top < obstacle.bottom && rect.bottom > obstacle.top;
        });
        return { visible: rect.bottom > 0 && rect.top < innerHeight && !blocked && Boolean(hit && (target === hit || target.contains(hit))), label: `${target.outerHTML.slice(0, 150)} top=${rect.top} bottom=${rect.bottom} hit=${hit?.outerHTML.slice(0, 100)} blocked=${blocked}` };
      });
      expect(result.visible, result.label).toBe(true);
    }
  });
}

test("an unobscured Studio action does not trigger corrective scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/app/tools/room-reimagination");
  const action = page.locator(".editor-topbar > a");
  await expect(action).toBeInViewport();
  const before = await page.evaluate(() => window.scrollY);
  await action.evaluate((node) => (node as HTMLElement).focus({ preventScroll: true }));
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});
