import { expect, test } from "@playwright/test";
import { tools } from "@vastunord/contracts/tools";

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
  const menu = dialog.getByRole("combobox");
  const link = dialog.getByRole("link", { name: /Åpne valgt verktøy/ });
  for (const tool of tools) {
    await menu.selectOption(tool.id);
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
