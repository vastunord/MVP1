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
  await page.getByRole("button", { name: "Japandi", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Japandi", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByText("Skrivetips", { exact: true }).click();
  await expect(
    page.getByText("Angi hvilken del", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".primary-action button")).toBeDisabled();
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
