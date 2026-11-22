import { expect, test } from "@playwright/test";

test("resource search, topic filters and expandable articles work together", async ({
  page,
}) => {
  await page.goto("/en/resources");
  const main = page.locator("main");
  await main.getByLabel("Search resources").fill("virtual staging");
  await expect(main.locator(".mp-read")).toHaveCount(1);
  await main.locator(".mp-read summary").click();
  await expect(main.getByText(/Virtual staging illustrates/)).toBeVisible();
  await main.getByLabel("Search resources").fill("zzzzz");
  await expect(main.getByText("No guides match your search.")).toBeVisible();
  await main.getByRole("button", { name: "Show all guides" }).click();
  await main.getByRole("link", { name: "Materials" }).click();
  await expect(
    main.getByRole("combobox", { name: "Filter by topic", exact: true }),
  ).toHaveValue("5");
  await expect(main.locator(".mp-read")).toHaveCount(2);
});

test("living-room directions, pricing and the closed contact form", async ({
  page,
}) => {
  await page.goto("/en/features");
  const main = page.locator("main");
  await main
    .getByRole("button", { name: "Evening light", exact: true })
    .click();
  await expect(main.locator(".mp-variant img")).toHaveAttribute(
    "src",
    "/reference/editorial/feature-variant.webp",
  );
  await expect(main.locator(".mp-variant img")).toHaveClass(/mk-tone-evening/);
  await main.locator(".mp-link-row").getByRole("link", { name: "Explore Studio" }).click();
  await expect(page).toHaveURL(/\/app\/tools\/room-reimagination$/);
  await page.goto("/en/pricing");
  await expect(
    main.getByText("Subscriptions unavailable", { exact: true }),
  ).toBeVisible();
  await main.getByRole("link", { name: "Open demonstration" }).click();
  await expect(page).toHaveURL(/\/app\/library$/);
  await page.goto("/en/contact");
  await main.getByRole("link", { name: /Partnerships/ }).click();
  await expect(main.getByLabel("Subject")).toHaveValue("Partnerships");
  await expect(main.getByLabel("Message", { exact: true })).toBeDisabled();
  await expect(
    main.getByRole("button", { name: "Sending unavailable" }),
  ).toBeDisabled();
});
test("article permalinks and living-room solution preserve locale", async ({
  page,
}) => {
  await page.goto("/en/resources/virtual-staging-vs-traditional-staging");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Virtual staging or traditional staging?",
  );
  await page.getByRole("link", { name: "All guides" }).click();
  await expect(page).toHaveURL(/\/en\/resources$/);
  await page.goto("/en/solutions/living-room-design");
  await expect(page).toHaveURL(/\/en\/features$/);
  const missing = await page.request.get("/resources/unpublished-article");
  expect(missing.status()).toBe(404);
});
