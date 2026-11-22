import { test, expect } from "@playwright/test";

test("the homepage cycles through every pair, wraps and respects pause and reduced motion", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/en");
  await page.locator(".vn-cookie-notice").waitFor();
  const hero = page.locator(".photo-hero");
  const stage = hero.locator(".photo-hero-stage");
  const first = await stage.getAttribute("data-scene");
  const visited = new Set([first]);
  for (let index = 0; index < 11; index++) {
    await page.clock.fastForward(8100);
    await expect(hero.locator(".hero-incoming")).toHaveCount(1);
    await page.clock.fastForward(700);
    await expect(hero.locator(".hero-incoming")).toHaveCount(0);
    visited.add(await stage.getAttribute("data-scene"));
  }
  expect(visited.size).toBe(11);
  await expect(stage).toHaveAttribute("data-scene", first!);
  await hero.getByRole("button", { name: "Pause slideshow" }).click();
  await page.clock.fastForward(20000);
  await expect(stage).toHaveAttribute("data-scene", first!);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(
    hero.getByRole("button", { name: "Pause slideshow" }),
  ).toHaveCount(0);
  await page.clock.fastForward(20000);
  await expect(stage).toHaveAttribute("data-scene", first!);
});

test("home study controls and transformation directions lead into the Studio", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: "See what’s possible." }),
  ).toBeVisible();
  const hero = page.locator(".photo-hero");
  const slider = hero.getByRole("slider", { name: "Compare before and after" });
  await expect(
    hero.getByRole("button", { name: "Compare", exact: true }),
  ).toHaveCount(0);
  await slider.focus();
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("100");
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("0");
  const stage = hero.locator(".photo-hero-stage");
  const first = await stage.getAttribute("data-scene");
  await hero.getByRole("button", { name: "Next image pair" }).click();
  await expect(stage).not.toHaveAttribute("data-scene", first!);
  await page.getByRole("link", { name: "Transform outdoors" }).click();
  await expect(
    page.getByRole("heading", { name: "Garden Design", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Evening", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Evening", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByText("Do I need design experience?", { exact: true }).click();
  await expect(
    page.getByText(
      "Explore the tools and studies without prior design training.",
    ),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore this tool" }).click();
  await expect(page).toHaveURL(/app\/tools\/garden-design$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("a selected public study remains the source when reopening or switching tools", async ({
  page,
}) => {
  const privateRequests: string[] = [];
  page.on("request", (request) => {
    const pathname = new URL(request.url()).pathname;
    if (/^\/api\/(projects|assets)(\/|$)/.test(pathname))
      privateRequests.push(pathname);
  });
  await page.goto("/en");
  const hero = page.locator(".photo-hero");
  await expect(hero.locator(".photo-hero-actions a").first()).toHaveText(
    /Try this image/,
  );
  await hero.getByRole("button", { name: "Next image pair" }).click();
  await expect(hero.locator(".hero-counter")).toHaveText(/^02/);
  const original = await hero.locator(".hero-images > img").getAttribute("src");
  const href = await hero
    .getByRole("link", { name: "Try this image" })
    .getAttribute("href");
  await hero.getByRole("link", { name: "Try this image" }).click();
  await expect(page).toHaveURL(new URL(href!, page.url()).href);
  const canvas = page.locator(".studio-canvas");
  const source = canvas.locator(".selected-stage img");
  await expect(source).toBeVisible();
  expect(decodeURIComponent((await source.getAttribute("src"))!)).toContain(
    original,
  );
  await expect(canvas.locator("figcaption")).toContainText(
    "Selected source photo",
  );
  await expect(page.locator("input[type=file]")).toHaveCount(0);
  await expect(page.locator(".primary-action button")).toBeDisabled();
  await page.reload();
  await expect(source).toBeVisible();
  await page.getByText("Try another tool with this photo").click();
  await page.getByRole("link", { name: "Change the lighting" }).click();
  await expect(page).toHaveURL(
    /\/app\/tools\/lighting-reimagination\?sample=hero-[\w-]+$/,
  );
  await expect(source).toBeVisible();
  await page
    .getByRole("banner")
    .getByRole("button", { name: "NO – Norsk bokmål" })
    .click();
  await expect(page).toHaveURL(
    /\/app\/tools\/lighting-reimagination\?sample=hero-[\w-]+$/,
  );
  await expect(canvas.locator(".selected-stage img")).toBeVisible();
  await page
    .getByRole("banner")
    .getByRole("button", { name: "EN – English" })
    .click();
  await page.goto("/app/tools/lighting-reimagination?sample=unknown");
  await expect(canvas.locator("figcaption")).toContainText("Brand sample");
  expect(privateRequests).toEqual([]);
});

test("sign-in keeps the fixed room-upload destination through account steps", async ({
  page,
}) => {
  await page.goto("/en/login?intent=room-upload");
  const main = page.getByRole("main");
  await main.getByRole("link", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/en\/signup\?intent=room-upload$/);
  await main.getByRole("link", { name: "Already have an account?" }).click();
  await expect(page).toHaveURL(/\/en\/login\?intent=room-upload$/);
  await main.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page).toHaveURL(/\/en\/forgot-password\?intent=room-upload$/);
  await page.goto("/en/login?intent=unrecognized");
  await expect(
    main.getByRole("link", { name: "Create account" }),
  ).toHaveAttribute("href", "/en/signup");
});

test("the Norwegian photo entry works on a narrow screen with private uploads closed", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const hero = page.locator(".photo-hero");
  await expect(
    hero.getByRole("slider", { name: "Sammenlign før og etter" }),
  ).toBeInViewport();
  await expect(
    hero.getByRole("link", { name: "Last opp ditt bilde" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: /Avvis/ }).first().click();
  const primary = hero.getByRole("link", { name: "Åpne Studio" });
  await primary.click();
  await expect(page).toHaveURL(
    /\/app\/tools\/room-reimagination#source-image$/,
  );
  await expect(page.locator("#source-image")).toContainText(
    "Privat opplasting er ikke tilgjengelig.",
  );
  await page.goBack();
  await hero.getByRole("link", { name: "Prøv dette bildet" }).click();
  await expect(page).toHaveURL(
    /\/app\/tools\/room-reimagination\?sample=hero-[\w-]+$/,
  );
  await expect(
    page.locator(".studio-canvas .selected-stage img"),
  ).toBeVisible();
});
