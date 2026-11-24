import { expect, test } from "@playwright/test";

for (const choice of ["Reject optional", "Accept all"]) {
  test(`${choice} does not initiate optional third-party tracking on sampled routes`, async ({ page }) => {
    const external: { host: string; type: string; path: string }[] = [];
    const localPaths: string[] = [];
    await page.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (url.hostname !== "127.0.0.1") {
        external.push({ host: url.hostname, type: request.resourceType(), path: url.pathname });
        return route.abort(); // No external request is sent, including fonts.
      }
      localPaths.push(url.pathname);
      return route.continue();
    });
    await page.goto("/en");
    await page.getByRole("button", { name: choice }).click();
    const settings = await page.evaluate(() => JSON.parse(localStorage.getItem("vn-cookie-choices")!));
    expect(settings.statistics).toBe(choice === "Accept all");
    expect(settings.marketing).toBe(choice === "Accept all");
    for (const route of ["/en/resources", "/app/tools/room-reimagination", "/app/renders"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
    }
    // The font host is an explicitly disclosed necessary resource. Any other
    // third-party host or script is a failure, even though it was blocked above.
    expect(external.filter((item) => item.host !== "fonts.gstatic.com")).toEqual([]);
    expect(external.filter((item) => item.type === "script")).toEqual([]);
    // Also catch common same-origin collection routes; this is a named pattern
    // check, not proof that an unknown first-party endpoint cannot collect data.
    expect(localPaths.filter((path) => /\/(analytics|track|tracking|pixel|collect|beacon)(\/|$)/i.test(path))).toEqual([]);
  });
}
