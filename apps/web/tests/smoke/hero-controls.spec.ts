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
