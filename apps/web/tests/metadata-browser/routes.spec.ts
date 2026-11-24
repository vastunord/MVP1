import { expect, test } from "@playwright/test";

for (const route of ["/", "/en", "/contact", "/en/contact", "/resources", "/en/resources", "/resources/virtual-staging-vs-traditional-staging", "/en/resources/virtual-staging-vs-traditional-staging", "/login", "/en/login", "/privacy", "/en/privacy", "/app/library"]) {
  test(`${route} has a single branded title and decorative action icons`, async ({ page }) => {
    await page.goto(route);
    const title = await page.title();
    expect(title).not.toEqual("");
    expect(title.match(/Vastu Nord/gi)).toHaveLength(1);
    if (route !== "/" && route !== "/en") expect(title).not.toBe("Vastu Nord");
    const icons = page.locator("a.mk-action svg");
    for (let i = 0; i < await icons.count(); i++) {
      await expect(icons.nth(i)).toHaveAttribute("aria-hidden", "true");
      const action = icons.nth(i).locator("xpath=..");
      await expect(action).toHaveAccessibleName(/\S/);
      expect(await action.getAttribute("aria-label")).not.toBe("");
    }
  });
}

for (const example of [
  { route: "/pricing", copy: "Betalte abonnement er ikke tilgjengelige i demonstrasjonen. Fremtidige planer og vilkår er ikke avklart." },
  { route: "/en/pricing", copy: "Paid subscriptions are unavailable in this demonstration. Future plans and terms have not been confirmed." },
]) {
  test(`${example.route} describes deferred subscriptions without promising a launch`, async ({ page }) => {
    await page.goto(example.route);
    await expect(page.getByText(example.copy, { exact: true })).toBeVisible();
  });
}
