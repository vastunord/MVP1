import { expect, test } from "@playwright/test";
import { renderGallery } from "../../src/lib/render-gallery";

test("dashboard opens a project study and its album; gallery searches and previews reference images", async ({
  page,
}) => {
  await page.goto("/app");
  await expect(
    page.getByRole("heading", { name: "Gode rom begynner her." }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Fjordboligen/ }).click();
  await expect(
    page.getByRole("heading", { name: "Fjordboligen" }),
  ).toBeVisible();
  await page.getByRole("link", { name: /Åpne album/ }).click();
  await expect(page.locator(".vn-tile")).toHaveCount(renderGallery.filter((scene) => scene.study === "fjord").length);
  await page
    .getByRole("searchbox", { name: "Søk etter bilder" })
    .fill("Gyllent");
  await expect(page.locator(".vn-tile")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Favoritt Gyllent kveldslys" })
    .click();
  await page.getByRole("button", { name: "Favoritter", exact: true }).click();
  await page.locator(".vn-tile-open").click();
  await expect(
    page.getByRole("dialog", { name: "Gyllent kveldslys" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Film", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Ingen filmer i denne samlingen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Vis samlingen" }).click();
  await expect(page.locator(".vn-tile")).toHaveCount(50);
  const uniqueUrls = await page.locator(".vn-tile img").evaluateAll((images) =>
    new Set(images.map((image) => image.getAttribute("src"))).size,
  );
  expect(uniqueUrls).toBe(50);
});

test("workspace command search finds tools and supports keyboard dismissal", async ({
  page,
}) => {
  await page.goto("/app");
  const dialog = page.getByRole("dialog", { name: "Søk i Studio" });
  // A first navigation may paint the server-rendered page before the shortcut is hydrated.
  await expect(async () => {
    if (!(await dialog.isVisible())) await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible({timeout: 700});
  }).toPass({timeout: 5000});
  await dialog.getByRole("searchbox").fill("garden");
  await expect(
    dialog.getByRole("link", { name: /Garden Design/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(".vn-search-button")).toBeFocused();
  await page.goto("/app/search");
  await page.getByRole("main").getByRole("searchbox").fill("garden");
  await page
    .getByRole("main")
    .getByRole("link", { name: /Garden Design/ })
    .click();
  await expect(
    page.getByRole("heading", { name: "Garden Design", exact: true }),
  ).toBeVisible();
});
