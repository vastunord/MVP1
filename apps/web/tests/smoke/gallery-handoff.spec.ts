import { expect, test } from "@playwright/test";
import { tools } from "@vastunord/contracts/tools";
import { renderGallery } from "../../src/lib/render-gallery";

test("visitors can filter approved studies and open a captioned photo without a private project", async ({
  page,
}) => {
  const privateRequests: string[] = [];
  page.on("request", (request) => {
    const path = new URL(request.url()).pathname;
    if (/^\/api\/(assets|projects)(\/|$)/.test(path))
      privateRequests.push(path);
  });
  await page.goto("/en/gallery");
  const consent = page.getByRole("button", { name: "Reject optional" });
  if (await consent.isVisible()) await consent.click();
  await expect(
    page.getByRole("heading", { name: "Gallery", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".vn-tile-open")).toHaveCount(renderGallery.length);
  await page
    .getByRole("group", { name: "Subject" })
    .getByRole("radio", { name: "Bedrooms", exact: true })
    .check();
  const bedrooms = renderGallery.filter(
    (scene) => scene.style[1] === "Bedrooms",
  );
  await expect(page.locator(".vn-tile-open")).toHaveCount(bedrooms.length);
  await page.locator(".vn-tile-open").first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("img")).toHaveAttribute(
    "alt",
    bedrooms[0].title[1],
  );
  await expect(
    dialog.getByRole("link", { name: /Open Studio/ }),
  ).toHaveAttribute("href", /\?sample=gallery-\d+$/);
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "NO – Norsk bokmål" }).click();
  await expect(page).toHaveURL(/\/gallery$/);
  await expect(
    page.getByRole("heading", { name: "Galleri", exact: true }),
  ).toBeVisible();
  await expect(page.locator('input[type="file"]')).toHaveCount(0);
  expect(privateRequests).toEqual([]);
});

test("a gallery photo opens with each of the 17 Studio tools and favourites survive a reload", async ({
  page,
}) => {
  await page.goto("/app/renders");
  const consent = page.getByRole("button", { name: "Avvis valgfrie" });
  if (await consent.isVisible()) await consent.click();
  await page.locator(".vn-favourite").first().click();
  await page.reload();
  await expect(page.locator(".vn-favourite").first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator(".vn-tile-open").first().click();
  const dialog = page.locator(".vn-scene-dialog");
  const menu = dialog.getByRole("group", {
    name: "Bruk dette bildet i Studio",
  });
  await expect(menu.getByRole("radio")).toHaveCount(17);
  await expect(menu.locator("img")).toHaveCount(17);
  const link = dialog.getByRole("link", { name: /Åpne Studio/ });
  for (const tool of tools) {
    await menu.getByRole("radio", { name: tool.name, exact: true }).check();
    await expect(link).toHaveAttribute(
      "href",
      tool.route + "?sample=gallery-01",
    );
  }
  await link.click();
  await expect(page.locator(".studio-canvas img").first()).toHaveAttribute(
    "src",
    /scene-01/,
  );
  await expect(
    page.getByRole("heading", { name: tools.at(-1)!.name, exact: true }),
  ).toBeVisible();
});
