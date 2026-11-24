import { expect, test } from "@playwright/test";

test("public knowledge search survives an article and return", async ({ page }) => {
  await page.goto("/en/resources");
  const search = page.getByRole("searchbox", { name: "Search resources" });
  await search.fill("virtual staging");
  await expect(page).toHaveURL(/q=virtual\+staging/);
  const card = page.locator("article.mp-read").first();
  await expect(card).toContainText("Guide");
  await card.getByRole("link").click();
  await expect(page.getByRole("heading", { name: "Next step" })).toBeVisible();
  await page.getByRole("link", { name: "All guides" }).click();
  await expect(search).toHaveValue("virtual staging");
  await page.reload();
  await expect(search).toHaveValue("virtual staging");
});

test("Studio knowledge uses the same topic and returns to the Studio list", async ({ page }) => {
  await page.goto("/app/knowledge");
  const topics = page.getByRole("group", { name: /Topic|Tema/ });
  const material = topics.getByRole("button", { name: /Materials|Materialer/ });
  await material.click();
  await expect(material).toHaveAttribute("aria-pressed", "true");
  await expect(page).toHaveURL(/topic=5/);
  const study = page.locator("a.xp-study-card").first();
  await expect(study).toContainText(/Visual study|Bildestudie/);
  await study.click();
  await page.getByRole("link", { name: /All guides|Alle guider/ }).click();
  await expect(page).toHaveURL(/\/app\/knowledge\?topic=5/);
  await expect(material).toHaveAttribute("aria-pressed", "true");
});
