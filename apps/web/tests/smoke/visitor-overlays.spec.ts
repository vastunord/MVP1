import { expect, test } from "@playwright/test";

test("the film panel keeps playback optional and stops it when the tab closes", async ({ page }) => {
  await page.route("**/api/prana/film", route => route.fulfill({ json: { videoId: "testFilm001" } }));
  const players: string[] = [];
  await page.route("https://www.youtube-nocookie.com/embed/**", route => {
    players.push(route.request().url());
    return route.fulfill({ contentType: "text/html", body: "<title>Test player</title>" });
  });
  await page.goto("/en?assistant=prana");
  const panel = page.getByRole("dialog", { name: "VastuNord Prana" });
  await panel.getByRole("tab", { name: "Film", exact: true }).click();
  await expect(panel.getByRole("link", { name: /@VastuNord/ })).toHaveAttribute("href", "https://www.youtube.com/@VastuNord");
  const play = panel.getByRole("button", { name: "Play here" });
  await expect(play).toBeVisible();
  await expect(panel.locator("iframe")).toHaveCount(0);
  expect(players).toHaveLength(0);
  await play.click();
  await expect(panel.locator("iframe")).toHaveAttribute("src", /autoplay=1&mute=0&playsinline=1$/);
  await expect.poll(() => players.length).toBe(1);
  await panel.getByRole("tab", { name: "Quick Tips" }).click();
  await expect(panel.locator("iframe")).toHaveCount(0);
});

test("consent defaults, changes, revocation and version renewal are independent of email", async ({
  page,
}) => {
  await page.goto("/en");
  const notice = page.getByRole("complementary", {
    name: "Your cookie choices",
  });
  await expect(notice).toBeVisible();
  await expect(notice).toHaveCSS("position", "fixed");
  const cookie = page.getByRole("button", {
    name: "Change cookie preferences",
  });
  await expect(cookie).toHaveCount(0);
  await notice.getByRole("button", { name: "Customize" }).click();
  const settings = page.getByRole("dialog", { name: "Cookie settings" });
  const stats = settings.getByRole("checkbox", { name: /Statistics/ });
  const marketing = settings.getByRole("checkbox", { name: /Marketing/ });
  await expect(stats).not.toBeChecked();
  await expect(marketing).not.toBeChecked();
  await stats.check();
  await settings.getByRole("button", { name: "Save choices" }).click();
  await expect(cookie).toBeFocused();
  await page.reload();
  await expect(notice).toHaveCount(0);
  await cookie.click();
  await expect(stats).toBeChecked();
  await expect(marketing).not.toBeChecked();
  await stats.uncheck();
  await settings.getByRole("button", { name: "Save choices" }).click();
  await expect(cookie).toBeFocused();
  const choices = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("vn-cookie-choices")!),
  );
  expect(choices).toMatchObject({
    version: 1,
    statistics: false,
    marketing: false,
  });
  expect(Number.isFinite(Date.parse(choices.decidedAt))).toBeTruthy();
  expect(
    await page.evaluate(() => localStorage.getItem("vn-newsletter-display")),
  ).toBeNull();
  await page.evaluate(() =>
    localStorage.setItem(
      "vn-cookie-choices",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("vn-cookie-choices")!),
        version: 0,
      }),
    ),
  );
  await page.reload();
  await notice.getByRole("button", { name: "Accept all" }).click();
  await page.getByRole("button", { name: "Cookie settings" }).click();
  await expect(stats).toBeChecked();
  await expect(marketing).toBeChecked();
  await page.keyboard.press("Escape");
  await page.goto("/en/privacy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Privacy and cookies",
  );
  await page.getByRole("button", { name: "NO – Norsk bokmål" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Personvern og informasjonskapsler",
  );
});

test("only eligible time opens the newsletter and dismissal survives scrolling, navigation and reload", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.clock.install();
  await page.goto("/en");
  await page.bringToFront();
  const prana = page.getByRole("button", { name: "Open Prana assistant" });
  const invite = page.getByRole("dialog", { name: "Vastu Nord newsletter" });
  await page.clock.fastForward(32_000);
  await expect(invite).toHaveCount(0);
  await prana.click();
  const panel = page.getByRole("dialog", { name: "VastuNord Prana" });
  await expect(panel.getByRole("tab")).toHaveText([
    "Prana",
    "Quick Tips",
    "Film",
  ]);
  await panel.getByRole("tab", { name: "Prana", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(panel.getByRole("tabpanel")).toContainText("layered lighting");
  await page.keyboard.press("End");
  await expect(panel.getByRole("link", { name: /@VastuNord/ })).toHaveAttribute("href", "https://www.youtube.com/@VastuNord");
  await panel.getByRole("button", { name: "Close" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    panel.getByRole("link", { name: /Open Home Experience/ }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(panel.getByRole("button", { name: "Close" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(prana).toBeFocused();
  await page.getByRole("button", { name: "Reject optional" }).click();
  await page.clock.fastForward(10_000);
  await prana.click();
  await page.clock.fastForward(35_000);
  await expect(invite).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.clock.fastForward(15_000);
  await expect(invite).toHaveCount(0);
  await page.clock.fastForward(4_000);
  await expect(invite).toBeVisible();
  await expect(
    invite.getByRole("heading", { name: "Room for new ideas." }),
  ).toBeVisible();
  await expect(invite.locator(".vn-ticket-stub")).toBeVisible();
  await expect(invite.getByRole("checkbox")).not.toBeChecked();
  await expect(invite.getByRole("textbox")).toBeDisabled();
  await invite.getByRole("button", { name: "Not now" }).click();
  const dock = page.getByRole("button", { name: "Newsletter", exact: true });
  await expect(dock).toBeFocused();
  const before = await dock.boundingBox();
  await page.evaluate(() =>
    window.scrollTo({ top: 1500, behavior: "instant" }),
  );
  expect(await dock.boundingBox()).toEqual(before);
  expect(before!.x + before!.width).toBeLessThan(
    (await prana.boundingBox())!.x,
  );
  const cookie = await page
    .getByRole("button", { name: "Change cookie preferences" })
    .boundingBox();
  expect(cookie!.x + cookie!.width).toBeLessThan(before!.x);
  await page.goto("/en/about");
  await expect(dock).toBeVisible();
  await page.reload();
  await page.clock.fastForward(60_000);
  await expect(invite).toHaveCount(0);
  await dock.click();
  await expect(invite).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dock).toBeFocused();
  await page.getByRole("button", { name: "NO – Norsk bokmål" }).click();
  await expect(
    page.getByRole("button", { name: "Nyhetsbrev", exact: true }),
  ).toBeVisible();
});

test("header and legacy assistant links open the single floating Prana panel", async ({
  page,
}) => {
  await page.goto("/en?assistant=prana&preserve=yes");
  const panel = page.getByRole("dialog", { name: "VastuNord Prana" });
  await expect(panel).toBeVisible();
  await expect(page).toHaveURL(/\/en\?preserve=yes$/);
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(panel).toHaveCount(0);
  const headerTrigger = page.getByRole("button", {
    name: "VastuNord Prana",
    exact: true,
  });
  await headerTrigger.click();
  await expect(panel).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(headerTrigger).toBeFocused();
});

test("existing dialogs, signup, privacy reading and Studio editing never get an automatic offer", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/en");
  await page.getByRole("button", { name: "Reject optional" }).click();
  await page.getByRole("button", { name: "About this preview" }).click();
  await page.clock.fastForward(45_000);
  await expect(page.locator("dialog[open]")).toHaveCount(1);
  await expect(
    page.getByRole("dialog", { name: "Vastu Nord newsletter" }),
  ).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.goto("/en/resources");
  await page.getByRole("searchbox").fill("light");
  await page.clock.fastForward(45_000);
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  for (const path of [
    "/en/privacy",
    "/en/signup",
    "/app/tools/room-reimagination",
  ]) {
    await page.goto(path);
    await page.clock.fastForward(45_000);
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(
      page.getByRole("button", {
        name: /Open Prana assistant|Åpne Prana-assistenten/,
      }),
    ).toBeVisible();
  }
});

test("confirmed status suppresses future invitations on this browser", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/en");
  await page.getByRole("button", { name: "Reject optional" }).click();
  // Isolated browser fixture for a successful server reply. Public demo delivery stays closed.
  await page.route("**/api/newsletter/confirm", (route) =>
    route.fulfill({ json: { status: "confirmed" } }),
  );
  await page.goto("/en/newsletter/confirm#synthetic-browser-fixture");
  await page.getByRole("button", { name: "Confirm my subscription" }).click();
  await expect(page.getByRole("status")).toContainText(
    "subscription is confirmed",
  );
  await page.goto("/en/resources");
  await page.clock.fastForward(60_000);
  await expect(
    page.getByRole("dialog", { name: "Vastu Nord newsletter" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Newsletter", exact: true }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("vn-newsletter-display")!).state,
    ),
  ).toBe("confirmed");
});
