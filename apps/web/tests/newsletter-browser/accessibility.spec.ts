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
