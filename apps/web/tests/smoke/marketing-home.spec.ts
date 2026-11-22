import { test, expect } from "@playwright/test";

test("the untinted comparison has its own window beside the desktop introduction", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  const hero = page.locator(".photo-hero");
  const frame = hero.locator(".photo-hero-stage");
  const copy = hero.locator(".photo-hero-copy");
  await expect(frame).toBeInViewport({ ratio: 1 });
  const [frameBox, copyBox] = await Promise.all([
    frame.boundingBox(),
    copy.boundingBox(),
  ]);
  expect(frameBox!.x).toBeGreaterThanOrEqual(copyBox!.x + copyBox!.width);
  expect(frameBox!.width).toBeGreaterThan(copyBox!.width);
  expect(frameBox!.x + frameBox!.width).toBeLessThan(1440);
  expect(await frame.locator("img").count()).toBe(2);
  await expect(frame).toHaveText("");
  await expect(frame.getByRole("button")).toHaveCount(0);
  await expect(frame.locator(".photo-hero-veil")).toHaveCount(0);
  for (const photo of await frame.locator("img").all()) {
    await expect(photo).toHaveCSS("opacity", "1");
    await expect(photo).toHaveCSS("filter", "none");
  }

  await page.setViewportSize({ width: 390, height: 844 });
  const [mobileFrame, mobileCopy] = await Promise.all([
    frame.boundingBox(),
    copy.boundingBox(),
  ]);
  expect(mobileFrame!.y).toBeGreaterThanOrEqual(
    mobileCopy!.y + mobileCopy!.height,
  );
  expect(mobileFrame!.width).toBeLessThan(390);
  expect(mobileFrame!.width).toBeGreaterThan(320);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("the homepage cycles through all eleven photo pairs and honors a motion pause", async ({
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
    const previous = await stage.getAttribute("data-scene");
    await page.clock.fastForward(12100);
    await expect(stage).not.toHaveAttribute("data-scene", previous!);
    const imageRatio = await stage
      .locator(".hero-images > img")
      .evaluate(async (node) => {
        const image = node as HTMLImageElement;
        await image.decode();
        return image.naturalWidth / image.naturalHeight;
      });
    const photo = await stage.boundingBox();
    expect(Math.abs(photo!.width / imageRatio - photo!.height)).toBeLessThan(1);
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
  const slider = hero.getByRole("slider");
  const reducedPosition = await slider.inputValue();
  await page.clock.fastForward(30000);
  await expect(slider).toHaveValue(reducedPosition);
  await hero.getByRole("button", { name: "Next image pair" }).click();
  await expect(stage).not.toHaveAttribute("data-scene", first!);
});

test("the slow divider pauses inside the photo while the image pairs keep changing", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/en");
  await page.getByRole("button", { name: /Reject optional/ }).click();
  const frame = page.locator(".photo-hero-stage");
  const slider = frame.getByRole("slider");
  const copy = page.locator(".photo-hero-copy");
  await copy.hover();
  const initial = Number(await slider.inputValue());
  await page.clock.runFor(2000);
  const distance = Math.abs(Number(await slider.inputValue()) - initial);
  expect(distance).toBeGreaterThan(0);
  expect(distance).toBeLessThanOrEqual(6);
  await frame.hover();
  const held = await slider.inputValue();
  const previous = await frame.getAttribute("data-scene");
  await page.clock.fastForward(13000);
  await expect(frame).not.toHaveAttribute("data-scene", previous!);
  await expect(slider).toHaveValue(held);
  await copy.hover();
  await page.clock.runFor(2000);
  const resumed = Math.abs(Number(await slider.inputValue()) - Number(held));
  expect(resumed).toBeGreaterThan(0);
  expect(resumed).toBeLessThanOrEqual(6);
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
  const frame = hero.locator(".photo-hero-stage");
  const first = await frame.getAttribute("data-scene");
  await hero.getByRole("button", { name: "Next image pair" }).click();
  await expect(frame).not.toHaveAttribute("data-scene", first!);
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
