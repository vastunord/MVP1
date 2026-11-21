import { expect, test } from "@playwright/test";

test("the room study changes room, light, season and material", async ({
  page,
}) => {
  await page.goto("/app/home-experience");
  const main = page.locator("#main");
  await main.getByRole("button", { name: "Neste rom" }).click();
  await expect(main.getByRole("heading", { name: "Kjøkken" })).toBeVisible();
  await main.getByRole("button", { name: "Soverom" }).click();
  await expect(main.getByRole("heading", { name: "Soverom" })).toBeVisible();
  await main.getByRole("button", { name: "Kveldslys" }).click();
  await main.getByRole("button", { name: "Vinter" }).click();
  await expect(main.locator("figure")).toHaveClass(/xp-evening/);
  await expect(main.locator("figure")).toHaveClass(/xp-season-2/);
  await main.getByRole("button", { name: "Mørk valnøtt" }).click();
  await main.getByRole("button", { name: "Se materialdetaljer" }).click();
  await expect(main.locator("#xp-material-note")).toContainText(
    "En dyp brunfarge",
  );
});

test("knowledge and Prana offer local reading and accessible empty states", async ({
  page,
}) => {
  await page.goto("/app/knowledge");
  const main = page.locator("#main");
  await main.getByLabel("Søk i guidene").fill("zzzz");
  await expect(
    main.getByRole("heading", { name: "Ingen treff" }),
  ).toBeVisible();
  await main.getByRole("button", { name: "Vis alle guider" }).click();
  await main
    .getByRole("combobox", { name: "Tema", exact: true })
    .selectOption("material");
  await expect(main.locator("details")).toHaveCount(1);
  await main.locator("summary").click();
  await expect(main.getByText(/Legg prøver av tre/)).toBeVisible();
  await main.getByRole("link", { name: "Åpne Prana" }).click();
  await main.getByRole("button", { name: "Utforsk tips" }).click();
  await main
    .getByRole("combobox", { name: "Velg tema", exact: true })
    .selectOption("2");
  await expect(
    main.getByRole("heading", { name: "Plass til å bevege seg" }),
  ).toBeVisible();
  await main.getByRole("button", { name: "Film", exact: true }).click();
  await expect(main.getByText(/Ingen filmer er publisert/)).toBeVisible();
});

test("sample budget and wallet work without payments", async ({ page }) => {
  await page.goto("/app/budget");
  const main = page.locator("#main");
  const firstAmount = main.locator(".xp-category strong").first();
  const before = await firstAmount.textContent();
  await main.getByRole("button", { name: /Enkel oppfriskning/ }).click();
  await expect(firstAmount).not.toHaveText(before!);
  await page.goto("/app/billing");
  await main.getByRole("link", { name: "Se kredittoversikt" }).click();
  await main.getByRole("button", { name: "Brukt", exact: true }).click();
  await expect(main.getByText("Ingen belastninger å vise.")).toBeVisible();
});
