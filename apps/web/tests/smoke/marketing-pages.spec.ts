import { expect, test } from "@playwright/test";

test("footer terms and privacy stay in the selected language", async ({ page }) => {
  for (const [prefix, terms, privacy] of [["", "Bruksvilkår", "Personvern og informasjonskapsler"], ["/en", "Terms of use", "Privacy and cookies"]]) {
    await page.goto(prefix + "/");
    if (!prefix) {
      await page.getByRole("button", { name: "Avvis valgfrie", exact: true }).click();
    }
    await page.getByRole("contentinfo").getByRole("link", { name: terms }).click();
    await expect(page).toHaveURL(new RegExp(prefix + "/terms$"));
    await expect(page.getByRole("heading", { name: terms, level: 1 })).toBeVisible();
    await page.getByRole("main").getByRole("link", { name: privacy }).click();
    await expect(page).toHaveURL(new RegExp(prefix + "/privacy$"));
    await expect(page.getByRole("main").getByRole("link", { name: /Groq/ })).toHaveAttribute("href", "https://console.groq.com/docs/your-data");
  }
});

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
    main.getByRole("group", { name: "Filter by topic", exact: true })
      .getByRole("button", { name: "Materials", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const results = main.locator(".mp-read");
  await expect(results).toHaveCount(12);
  const firstPageTitles = await results.locator("strong").allTextContents();
  const pages = main.getByRole("navigation", { name: "Article pages" });
  await pages.getByRole("button", { name: "Next" }).click();
  await expect(pages).toContainText("Page 2");
  await expect(results.locator("strong").first()).not.toHaveText(firstPageTitles[0]);
  await pages.getByRole("button", { name: "Previous" }).click();
  await expect(results.locator("strong").first()).toHaveText(firstPageTitles[0]);
  const allTopics = main.getByRole("group", { name: "Filter by topic" })
    .getByRole("button", { name: "All topics", exact: true });
  await allTopics.focus();
  await page.keyboard.press("Space");
  await expect(allTopics).toHaveAttribute("aria-pressed", "true");
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
  await main.locator(".mp-link-row").getByRole("link", { name: "Open Studio" }).click();
  await expect(page).toHaveURL(/\/app\/tools\/room-reimagination$/);
  await page.goto("/en/pricing");
  await expect(
    main.getByText("Subscriptions unavailable", { exact: true }),
  ).toBeVisible();
  await main.getByRole("link", { name: "Open Studio" }).first().click();
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
