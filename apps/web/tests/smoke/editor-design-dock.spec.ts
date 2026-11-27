import { expect, test } from "@playwright/test";

async function positionPromptUnderDock(page: import("@playwright/test").Page) {
  const prompt = page.locator("#prompt");
  await prompt.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const target = document.querySelector("#prompt")!.getBoundingClientRect();
    const dock = document.querySelector(".vn-prana-dock")!.getBoundingClientRect();
    window.scrollBy(0, target.bottom - dock.top - 10);
  });
  const before = await prompt.boundingBox();
  expect(before).not.toBeNull();
  const dock = await page.locator(".vn-prana-dock").boundingBox();
  expect(dock).not.toBeNull();
  expect(before!.y + before!.height).toBeGreaterThan(dock!.y);
  return { prompt, before: before! };
}

test("initial mobile Design link is wholly clear of the cookie launcher", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/app/tools/room-reimagination");
  const link = page.locator(".room-section-links a[href='#room-settings']");
  const dock = page.locator(".vn-cookie-dock");
  const [a, b] = await Promise.all([link.boundingBox(), dock.boundingBox()]);
  expect(a).not.toBeNull();
  expect(b).not.toBeNull();
  expect(a!.x >= b!.x + b!.width || a!.x + a!.width <= b!.x || a!.y >= b!.y + b!.height || a!.y + a!.height <= b!.y).toBe(true);
});

for (const locale of ["nb", "en"]) for (const width of [320, 360, 390]) for (const height of [600, 750, 900]) {
  test(`visible section links stay clear of corner launchers in ${locale} at ${width}×${height}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height });
    await context.addCookies([{ name: "vn-locale", value: locale, url: "http://127.0.0.1:3100" }]);
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto("/app/tools/room-reimagination");
    await expect(page.locator(".room-section-links a").nth(1)).toHaveText(locale === "en" ? "Image & brief" : "Bilde og beskrivelse");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const boxes = await page.locator(".room-section-links a").all();
    const nav = await page.locator(".room-section-links").boundingBox();
    expect(nav).not.toBeNull();
    for (const link of boxes) {
      const a = await link.boundingBox();
      expect(a).not.toBeNull();
      expect(a!.x).toBeGreaterThanOrEqual(nav!.x);
      expect(a!.x + a!.width).toBeLessThanOrEqual(nav!.x + nav!.width);
      expect(await link.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      for (const dock of await page.locator(".vn-cookie-dock, .vn-prana-dock").all()) {
        const b = await dock.boundingBox();
        expect(b).not.toBeNull();
        const overlaps = a!.x < b!.x + b!.width && a!.x + a!.width > b!.x && a!.y < b!.y + b!.height && a!.y + a!.height > b!.y;
        expect(overlaps, `${locale} ${width}×${height}: ${await link.innerText()}`).toBe(false);
      }
    }
  });
}

test("initial mobile Studio Design link remains pointer-accessible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/app/tools/room-reimagination");
  const link = page.locator(".room-section-links a[href='#room-settings']");
  await expect(page.locator(".vn-cookie-dock")).toBeVisible();
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
  const { prompt, before } = await positionPromptUnderDock(page);
  await page.locator("body").dispatchEvent("pointerdown", { pointerType: "touch" });
  await page.locator("body").dispatchEvent("pointercancel", { pointerType: "touch" });
  await prompt.evaluate(node => (node as HTMLElement).focus({ preventScroll: true }));
  await expect.poll(async () => (await prompt.boundingBox())!.y).toBeLessThan(before.y - 20);
});

test("keyboard input immediately after touch restores focus correction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/app/tools/room-reimagination");
  const { prompt, before } = await positionPromptUnderDock(page);
  await page.evaluate(() => {
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" }));
    document.body.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "touch" }));
    document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, key: "Tab" }));
    (document.querySelector("#prompt") as HTMLElement).focus({ preventScroll: true });
  });
  await expect.poll(async () => (await prompt.boundingBox())!.y).toBeLessThan(before.y - 20);
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
