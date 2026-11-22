import { test, expect } from "@playwright/test";
import { tools } from "@vastunord/contracts/tools";
test("unconfigured account forms and private APIs stay closed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/signup");
  await expect(
    page.getByRole("heading", { name: "Opprett konto" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Opprett konto" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await page.goto("/en/login?oauth=incomplete");
  await expect(page.getByRole("button", { name: "Sign in" })).toBeDisabled();
  await expect(page.getByRole("button", { name: /Continue with (Google|GitHub|Apple)/ })).toHaveCount(0);
  await expect(page.getByRole("main").getByRole("alert")).toContainText("Sign-in was not completed.");
  const projects = await page.request.get("/api/projects");
  expect(projects.status()).toBe(503);
  const auth = await page.request.get("/api/auth/get-session");
  expect(auth.status()).toBe(503);
});
test("public route placeholders and system theme", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".notice")).toContainText(
    "Ikke-kommersiell demonstrasjon",
  );
  await page.goto("/en");
  await expect(page.locator(".notice")).toContainText(
    "Noncommercial demonstration",
  );
  for (const prefix of ["", "/en"]) {
    for (const route of [
      "",
      "/features",
      "/about",
      "/pricing",
      "/resources",
      "/contact",
      "/login",
      "/signup",
      "/forgot-password",
    ]) {
      await page.goto(prefix + route || "/");
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute(
        "lang",
        prefix ? "en" : "nb-NO",
      );
    }
  }
  await expect(page.locator("html")).toHaveAttribute("data-theme", "system");
  await page.emulateMedia({ colorScheme: "light" });
  const light = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: "dark" });
  const dark = await page
    .locator("body")
    .evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(light).not.toEqual(dark);
  await page.screenshot({
    path: "test-results/screenshots/dark-placeholder.png",
  });
});
test("all 17 routes render shared editors with disabled generation", async ({
  page,
}) => {
  for (const tool of tools) {
    await page.goto(tool.route);
    await expect(
      page.getByRole("heading", { name: tool.name, exact: true }),
    ).toBeVisible();
    await expect(page.locator(".primary-action button")).toBeDisabled();
    await expect(page.locator("input[type=file]")).toHaveCount(0);
  }
});
test("filters, routing, locale and theme persist", async ({ page }) => {
  await page.goto("/app/library");
  await expect(page.locator(".tool-card")).toHaveCount(17);
  await page
    .getByRole("button", { name: "Bildeforbedring", exact: true })
    .click();
  await expect(page.locator(".tool-card")).toHaveCount(3);
  await page.getByRole("button", { name: "EN – English" }).click();
  await expect(
    page.getByRole("heading", { name: "Studio", level: 1, exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Switch to dark theme", exact: true }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/");
  await page.getByRole("button", { name: "EN – English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/solutions/garden-renovation");
  await expect(page.getByRole("heading")).toContainText(
    "This page does not exist",
  );
});
test("conditional editor controls, keyboard and dialog", async ({ page }) => {
  await page.goto("/app/tools/seasonal-transformation");
  await page.getByRole("group",{name:"Season",exact:true}).getByRole("radio",{name:"Winter",exact:true}).check();
  await expect(page.getByRole("group",{name:"Snow",exact:true})).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Show it in winter", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Om denne forhåndsvisningen" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip")).toBeFocused();
});
for (const width of [390, 768, 1280, 1440])
  test("responsive layout " + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/app/library",
      "/app/tools/lighting-reimagination",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path:
          "test-results/screenshots/" +
          width +
          "-" +
          (route === "/"
            ? "home"
            : route.endsWith("library")
              ? "library"
              : "editor") +
          ".png",
        fullPage: true,
      });
    }
    if (width < 1100) {
      await page.getByRole("button", { name: "Meny", exact: true }).click();
      await expect(
        page.getByRole("navigation", { name: "Meny" }),
      ).toBeVisible();
      await page
        .getByRole("navigation", { name: "Meny" })
        .getByRole("link", { name: "Åpne Studio", exact: true })
        .click();
      await expect(page).toHaveURL(/app\/library$/);
    }
  });
