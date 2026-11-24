import { expect, test } from "@playwright/test";

test("pending private upload continues through Prana and cookie interactions without an automatic offer", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
  });
  let uploadRequests = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/projects**", async (route) => {
    const request = route.request();
    if (request.url().includes("/assets") && request.method() === "POST") {
      uploadRequests++;
      await gate;
      return route.fulfill({ status: 201, json: { assetId: "synthetic-asset" } });
    }
    if (request.url().includes("/assets")) return route.fulfill({ json: [] });
    return route.fulfill({ json: [{ id: "synthetic-project", name: "Synthetic project" }] });
  });
  await page.route("https://**/*", (route) => route.abort());
  await page.goto("/app/tools/demo");
  const input = page.getByLabel("Choose or drop an image");
  await expect(input).toBeEnabled();
  await input.setInputFiles({ name: "synthetic.png", mimeType: "image/png", buffer: Buffer.from("synthetic-only") });
  await page.getByRole("button", { name: "Upload image" }).click();
  await expect(page.getByRole("button", { name: "Uploading…" })).toBeDisabled();
  expect(uploadRequests).toBe(1);
  await page.getByRole("button", { name: "Open Prana assistant" }).click();
  await expect(page.getByRole("dialog", { name: "VastuNord Prana" })).toBeVisible();
  await page.clock.fastForward(60_000);
  await expect(page.getByRole("dialog", { name: "Vastu Nord newsletter" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Uploading…" })).toBeDisabled();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Change cookie preferences" }).click();
  const settings = page.getByRole("dialog", { name: "Cookie settings" });
  await expect(settings).toBeVisible();
  release();
  await expect(page.getByRole("status").filter({ hasText: "Saved privately." })).toBeAttached();
  await settings.getByRole("button", { name: "Save choices" }).click();
  await expect(page.getByText("Saved privately.")).toBeVisible();
  await expect(page.getByTestId("preview")).toContainText("/api/assets/synthetic-asset/download");
  expect(uploadRequests).toBe(1);
});
