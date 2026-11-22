import { test, expect } from "@playwright/test";

test("studio sample tones, accessible comparison and independent editor settings", async ({
  page,
}) => {
  await page.goto("/app/tools/room-reimagination");
  const comparison = page.getByRole("slider", {
    name: "Sammenlign før og etter",
  });
  await expect(comparison).toHaveValue("46");
  await comparison.focus();
  await comparison.press("ArrowRight");
  await expect(comparison).toHaveValue("47");
  await page.getByRole("button", { name: "Kveldslys", exact: true }).click();
  await expect(page.locator("figcaption")).toContainText("Kveldslys");
  await page.getByRole("button", { name: "Sammenlign", exact: true }).click();
  await expect(comparison).toHaveCount(0);
  await page.getByRole("combobox", { name: "Interiørstil", exact: true }).selectOption("Japandi");
  await expect(page.getByRole("combobox", { name: "Interiørstil", exact: true })).toHaveValue("Japandi");
  await page.getByText("Skrivetips", { exact: true }).click();
  await expect(
    page.getByText("Angi hvilken del", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".primary-action button")).toBeDisabled();
});

test("room design settings combine keyboard-accessible media, camera and editable design directions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app/tools/room-reimagination");
  const design = page.getByRole("region", { name: "Innstillinger for romdesign" });
  const media = design.getByRole("group", { name: "Bildestil" });
  await expect(media.getByRole("radio")).toHaveCount(9);
  await media.getByRole("radio", { name: "Fotografi" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(media.getByRole("radio", { name: "Leirmodell" })).toBeChecked();
  await expect(design.getByRole("group", { name: "Synsvinkel" })).toHaveCount(0);
  await design.getByRole("radio", { name: "Nytt utsnitt" }).check();
  await design.getByRole("radio", { name: "Lav vinkel" }).check();
  await design.getByText("Romdetaljer", { exact: true }).click();
  await design.getByRole("button", { name: "Familieliv" }).click();
  await expect(design.getByLabel("Barnevennlig innredning")).toBeChecked();
  await expect(design.getByRole("combobox", { name: "Interiørstil", exact: true })).toHaveValue("Scandinavian");
  await design.getByRole("group", { name: "Planter" }).getByRole("radio", { name: "Frodig" }).check();
  await expect(design.getByRole("button", { name: "Familieliv" })).toHaveAttribute("aria-pressed", "false");
  await design.getByText("Bildeinnstillinger", { exact: true }).click();
  await design.getByRole("radio", { name: "16:9" }).check();
  await design.getByRole("button", { name: "Ny tilfeldig startverdi" }).click();
  await expect(design.getByRole("textbox", { name: "Startverdi" })).toHaveValue(/^\d{1,10}$/);
  await expect(design).not.toContainText("Standardvalg eller alternativer er ikke bekreftet");
  await page.getByRole("link", { name: "Bilde og beskrivelse" }).click();
  await page.getByText("Referansebilder", { exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Materialer", exact: true })).toBeDisabled();
  await expect(page.getByRole("combobox", { name: "Stemning", exact: true })).toBeDisabled();
  await expect(page.locator(".primary-action button")).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});

test("library search and recovery from an empty result", async ({ page }) => {
  await page.goto("/app/library");
  const search = page.getByRole("searchbox", { name: "Søk", exact: true });
  await search.fill("kameravinkel");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(page.locator(".tool-card")).toContainText(
    "Perspective Correction",
  );
  await search.fill("xyz-no-tool");
  await expect(page.locator(".tool-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Tilbakestill", exact: true }).click();
  await expect(page.locator(".tool-card")).toHaveCount(17);
});

test("unspecified outdoor controls share one disclosure", async ({ page }) => {
  await page.goto("/app/tools/outdoor-visualization");
  const unavailable = page.locator("details").filter({ hasText: "Utilgjengelige innstillinger" });
  await expect(unavailable).toHaveCount(1);
  await unavailable.locator("summary").click();
  await expect(unavailable.getByRole("listitem")).toHaveCount(5);
  await expect(unavailable).toContainText("Omgivelser");
  await expect(page.locator(".primary-action button")).toBeDisabled();
});
