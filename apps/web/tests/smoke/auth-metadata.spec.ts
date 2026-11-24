import { expect, test } from "@playwright/test";

test("account recovery routes identify the page and brand once in each locale", async ({ page }) => {
  for (const [path, title] of [
    ["/reset-password", "Tilbakestill passord · Vastu Nord"],
    ["/verify-email", "Bekreft e-post · Vastu Nord"],
    ["/en/reset-password", "Reset password · Vastu Nord"],
    ["/en/verify-email", "Verify email · Vastu Nord"],
  ]) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
  }
});
