import { expect, test } from "@playwright/test";

test("initial mobile Studio Design link remains pointer-accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/app/tools/room-reimagination");
  const link = page.locator(".room-section-links a[href='#room-settings']");
  const result = await link.evaluate(node => {
    const a = node.getBoundingClientRect();
    const dock = document.querySelector(".vn-cookie-dock")!.getBoundingClientRect();
    const x = a.left + a.width / 2, y = a.top + a.height / 2;
    const hit = document.elementFromPoint(x, y);
    return { a: [a.left,a.top,a.right,a.bottom], dock: [dock.left,dock.top,dock.right,dock.bottom], centerHit: Boolean(hit && (hit === node || node.contains(hit))) };
  });
  console.log(JSON.stringify(result));
  expect(result.centerHit).toBe(true);
  await link.click();
  await expect(page).toHaveURL(/#room-settings$/);
});

test("pointer cancellation restores keyboard-style focus correction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/app/tools/room-reimagination");
  const link = page.locator(".room-section-links a[href='#room-settings']");
  const before = await link.boundingBox();
  expect(before).not.toBeNull();
  await page.locator("body").dispatchEvent("pointerdown", { pointerType: "touch" });
  await page.locator("body").dispatchEvent("pointercancel", { pointerType: "touch" });
  await link.evaluate(node => (node as HTMLElement).focus({ preventScroll: true }));
  await expect.poll(async () => (await link.boundingBox())!.y).toBeLessThan(before!.y - 20);
});

test("keyboard input immediately after touch restores focus correction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/app/tools/room-reimagination");
  const link = page.locator(".room-section-links a[href='#room-settings']");
  const before = await link.boundingBox();
  expect(before).not.toBeNull();
  await page.evaluate(() => {
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" }));
    document.body.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "touch" }));
    document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
    (document.querySelector(".room-section-links a[href='#room-settings']") as HTMLElement).focus({ preventScroll: true });
  });
  await expect.poll(async () => (await link.boundingBox())!.y).toBeLessThan(before!.y - 20);
});

test.describe("touch-enabled browser", () => {
  test.use({ hasTouch: true });
  test("the visible part of the mobile Design link responds to a tap", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto("/app/tools/room-reimagination");
    await page.locator(".room-section-links a[href='#room-settings']").tap();
    await expect(page).toHaveURL(/#room-settings$/);
  });
});
