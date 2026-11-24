import { expect, test } from "@playwright/test";

// Synthetic browser responses exercise gallery UI only, not API authorization.
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=", "base64");
for (const missing of ["source", "output"] as const) {
  test(`gallery explains a missing ${missing} separately`, async ({ page }) => {
    await page.route("**/api/projects", route => route.fulfill({ json: [{ id: "project", name: "Synthetic project" }] }));
    await page.route("**/api/studio/renders?**", route => route.fulfill({ json: [{ id: "job", state: "SUCCEEDED", sourceAssetId: "source", outputAssetId: "output", toolId: "room-reimagination", media: "image" }] }));
    await page.route("**/api/assets/*/download", route => {
      const absent = new URL(route.request().url()).pathname.includes(`/${missing}/`);
      return absent ? route.fulfill({ status: 404, body: "" }) : route.fulfill({ status: 200, contentType: "image/png", body: png });
    });
    await page.goto("/");
    await page.getByRole("button", { name: /View result/ }).click();
    if (missing === "source") {
      await expect(page.locator(".vn-private-renders").getByRole("alert")).toContainText("original image is unavailable");
      await expect(page.getByRole("slider")).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Download result" })).toBeVisible();
    } else {
      await expect(page.locator(".vn-private-renders").getByRole("alert")).toContainText("saved result could not be loaded");
      await expect(page.getByRole("slider")).toHaveCount(0);
      await expect(page.getByRole("link", { name: "Download result" })).toHaveCount(0);
    }
  });
}

test("a result without a recorded original explains why comparison is absent", async ({ page }) => {
  await page.route("**/api/projects", route => route.fulfill({ json: [{ id: "project", name: "Synthetic project" }] }));
  await page.route("**/api/studio/renders?**", route => route.fulfill({ json: [{ id: "job", state: "SUCCEEDED", sourceAssetId: null, outputAssetId: "output", toolId: "room-reimagination", media: "image" }] }));
  await page.route("**/api/assets/*/download", route => route.fulfill({ contentType: "image/png", body: png }));
  await page.goto("/");
  await page.getByRole("button", { name: /View result/ }).click();
  await expect(page.getByRole("status")).toContainText("No original image is recorded");
  await expect(page.getByRole("slider")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Download result" })).toBeVisible();
});

test("a failed status check retries the same job without another submission", async ({ page }) => {
  let submissions = 0, checks = 0;
  await page.route("**/api/studio/renders", async route => {
    const input = route.request().postDataJSON();
    if (input.action === "status") {
      checks++;
      expect(input.id).toBe("synthetic-job");
      return checks === 1 ? route.fulfill({ status: 502, json: { error: "unavailable" } }) : route.fulfill({ json: { id: "synthetic-job", state: "RUNNING", media: "image", waitingForSubmission: false } });
    }
    submissions++;
    return route.fulfill({ json: { id: "synthetic-job", state: "RUNNING", media: "image", waitingForSubmission: false } });
  });
  await page.clock.install();
  await page.goto("/poll");
  await page.getByRole("checkbox").check();
  await page.locator(".primary-action > button").first().click();
  await page.clock.fastForward(3000);
  await expect(page.getByText(/Could not check or save this result/)).toBeVisible();
  await page.getByRole("button", { name: "Check again" }).click();
  await page.clock.fastForward(3000);
  await expect.poll(() => checks).toBe(2);
  expect(submissions).toBe(1);
});
