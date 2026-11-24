import { expect, test } from "@playwright/test";
import { tools } from "@vastunord/contracts/tools";

test("all 17 Studio workflows open directly and identify their active library", async ({ page }) => {
  let providerPosts = 0;
  await page.route("**/api/studio/renders**", route => {
    if (route.request().method() === "POST") providerPosts++;
    return route.fulfill({ status: 503, json: { error: "fixture unavailable" } });
  });
  for (const tool of tools) {
    const response = await page.goto(tool.route);
    expect(response?.status(), tool.route).toBe(200);
    await expect(page.locator(".studio-tool-switcher summary")).toContainText(tool.name);
    await expect(page.locator("aside nav a[aria-current='page']")).toHaveAttribute("href", "/app/library");
    await expect(page).toHaveTitle(/Studio.*Vastu Nord/);
    await expect(page.locator(".inspector [role='status']").first()).toContainText("Bildegenerering er ikke aktivert");
    await expect(page.locator(".primary-action > button").first()).toBeDisabled();
  }
  expect(providerPosts).toBe(0);
});

test("unavailable private renders do not label examples as personal images", async ({ page }) => {
  await page.goto("/app/renders");
  await expect(page.getByRole("heading", { name: "Utforsk eksempler" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dine private bilder" })).toHaveCount(0);
  await expect(page.locator(".vn-private-render-grid")).toHaveCount(0);
});

test("Studio breadcrumb identifies the location without misnaming its destination", async ({ page }) => {
  await page.goto("/app/tools/room-reimagination");
  const breadcrumb = page.locator(".vn-workspace-bar").first();
  await expect(breadcrumb.getByRole("link", { name: "Studio", exact: true })).toHaveAttribute("href", "/app");
  await expect(breadcrumb).toContainText("Studio-bibliotek");
  await page.goto("/app");
  await expect(page.locator(".vn-workspace-bar > span").first()).not.toContainText(" / ");
});
