import { expect, test } from "@playwright/test";

for (const example of [
  { locale: "en", route: "/en/login", guidance: "If you verified your email, you can now try signing in.", incomplete: "Sign-in was not completed. Try again or sign in with your email." },
  { locale: "nb", route: "/login", guidance: "Hvis du har bekreftet e-posten, kan du nå prøve å logge inn.", incomplete: "Innloggingen ble ikke fullført. Prøv igjen eller logg inn med e-post." },
]) {
  test(`${example.locale} verification and cancelled OAuth returns are honest and localized`, async ({ page }) => {
    await page.goto(`${example.route}?verified=1`);
    await expect(page.getByRole("status").filter({ hasText: example.guidance })).toBeVisible();
    await page.goto(`${example.route}?oauth=incomplete&error=access_denied`);
    await expect(page.locator(".auth-panel").getByRole("alert")).toHaveText(example.incomplete);
  });
}

test("room-upload intent survives localized login and recovery navigation", async ({ page }) => {
  await page.goto("/en/login?intent=room-upload&returnTo=https%3A%2F%2Funtrusted.example.invalid");
  const create = page.getByRole("link", { name: "Create account" });
  await expect(create).toHaveAttribute("href", "/en/signup?intent=room-upload");
  const recover = page.getByRole("link", { name: "Forgot password?" });
  await expect(recover).toHaveAttribute("href", "/en/forgot-password?intent=room-upload");
  await create.click();
  await expect(page).toHaveURL(/\/en\/signup\?intent=room-upload$/);
  await page.getByRole("link", { name: "Already have an account?" }).click();
  await expect(page).toHaveURL(/\/en\/login\?intent=room-upload$/);
});
