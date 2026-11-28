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
  await design.getByText("Flere valg", { exact: true }).click();
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

test("outdoor surroundings and designer style stay selectable as qualitative instructions", async ({ page }) => {
  await page.goto("/app/tools/outdoor-visualization");
  await expect(page.getByRole("radio", { name: /Naturnær/ })).toBeChecked();
  const context = page.getByRole("group", { name: "Omgivelser", exact: true });
  await expect(context.getByRole("radio")).toHaveCount(4);
  await context.getByRole("radio").last().check();
  await expect(context.getByRole("radio").last()).toBeChecked();
  await expect(page.getByRole("group", { name: "Kjøretøy", exact: true }).getByRole("radio")).toHaveCount(4);
  await expect(page.locator(".primary-action button")).toBeDisabled();
});

test("hardscape planning supports keyboard marks, selection, removal and clearing on a sample", async ({ page }) => {
  await page.goto("/app/tools/hardscape-design");
  await expect(page.getByRole("button", { name: "Marker overflater" })).toBeDisabled();
  await page.goto("/app/tools/hardscape-design?sample=gallery-01");
  await page.getByRole("button", { name: "Marker overflater" }).click();
  const photo = page.getByRole("button", { name: "Legg til overflate på bildet" });
  await photo.press("Enter");
  await page.getByRole("radio", { name: "Fiskebein" }).check();
  await photo.click({ position: { x: 26, y: 35 } });
  await page.getByRole("radio", { name: "Gangvei" }).check();
  await page.getByRole("button", { name: "Velg overflate 1" }).click();
  await expect(page.getByRole("radio", { name: "Fiskebein" })).toBeChecked();
  await page.getByRole("button", { name: "Fjern overflate" }).click();
  await expect(page.getByRole("radio", { name: "Gangvei" })).toBeChecked();
  await page.getByRole("button", { name: "Tøm", exact: true }).click();
  await expect(page.getByRole("button", { name: "Velg overflate 1" })).toHaveCount(0);
  await page.getByRole("button", { name: "Ferdig", exact: true }).click();
  await expect(photo).toHaveCount(0);
});

test("season cards update the palette and multiple cleanup choices remain independent", async ({ page }) => {
  await page.goto("/app/tools/seasonal-styling");
  await page.getByRole("radio", { name: /Vinter/ }).check();
  await expect(page.getByRole("radio", { name: "Sesongens egen" })).toBeChecked();
  await page.goto("/app/tools/visual-cleanup");
  const clutter = page.getByRole("group", { name: "Vanlige forstyrrelser" });
  await expect(clutter.getByRole("checkbox")).toHaveCount(8);
  await clutter.getByRole("checkbox", { name: "Søppeldunker" }).check();
  await clutter.getByRole("checkbox", { name: "Kabler" }).check();
  await clutter.getByRole("checkbox", { name: "Søppeldunker" }).uncheck();
  await expect(clutter.getByRole("checkbox", { name: "Kabler" })).toBeChecked();
  await expect(page.getByRole("button", { name: "Forbedre med Prana" })).toHaveCount(0);
});

test("mask-based deletion is gated and manual enhancement exports a pixel-adjusted copy", async ({ page }) => {
  await page.goto("/app/tools/visual-cleanup");
  await expect(page.getByRole("radio", { name: "Brush & delete (utilgjengelig)" })).toBeDisabled();
  await expect(page.getByRole("radio", { name: "AI object editing" })).toBeEnabled();
  await page.goto("/app/tools/resolution-enhancement");
  await page.getByRole("radio", { name: "Manuelle justeringer" }).check();
  const canvas = page.getByLabel("Justert fotografi");
  await expect(canvas).toBeVisible();
  const pixels = () => canvas.evaluate(node => (node as HTMLCanvasElement).toDataURL());
  await expect.poll(() => canvas.evaluate(node => (node as HTMLCanvasElement).width)).toBeGreaterThan(300);
  const original = await pixels();
  await page.locator("#option-adjust-2").focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(pixels).not.toBe(original);
  await page.getByRole("button", { name: "Tilbakestill justeringer" }).click();
  await expect.poll(pixels).toBe(original);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Bruk justeringer og last ned" }).click();
  expect((await downloaded).suggestedFilename()).toBe("vastunord-adjustments.png");
  await expect(page.locator(".primary-action button")).toHaveCount(0);
});
