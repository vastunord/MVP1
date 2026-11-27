import { expect, test } from "@playwright/test";

test.describe("first paint without client execution", () => {
  test.use({ javaScriptEnabled: false });
  for (const locale of ["", "/en"]) for (const width of [320, 390]) for (const height of [500, 900]) test(`${locale || "no"} ${width}×${height}: auth is bounded and keyboard-scrollable before hydration`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const response = await page.goto(`${locale}/login`);
    expect(response?.status()).toBe(200);
    const region = page.locator(".auth-layout");
    const [main, dock] = await Promise.all([region.boundingBox(), page.locator(".vn-prana-dock").boundingBox()]);
    expect(main).not.toBeNull(); expect(dock).not.toBeNull();
    expect(main!.y + main!.height).toBeLessThanOrEqual(dock!.y);
    await region.focus();
    await page.keyboard.press("PageDown");
    await expect.poll(() => region.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
    const lastField = region.locator("input").last();
    await lastField.scrollIntoViewIfNeeded();
    const [visibleRegion, field] = await Promise.all([region.boundingBox(), lastField.boundingBox()]);
    expect(visibleRegion).not.toBeNull(); expect(field).not.toBeNull();
    expect(field!.y).toBeGreaterThanOrEqual(visibleRegion!.y);
    expect(field!.y + field!.height).toBeLessThanOrEqual(visibleRegion!.y + visibleRegion!.height);
  });
});

for (const locale of ["", "/en"]) for (const height of [600, 750, 900]) {
  test(`${locale || "no"} auth scroll region and footer at 390×${height}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    const response = await page.goto(`${locale}/login`);
    expect(response?.status()).toBe(200);
    const main = page.locator(".auth-layout");
    await expect(main).toHaveCSS("overflow-y", "auto");
    const box = await main.boundingBox();
    const dock = await page.locator(".vn-prana-dock").boundingBox();
    expect(box).not.toBeNull(); expect(dock).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThanOrEqual(dock!.y);
    const note = main.locator(".auth-panel p.small");
    await note.scrollIntoViewIfNeeded();
    const state = await note.evaluate((node) => {
      const a = node.getBoundingClientRect();
      const panel = node.closest("main")!.getBoundingClientRect();
      const docks = [...document.querySelectorAll(".vn-cookie-dock, .vn-prana-dock")];
      return { top: a.top, bottom: a.bottom, panelTop: panel.top, panelBottom: panel.bottom,
        blocked: docks.some((d) => { const b = d.getBoundingClientRect(); return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }) };
    });
    expect(state.top).toBeGreaterThanOrEqual(state.panelTop);
    expect(state.bottom).toBeLessThanOrEqual(state.panelBottom);
    expect(state.blocked).toBe(false);
    const footerLink = page.locator("footer").getByRole("link", { name: /Privacy|Personvern/ }).first();
    await footerLink.scrollIntoViewIfNeeded();
    await expect(footerLink).toBeInViewport();
  });
}

test("auth scroll region responds to wheel and does not trap keyboard navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/en/login");
  const main = page.locator(".auth-layout");
  await expect(main).toHaveAttribute("tabindex", "0");
  await expect(main).toHaveAccessibleName("Sign in");
  await expect(main).toHaveAccessibleDescription("Scroll to view the form.");
  await main.focus();
  await page.keyboard.press("PageDown");
  await expect.poll(() => main.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  await main.evaluate((node) => { node.scrollTop = 0; });
  await main.hover();
  await page.mouse.wheel(0, 350);
  await expect.poll(() => main.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
  const createAccount = main.getByRole("link", { name: "Create account" });
  await createAccount.focus();
  await expect(createAccount).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("footer").getByRole("link").first()).toBeFocused();
});

for (const locale of ["", "/en"]) for (const route of ["login", "signup", "forgot-password", "reset-password", "verify-email"]) {
  test(`${locale || "no"}/${route} keeps the form inside its mobile safe region`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 600 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto(`${locale}/${route}`);
    const main = page.locator(".auth-layout");
    await expect(main).toHaveCSS("overflow-y", "auto");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    const region = await main.boundingBox();
    const dock = await page.locator(".vn-prana-dock").boundingBox();
    expect(region).not.toBeNull(); expect(dock).not.toBeNull();
    expect(region!.y + region!.height).toBeLessThanOrEqual(dock!.y);
    const last = main.locator("a, button, input").last();
    await last.scrollIntoViewIfNeeded();
    const boxes = await Promise.all([main.boundingBox(), last.boundingBox()]);
    expect(boxes[0]).not.toBeNull(); expect(boxes[1]).not.toBeNull();
    expect(boxes[1]!.y + boxes[1]!.height).toBeLessThanOrEqual(boxes[0]!.y + boxes[0]!.height + 1);
  });
}

test("auth safe region adapts to consent changes and viewport rotation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/en/login");
  const main = page.locator(".auth-layout");
  const notice = page.getByRole("complementary", { name: "Your cookie choices" });
  await notice.getByRole("button", { name: "Reject optional" }).click();
  await expect(page.locator(".vn-cookie-dock")).toBeVisible();
  const clear = async () => {
    const boxes = await Promise.all([main.boundingBox(), page.locator(".vn-cookie-dock").boundingBox(), page.locator(".vn-prana-dock").boundingBox()]);
    return boxes.every(Boolean) && boxes[0]!.y + boxes[0]!.height <= Math.min(boxes[1]!.y, boxes[2]!.y);
  };
  await expect.poll(clear).toBe(true);
  await page.locator(".vn-prana-dock").evaluate((node) => { (node as HTMLElement).style.minHeight = "90px"; });
  await expect.poll(clear).toBe(true);
  await page.locator(".vn-prana-dock").evaluate((node) => { (node as HTMLElement).style.removeProperty("min-height"); });
  await expect.poll(clear).toBe(true);
  await page.locator(".notice").evaluate((node) => { (node as HTMLElement).style.paddingBottom = "50px"; });
  await expect.poll(clear).toBe(true);
  await page.setViewportSize({ width: 900, height: 390 });
  await expect(main).toHaveCSS("overflow-y", "visible");
  await expect(main).not.toHaveAttribute("aria-describedby");
  await page.setViewportSize({ width: 390, height: 750 });
  await expect(main).toHaveCSS("overflow-y", "auto");
  await expect.poll(clear).toBe(true);
});

for (const locale of ["", "/en"]) for (const height of [500, 900]) {
  test(`${locale || "no"} auth initial layout shift at 390×${height}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
      (window as unknown as { __authShift: number }).__authShift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput?: boolean; value: number })[]) {
          if (!entry.hadRecentInput) (window as unknown as { __authShift: number }).__authShift += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto(`${locale}/login`);
    await expect(page.locator(".auth-layout")).toHaveAttribute("aria-describedby", "auth-scroll-hint");
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const shift = await page.evaluate(() => (window as unknown as { __authShift: number }).__authShift);
    console.log(JSON.stringify({ locale: locale || "no", width: 390, height, observedLayoutShiftSum: shift }));
    expect(shift).toBeLessThan(0.1);
  });
}

