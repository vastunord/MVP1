import { expect, test } from "@playwright/test";

// Synthetic local component timing, not a live database, Blob, or field metric.
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
for (const width of [390, 1440]) {
  for (let run = 1; run <= 3; run++) {
    test(`gallery synthetic readiness ${width}px run ${run}`, async ({page}) => {
      await page.setViewportSize({width, height:844});
      await page.route("**/api/projects", route => route.fulfill({json:[{id:"project", name:"Synthetic project"}]}));
      await page.route("**/api/studio/renders?**", route => route.fulfill({json:[{id:"job", state:"SUCCEEDED", sourceAssetId:"source", outputAssetId:"output", toolId:"room-reimagination", media:"image"}]}));
      await page.route("**/api/assets/*/download", route => route.fulfill({contentType:"image/png", body:png}));
      const response = await page.goto("/");
      expect(response?.status()).toBe(200);
      const open = page.getByRole("button", {name:/View result/});
      await expect(open).toBeVisible();
      const ready = await page.evaluate(() => Math.round(performance.now()));
      const start = Date.now();
      await open.click();
      await expect(page.getByRole("slider")).toBeVisible();
      await expect(page.getByRole("link", {name:"Download result"})).toBeVisible();
      const comparison = Date.now() - start;
      console.log(JSON.stringify({fixture:"mocked-gallery-dev", width, run, galleryReadyMs:ready, comparisonAfterClickMs:comparison}));
    });
  }
}
