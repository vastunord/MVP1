import { expect, test } from "@playwright/test";

const slug = "window-glow-over-still-water";

test("mobile reader scans the bilingual study and its measured palette", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/resources");
  await page.getByRole("button", { name: "Reject optional" }).click();
  const main = page.locator("main");
  await main
    .getByLabel("Search resources")
    .fill("Window glow over still water");
  await expect(main.locator(".mp-read")).toHaveCount(1);
  await main.locator(".mp-read summary").click();
  await main.getByRole("link", { name: /Open article/ }).click();
  await expect(page).toHaveURL(new RegExp("/en/resources/" + slug + "$"));
  await expect(main.getByRole("heading", { level: 1 })).toHaveText(
    "Window glow over still water",
  );
  await expect(
    main.getByRole("img", {
      name: "The lit rooms read first, then the posts in the water.",
    }),
  ).toBeVisible();
  await expect(main.locator(".study-palette li")).toHaveCount(3);
  await expect(main.locator(".study-tones span")).toHaveCount(9);
  await expect(main.locator(".study-related a")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.goto("/resources/" + slug);
  await expect(main.getByRole("heading", { level: 1 })).toHaveText(
    "Vindusglød over stille vann",
  );
});

test("Studio Knowledge links directly to the same article", async ({
  page,
}) => {
  await page.goto("/app/knowledge");
  const main = page.locator("main");
  const search = main.getByRole("searchbox");
  const english = (await page.locator("html").getAttribute("lang")) === "en";
  await search.fill(
    english ? "Window glow over still water" : "Vindusglød over stille vann",
  );
  const result = main.locator(".xp-study-card");
  await expect(result).toHaveCount(1);
  await result.click();
  await expect(page).toHaveURL(new RegExp("/resources/" + slug + "$"));
});
