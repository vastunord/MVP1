import { test, expect } from "@playwright/test";

test("studio opens on a single image with optional comparison and tool selection", async ({
  page,
}) => {
  await page.goto("/app/tools/room-reimagination");
  const comparison = page.getByRole("slider", {
    name: "Sammenlign før og etter",
  });
  await expect(comparison).toHaveCount(0);
  await expect(page.locator(".studio-variants")).toHaveCount(0);
  await expect(page.locator("figcaption")).toContainText("Studioreferanse");
  await page.getByRole("button", { name: "Sammenlign eksempel" }).click();
  await expect(comparison).toHaveValue("50");
  await comparison.focus();
  await comparison.press("ArrowRight");
  await expect(comparison).toHaveValue("51");
  await page.getByRole("button", { name: "Enkeltbilde" }).click();
  await expect(comparison).toHaveCount(0);
  await page.locator(".studio-tool-switcher summary").click();
  await expect(page.locator(".studio-tool-switcher nav a")).toHaveCount(17);
  await page.locator(".studio-tool-switcher summary").click();
  const model = page.getByLabel("Leverandørmodell");
  await model.selectOption("fast");
  await expect(model).toHaveValue("fast");
  await page
    .getByRole("group", { name: "Interiørstil", exact: true })
    .getByRole("radio", { name: "Japandi" })
    .check();
  await expect(page.getByRole("radio", { name: "Japandi" })).toBeChecked();
  await page.getByText("Skrivetips", { exact: true }).click();
  await expect(
    page.getByText("Angi hvilken del", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".primary-action button")).toBeDisabled();
});

test("room choice images, output media, keyboard input and collapsed groups work on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/app/tools/room-reimagination");
  const design = page.getByRole("region", {
    name: "Innstillinger for romdesign",
  });
  const room = design.getByRole("group", { name: "Romtype", exact: true });
  const bed = room.getByRole("radio", { name: "Soverom" });
  await bed.focus();
  await page.keyboard.press("Space");
  await expect(bed).toBeChecked();
  const photo = room
    .locator("label")
    .filter({ has: page.getByRole("radio", { name: "Soverom" }) })
    .locator("img");
  await photo.scrollIntoViewIfNeeded();
  expect(
    await photo.evaluate(async (image) => {
      const element = image as HTMLImageElement;
      await element.decode();
      return element.naturalWidth;
    }),
  ).toBe(320);
  await design.getByText("Kamera og lys", { exact: true }).click();
  await design.getByRole("radio", { name: "Nytt utsnitt" }).check();
  await expect(design.getByRole("group", { name: "Synsvinkel" })).toBeVisible();
  await design.getByRole("radio", { name: "Høyt ståsted" }).check();
  await design.getByRole("radio", { name: "Blåtime" }).check();
  await design.getByText("Bildeinnstillinger", { exact: true }).click();
  const media = design.getByRole("group", { name: "Bildestil" });
  await expect(media.getByRole("radio")).toHaveCount(9);
  await media.getByRole("radio", { name: "Akvarell" }).check();
  await design.getByRole("radio", { name: "16:9" }).check();
  await expect(page.locator(".studio-editor select")).toHaveCount(1);
  await expect(design).not.toContainText("Startverdi");
  await expect(design).not.toContainText("Skogens ro");
  await page.getByText("Referansebilder", { exact: true }).click();
  await expect(
    page.getByRole("group", { name: "Første referanse" }).getByRole("radio"),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Forbedre med Prana" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("library search and recovery from an empty result", async ({ page }) => {
  await page.goto("/app/library");
  const search = page.getByRole("searchbox", { name: "Søk", exact: true });
  await search.fill("kameravinkel");
  await expect(page.locator(".tool-card")).toHaveCount(1);
  await expect(page.locator(".tool-card")).toContainText(
    "Perspective Correction",
  );
  await search.fill("xyz-no-tool");
  await expect(page.locator(".tool-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Tilbakestill", exact: true }).click();
  await expect(page.locator(".tool-card")).toHaveCount(17);
  const photos = page.locator(".tool-card img");
  const sources = new Set<string>();
  for (const photo of await photos.all()) {
    await photo.scrollIntoViewIfNeeded();
    const source = await photo.evaluate(async (el) => {
      const image = el as HTMLImageElement;
      await image.decode();
      if (!image.naturalWidth || !image.getBoundingClientRect().height)
        throw new Error("Tool photo is blank");
      return image.src;
    });
    sources.add(source);
  }
  expect(sources.size).toBe(17);
});

test("unspecified outdoor controls share one disclosure", async ({ page }) => {
  await page.goto("/app/tools/outdoor-visualization");
  const unavailable = page
    .locator("details.avoid-detail")
    .filter({ hasText: "Utilgjengelige innstillinger" });
  await expect(unavailable).toHaveCount(1);
  await unavailable.locator("summary").click();
  await expect(unavailable.getByRole("listitem")).toHaveCount(5);
  await expect(unavailable).toContainText("Omgivelser");
  await expect(page.locator(".primary-action button")).toBeDisabled();
});

test("unsupported manual modes are explained and cannot be selected", async ({ page }) => {
  await page.goto("/app/tools/visual-cleanup");
  await expect(page.getByRole("radio", { name: "Brush & delete (utilgjengelig)" })).toBeDisabled();
  await expect(page.getByRole("radio", { name: "AI object editing" })).toBeEnabled();
  await page.goto("/app/tools/resolution-enhancement");
  await expect(page.getByRole("radio", { name: "Manual controls (utilgjengelig)" })).toBeDisabled();
  await expect(page.getByRole("radio", { name: "Auto enhance" })).toBeEnabled();
});
