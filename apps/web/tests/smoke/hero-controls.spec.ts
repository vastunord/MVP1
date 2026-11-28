import { expect, test } from "@playwright/test";

for (const item of [
  { route: "/en", name: "Compare before and after" },
  { route: "/", name: "Sammenlign før og etter" },
]) {
  test(`hero comparison keyboard extremes and reduced motion: ${item.route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.install();
    await page.goto(item.route);
    const stage = page.locator(".photo-hero-stage");
    const slider = stage.getByRole("slider", { name: item.name });
    await expect(slider).toBeVisible();
    const scene = await stage.getAttribute("data-scene");
    await slider.focus();
    await slider.press("End");
    await expect(slider).toHaveValue("100");
    await expect(stage).toHaveCSS("--comparison-split", "100%");
    await page.clock.fastForward(30000);
    await expect(slider).toHaveValue("100");
    await expect(stage).toHaveAttribute("data-scene", scene!);
    await slider.press("Home");
    await expect(slider).toHaveValue("0");
    await expect(stage).toHaveCSS("--comparison-split", "0%");
    await slider.press("ArrowRight");
    await expect(slider).toHaveValue("1");
  });
}

test("homepage comparison remains keyboard-operable while Prana is open", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open Prana assistant", exact: true }).click();
  const panel = page.getByRole("dialog", { name: "VastuNord Prana" });
  await expect(panel).toBeVisible();
  const slider = page.locator(".photo-hero-stage").getByRole("slider", { name: "Compare before and after" });
  await slider.focus();
  await slider.press("Home");
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("1");
  await expect(panel).toBeVisible();
});

test("all eleven reveals advance from the original to the result, then wrap", async ({ page }) => {
  test.setTimeout(100_000);
  const { homeComparisons } = await import("../../src/lib/home-comparisons");
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  const baseline = new Date("2026-11-28T12:00:00Z");
  await page.clock.install({ time: baseline });
  await page.clock.pauseAt(new Date(baseline.getTime() + 1000));
  await page.goto("/en");
  const stage = page.locator(".photo-hero-stage");
  const range = stage.getByRole("slider");
  await expect(page.getByRole("button", { name: "Pause slideshow" })).toBeVisible();
  await stage.scrollIntoViewIfNeeded();
  for (const [i, pair] of homeComparisons.entries()) {
    await expect(stage).toHaveAttribute("data-scene", pair.id);
    await expect(range).toHaveValue("0");
    await expect(stage.locator(".hero-images > img")).toHaveAttribute("src", pair.before);
    await expect(stage.locator(".hero-after img")).toHaveAttribute("src", pair.after);
    await expect(stage.locator(".hero-after")).toHaveCSS("clip-path", "inset(0px 100% 0px 0px)");
    await page.clock.runFor(6600);
    const middle = Number(await range.inputValue());
    expect(middle).toBeGreaterThan(45);
    expect(middle).toBeLessThan(55);
    await page.clock.runFor(6400);
    await expect(range).toHaveValue("100");
    await expect(stage.locator(".hero-after")).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
    await page.clock.runFor(550);
    await expect(stage).toHaveAttribute("data-scene", homeComparisons[(i + 1) % homeComparisons.length].id);
  }
  await page.reload();
  await expect(stage).toHaveAttribute("data-scene", homeComparisons[0].id);
  await expect(range).toHaveValue("0");
  await range.focus();
  await range.press("ArrowRight");
  await page.getByRole("button", { name: "Play slideshow" }).focus();
  await page.clock.runFor(2000);
  await expect(range).toHaveValue("1");
});
