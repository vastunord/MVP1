import { expect, test } from "@playwright/test";

for (const route of ["/en/resources", "/en/resources/window-glow-over-still-water", "/app", "/app/renders", "/app/home-experience"]) {
  test(`decorative arrows do not enter accessible action names on ${route}`, async ({ page }) => {
    await page.goto(route);
    const actions = page.locator("a, button");
    const count = await actions.count();
    let reviewed = 0;
    for (let index = 0; index < count; index++) {
      const action = actions.nth(index);
      if (!(await action.isVisible()) || !/[↗→←]/.test(await action.innerText())) continue;
      reviewed++;
      await expect(action).not.toHaveAccessibleName(/[↗→←]/);
    }
    expect(reviewed).toBeGreaterThan(0);
  });
}
