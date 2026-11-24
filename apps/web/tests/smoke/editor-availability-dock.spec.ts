import { expect, test } from "@playwright/test";

for (const height of [600, 750, 900]) {
  test(`mobile editor availability remains clear of persistent controls at ${height}px height`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto("/app/tools/room-reimagination");
    const status = page.locator(".editor-availability");
    await expect(status).toBeVisible();
    await expect(status).toContainText(/Bildegenerering er ikke aktivert|Image generation is not enabled/);
    const statusBox = await status.boundingBox();
    expect(statusBox).not.toBeNull();
    expect(statusBox!.y).toBeGreaterThanOrEqual(0);
    expect(statusBox!.y + statusBox!.height).toBeLessThanOrEqual(height);
    for (const selector of [".vn-cookie-dock", ".vn-prana-dock"]) {
      const button = page.locator(selector);
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      const overlaps = statusBox!.x < box!.x + box!.width && statusBox!.x + statusBox!.width > box!.x && statusBox!.y < box!.y + box!.height && statusBox!.y + statusBox!.height > box!.y;
      expect(overlaps, `${selector} obscures the availability status`).toBe(false);
    }
  });
}
