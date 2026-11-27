import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

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

for (const [width, locale, theme] of [[390, "nb-NO", "light"], [768, "en", "dark"], [1280, "nb-NO", "dark"], [1440, "en", "light"]] as const) {
  test(`Maya advanced panel ${width} ${locale} ${theme}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 900 });
    await context.addCookies([{ name: "vn-locale", value: locale, url: "http://127.0.0.1:3100" }, { name: "vn-theme", value: theme, url: "http://127.0.0.1:3100" }]);
    await page.goto("/app/tools/room-reimagination");
    const advanced = page.getByText(locale === "en" ? "More options" : "Flere valg", { exact: true });
    await advanced.click();
    await expect(page.getByText(locale === "en" ? "Using tool defaults" : "Bruker standardvalg")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      const reset = page.locator(".editor-reset");
      await reset.scrollIntoViewIfNeeded();
      const resetBox = await reset.boundingBox();
      const dockBox = await page.locator(".vn-prana-dock").boundingBox();
      expect(resetBox && dockBox && resetBox.x + resetBox.width <= dockBox.x).toBe(true);
    }
    const directory = resolve("../../docs/evidence/maya-local");
    await mkdir(directory, { recursive: true });
    await page.screenshot({ path: resolve(directory, `${width}-${locale}-${theme}.png`), fullPage: true });
  });
}
