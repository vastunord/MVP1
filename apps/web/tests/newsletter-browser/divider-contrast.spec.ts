import { expect, test, type Locator } from "@playwright/test";
import sharp from "sharp";

async function expectDividerEdges(stage: Locator, divider: Locator) {
  const stageBox = await stage.boundingBox();
  const dividerBox = await divider.boundingBox();
  expect(stageBox).not.toBeNull();
  expect(dividerBox).not.toBeNull();
  const image = await stage.screenshot();
  const { data, info } = await sharp(image).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const x = Math.round((dividerBox!.x - stageBox!.x) * info.width / stageBox!.width);
  const y = Math.round(info.height * 0.25); // Away from the central handle.
  const luminances: number[] = [];
  for (let column = Math.max(0, x - 3); column < Math.min(info.width, x + 6); column++) {
    const index = (y * info.width + column) * info.channels;
    const [r, g, b] = [data[index], data[index + 1], data[index + 2]].map((value) => {
      const c = value / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    luminances.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
  }
  const ratio = (Math.max(...luminances) + 0.05) / (Math.min(...luminances) + 0.05);
  expect(ratio).toBeGreaterThanOrEqual(3);
}

for (const background of ["white", "black"]) {
  test(`comparison dividers remain visible on a ${background} image`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await page.addStyleTag({ content: `.hero-images { background: ${background} !important } .hero-images img, .hero-after { visibility: hidden !important }` });
    await expectDividerEdges(page.locator(".photo-hero-stage"), page.locator(".photo-hero-line"));

    await page.goto("/app/tools/room-reimagination");
    await page.getByRole("button", { name: /^(Sammenlign eksempel|Compare example)$/ }).click();
    await page.addStyleTag({ content: `.sample-stage { background: ${background} !important } .sample-stage img, .sample-before { visibility: hidden !important }` });
    await expectDividerEdges(page.locator(".sample-stage"), page.locator(".sample-divider"));
  });
}
