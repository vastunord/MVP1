import { expect, test } from "@playwright/test";

test("non-modal Prana permits keyboard work in the Studio and remains fixed on scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
  });
  await page.goto("/app/tools/room-reimagination");
  const launcher = page.getByRole("button", { name: "Åpne Prana-assistenten" });
  await launcher.click();
  const panel = page.getByRole("dialog", { name: "VastuNord Prana" });
  await expect(panel).toBeVisible();
  const before = await panel.boundingBox();
  await page.evaluate(() => window.scrollTo(0, 300));
  const after = await panel.boundingBox();
  expect(before).not.toBeNull();
  expect(after).not.toBeNull();
  expect(Math.abs(before!.y - after!.y)).toBeLessThan(2);
  const firstTab = panel.getByRole("tab", { name: "Prana", exact: true });
  await firstTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(panel.getByRole("tab", { name: "Quick Tips" })).toBeFocused();
  await expect(panel.getByRole("tab", { name: "Quick Tips" })).toHaveAttribute("aria-selected", "true");
  const prompt = page.locator("#prompt");
  await prompt.focus();
  await page.keyboard.type("Synthetic daylight draft");
  await expect(prompt).toHaveValue("Synthetic daylight draft");
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(launcher).toBeFocused();
});

test("cookie and Prana controls reflow in a 195 by 225 CSS-pixel viewport", async ({ page }) => {
  // A narrow CSS-pixel viewport exercises reflow, but is not an OS/browser zoom test.
  await page.setViewportSize({ width: 195, height: 225 });
  await page.goto("/en");
  const notice = page.getByRole("complementary", { name: "Your cookie choices" });
  await expect(notice).toBeVisible();
  await notice.getByRole("button", { name: "Reject optional" }).click();
  const launcher = page.getByRole("button", { name: "Open Prana assistant" });
  await launcher.click();
  const panel = page.getByRole("dialog", { name: "VastuNord Prana" });
  await expect(panel).toBeVisible();
  const close = panel.getByRole("button", { name: "Close" });
  await expect(close).toBeVisible();
  const rect = await close.boundingBox();
  expect(rect).not.toBeNull();
  expect(rect!.x).toBeGreaterThanOrEqual(0);
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(195);
  expect(rect!.y).toBeGreaterThanOrEqual(0);
  expect(rect!.y + rect!.height).toBeLessThanOrEqual(225);
  await close.focus();
  await page.keyboard.press("Enter");
  await expect(panel).toHaveCount(0);
});

for (const route of ["/en", "/en/login", "/app/tools/room-reimagination", "/app/renders"]) {
  for (const width of [390, 640, 768]) test(`keyboard focus stays visible on ${route} at ${width}px`, async ({ page }) => {
    // 640 CSS pixels also exercises a 1280px layout's 200% reflow equivalent;
    // it does not exercise the browser's zoom control or assistive technology.
    await page.setViewportSize({ width, height: 512 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto(route);
    for (let index = 0; index < 14; index++) {
      await page.keyboard.press("Tab");
      const focus = page.locator(":focus");
      if (await focus.count() === 0) continue;
      const state = await focus.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2));
        const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2));
        const hit = document.elementFromPoint(x, y);
        return {
          visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth,
          unobscured: Boolean(hit && (node === hit || node.contains(hit))),
          description: `${node.tagName} ${node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 60) || ""}`,
        };
      });
      expect(state.visible, `Focused element outside viewport: ${state.description}`).toBe(true);
      expect(state.unobscured, `Focused element obscured: ${state.description}`).toBe(true);
    }
  });
}

test("newsletter modal traps keyboard focus and restores its launcher", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
  });
  await page.goto("/en");
  const launcher = page.getByRole("button", { name: "Newsletter", exact: true });
  await launcher.click();
  const dialog = page.getByRole("dialog", { name: "Vastu Nord newsletter" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close", exact: true }).first().focus();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(launcher).toBeFocused();
});

test("newsletter controls remain reachable in a short viewport", async ({ page }) => {
  // A short viewport models constrained space only; it is not a physical keyboard test.
  await page.setViewportSize({ width: 390, height: 360 });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
  });
  await page.goto("/en");
  await page.getByRole("button", { name: "Newsletter", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Vastu Nord newsletter" });
  const email = dialog.getByLabel("Email address");
  await email.focus();
  await expect(email).toBeFocused();
  const consent = dialog.getByRole("checkbox");
  await consent.focus();
  await expect(consent).toBeFocused();
  await dialog.getByRole("button", { name: "Close", exact: true }).first().click();
  await expect(dialog).toHaveCount(0);
});

for (const route of ["/en", "/en/login", "/app/tools/room-reimagination", "/app/renders"]) {
  test(`a main-content action can receive visible keyboard focus on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.goto(route);
    const target = route.includes("room-reimagination")
      ? page.locator("#prompt")
      : page.locator("main a:visible, main button:visible:not(:disabled), main input:visible:not(:disabled), main textarea:visible:not(:disabled)").first();
    await expect(target).toBeVisible();
    await target.focus();
    await expect(target).toBeFocused();
    const visible = await target.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2));
      const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2));
      const hit = document.elementFromPoint(x, y);
      return rect.top < innerHeight && rect.bottom > 0 && !!hit && (node === hit || node.contains(hit));
    });
    expect(visible).toBe(true);
  });
}
