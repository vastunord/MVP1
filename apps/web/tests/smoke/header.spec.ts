import { expect, test } from "@playwright/test";

test("global controls preserve the current route, query, language and theme", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(
    "/resources/visualize-a-renovation-before-you-build?topic=lighting#main",
  );
  const header = page.getByRole("banner");
  const english = header.getByRole("button", { name: "EN – English" });
  const norwegian = header.getByRole("button", { name: "NO – Norsk bokmål" });
  await expect(header.locator("#language button")).toHaveText(["NO", "EN"]);
  await expect(norwegian).toHaveAttribute("aria-pressed", "true");
  await expect(
    header.getByRole("button", { name: "Bytt til lyst tema" }),
  ).toBeVisible();
  await expect(header.locator(".vg-logo-ivory")).toBeVisible();
  await expect(header.locator(".vg-logo-teal")).toBeHidden();
  await english.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(
    /\/en\/resources\/visualize-a-renovation-before-you-build\?topic=lighting#main$/,
  );
  await expect(english).toHaveAttribute("aria-pressed", "true");
  await expect(
    header.getByRole("link", { name: "Knowledge", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await header.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload();
  await expect(header.locator(".vg-logo-teal")).toBeVisible();
  await expect(header.locator(".vg-logo-ivory")).toBeHidden();
  await expect(
    header.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeVisible();
  await header.getByRole("button", { name: "VastuNord Prana" }).click();
  await expect(
    page.getByRole("dialog", { name: "VastuNord Prana" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    header.getByRole("button", { name: "VastuNord Prana" }),
  ).toBeFocused();
  await header.getByRole("link", { name: "Open Studio" }).click();
  await expect(page).toHaveURL(/\/app\/tools\/room-reimagination$/);
  await expect(
    page.getByRole("heading", { name: "Room Reimagination" }),
  ).toBeVisible();
  await norwegian.click();
  await expect(page.locator("html")).toHaveAttribute("lang", "nb-NO");
  await expect(page).toHaveURL(/\/app\/tools\/room-reimagination$/);
  await header.getByRole("link", { name: "Vastu Nord hjem" }).click();
  await expect(page).toHaveURL(/\/$/);
});

for (const width of [390, 768, 1280, 1440]) {
  test.describe(`navigation at ${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, hasTouch: width <= 768 });
    test("keyboard, touch and sticky positioning", async ({ page }) => {
      await page.goto("/about");
      const header = page.getByRole("banner");
      for (const name of [
        "EN – English",
        "NO – Norsk bokmål",
        "Bytt til mørkt tema",
      ]) {
        await expect(
          header.getByRole("button", { name, exact: true }),
        ).toBeInViewport();
      }
      await expect(
        header.getByRole("link", { name: "Åpne Studio" }),
      ).toBeInViewport();
      await expect(
        header.getByRole("button", { name: "VastuNord Prana" }),
      ).toBeInViewport();
      await page.evaluate(() => window.scrollTo(0, 600));
      await expect
        .poll(() =>
          header.evaluate((el) => Math.round(el.getBoundingClientRect().top)),
        )
        .toBe(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);

      if (width < 1200) {
        const toggle = header.getByRole("button", { name: "Meny" });
        const menu = header.getByRole("navigation", { name: "Meny" });
        await toggle.focus();
        await page.keyboard.press("Space");
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await page.keyboard.press("Tab");
        await expect(menu.getByRole("link").first()).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(menu).toBeHidden();
        await expect(toggle).toBeFocused();
        await toggle.tap();
        await expect(
          menu.getByRole("link", { name: "Om oss" }),
        ).toHaveAttribute("aria-current", "page");
        await page.keyboard.press("Escape");
        await header.getByRole("link", { name: "Logg inn" }).tap();
        await expect(menu).toBeHidden();
      } else {
        await expect(
          header.getByRole("link", { name: "Om oss" }),
        ).toHaveAttribute("aria-current", "page");
        await header.getByRole("link", { name: "Logg inn" }).click();
      }
      await expect(
        page.getByRole("button", { name: "Logg inn" }),
      ).toBeDisabled();
    });
  });
}
