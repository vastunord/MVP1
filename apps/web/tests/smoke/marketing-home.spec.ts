import { test, expect } from "@playwright/test";

test("home study controls and transformation directions lead into the Studio", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: "See what’s possible." }),
  ).toBeVisible();
  const lighting = page.getByRole("slider", { name: "Compare room lighting" });
  const views = page.getByRole("group", { name: "View the lighting study" });
  await views.getByRole("button", { name: "After · evening tone" }).click();
  await expect(lighting).toHaveValue("0");
  await views.getByRole("button", { name: "Before · original" }).click();
  await expect(lighting).toHaveValue("100");
  await views.getByRole("button", { name: "Compare", exact: true }).click();
  await expect(
    views.getByRole("button", { name: "Compare", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await lighting.focus();
  await page.keyboard.press("End");
  await expect(lighting).toHaveValue("100");
  await expect(
    views.getByRole("button", { name: "Before · original" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Next study" }).click();
  await expect(
    page.getByRole("heading", { name: "Explore texture and depth." }),
  ).toBeVisible();
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
    /Try this sample/,
  );
  await hero.getByRole("button", { name: "The Atelier Apartment" }).click();
  await hero.getByRole("link", { name: "Try this sample" }).click();
  await expect(page).toHaveURL(
    /\/app\/tools\/material-refinement\?sample=atelier$/,
  );
  const canvas = page.locator(".studio-canvas");
  const source = canvas.getByRole("img", { name: /A loft living room/ });
  await expect(source).toBeVisible();
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
    /\/app\/tools\/lighting-reimagination\?sample=atelier$/,
  );
  await expect(source).toBeVisible();
  await page
    .getByRole("banner")
    .getByRole("button", { name: "NO – Norsk bokmål" })
    .click();
  await expect(page).toHaveURL(
    /\/app\/tools\/lighting-reimagination\?sample=atelier$/,
  );
  await expect(canvas.getByRole("img", { name: /En loftsstue/ })).toBeVisible();
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
    hero.getByRole("group", { name: "Vis lysstudien" }),
  ).toBeInViewport();
  await expect(
    hero.getByRole("link", { name: "Last opp ditt bilde" }),
  ).toHaveCount(0);
  const primary = hero.getByRole("link", { name: "Åpne romeditoren" });
  await primary.click();
  await expect(page).toHaveURL(
    /\/app\/tools\/room-reimagination#source-image$/,
  );
  await expect(page.locator("#source-image")).toContainText(
    "Privat opplasting er ikke tilgjengelig.",
  );
  await page.goBack();
  await hero.getByRole("button", { name: "Forrige studie" }).click();
  await hero.getByRole("link", { name: "Prøv dette bildet" }).click();
  await expect(page).toHaveURL(
    /\/app\/tools\/lighting-reimagination\?sample=cabin$/,
  );
  await expect(
    page
      .locator(".studio-canvas")
      .getByRole("img", { name: /skogvendte vinduer/ }),
  ).toBeVisible();
});
