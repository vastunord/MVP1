import { expect, test } from "@playwright/test";

for (const width of [390, 768, 1280, 1440]) {
  test(`Maya room controls remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/app/tools/room-reimagination");
    await expect(page.getByText("Maya 7.0 · Skap")).toBeVisible();
    const style = page.getByRole("group", { name: "Bildestil" });
    await expect(style.getByRole("radio")).toHaveCount(9);
    await expect(style.getByRole("radio", { name: "Ren 3D" })).toBeEnabled();
    await style.getByRole("radio", { name: "Ren 3D" }).check();
    await expect(style.getByRole("radio", { name: "Ren 3D" })).toBeChecked();
    await style.locator("..").getByRole("button", { name: "Tilbakestill seksjonen" }).click();
    await expect(style.getByRole("radio", { name: "Fotorealistisk" })).toBeChecked();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
  });
}
