import { expect, test } from "@playwright/test";
import sharp from "sharp";

// Sample the actual rendered image/gradient behind the hidden heading. The
// lightest pixel is a conservative bound for white text at any position.
for (const width of [390, 768, 1440]) {
  test(`closing heading remains legible over its rendered photograph at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
    });
    await page.goto("/en");
    const heading = page.locator(".mk-closing h2");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toHaveCSS("color", "rgb(255, 255, 255)");
    const bounds = await heading.boundingBox();
    expect(bounds).not.toBeNull();
    await heading.evaluate((node) => { (node as HTMLElement).style.visibility = "hidden"; });
    const image = await page.screenshot({ clip: bounds! });
    const { data, info } = await sharp(image).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let lightest = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      const linear = [data[i], data[i + 1], data[i + 2]].map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
      lightest = Math.max(lightest, 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]);
    }
    expect(1.05 / (lightest + 0.05)).toBeGreaterThanOrEqual(4.5);
  });
}
