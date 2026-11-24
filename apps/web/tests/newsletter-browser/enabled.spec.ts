import { expect, test } from "@playwright/test";

test("enabled invitation delays, validates and retries without losing the request", async ({ page }) => {
  await page.clock.install();
  let requests = 0;
  let release: (() => void) | undefined;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/api/newsletter", async (route) => {
    requests++;
    if (requests === 1) return route.fulfill({ status: 503, json: { status: "unavailable" } });
    await pending;
    return route.fulfill({ status: 202, json: { status: "check-email" } });
  });
  await page.goto("/en");
  await page.bringToFront();
  await page.getByRole("button", { name: "Reject optional" }).click();
  await page.clock.fastForward(26_000);
  const dialog = page.getByRole("dialog", { name: "Vastu Nord newsletter" });
  await expect(dialog).toHaveCount(0);
  await page.clock.fastForward(1_500);
  await expect(dialog).toBeVisible();
  const email = dialog.getByLabel("Email address");
  const consent = dialog.getByRole("checkbox");
  const submit = dialog.getByRole("button", { name: "Sign up" });
  await email.fill("bad-email");
  await submit.click();
  expect(requests).toBe(0);
  await email.fill("synthetic@example.invalid");
  await submit.click();
  expect(requests).toBe(0);
  await consent.check();
  await submit.click();
  await expect(dialog.getByRole("alert")).toContainText("could not complete");
  await expect(email).toHaveValue("synthetic@example.invalid");
  await expect(consent).toBeChecked();
  await dialog.getByRole("button", { name: "Try again" }).click();
  await submit.click();
  await expect(dialog.getByRole("button", { name: "Sending…" })).toBeDisabled();
  expect(requests).toBe(2);
  release?.();
  await expect(dialog.getByRole("status")).toContainText("confirmation email");
  expect(requests).toBe(2);
  await dialog.getByRole("button", { name: "Close", exact: true }).last().click();
  await expect(dialog).toHaveCount(0);
  const dock = page.getByRole("button", { name: "Newsletter", exact: true });
  await expect(dock).toBeVisible();
  await page.reload();
  await expect(dialog).toHaveCount(0);
  await expect(dock).toBeVisible();
  await dock.click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dock).toBeFocused();
});

for (const width of [390, 768, 1363]) {
  test(`newsletter, cookies and Prana remain separate at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
      localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
    });
    await page.goto("/en");
    const dock = page.getByRole("button", { name: "Newsletter", exact: true });
    await dock.click();
    await expect(page.getByRole("dialog", { name: "Vastu Nord newsletter" })).toBeVisible();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Open Prana assistant" }).click();
    await expect(page.getByRole("dialog", { name: "VastuNord Prana" })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Vastu Nord newsletter" })).toHaveCount(0);
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Change cookie preferences" }).click();
    await expect(page.getByRole("dialog", { name: "Cookie settings" })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "VastuNord Prana" })).toHaveCount(0);
  });
}

test("confirmed subscription suppresses the enabled offer", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "confirmed" }));
  });
  await page.goto("/en");
  await page.bringToFront();
  await page.clock.fastForward(60_000);
  await expect(page.getByRole("dialog", { name: "Vastu Nord newsletter" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Newsletter", exact: true })).toHaveCount(0);
});

test("Norwegian dark theme has a usable invitation and dismissal", async ({ page, context }) => {
  await context.addCookies([{ name: "vn-theme", value: "dark", url: "http://127.0.0.1:3111" }]);
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
    localStorage.setItem("vn-newsletter-display", JSON.stringify({ version: 1, state: "minimized" }));
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Nyhetsbrev", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Nyhetsbrev fra Vastu Nord" });
  await expect(dialog.getByRole("button", { name: "Meld meg på" })).toBeVisible();
  await dialog.getByRole("button", { name: "Ikke nå" }).click();
  await expect(page.getByRole("button", { name: "Nyhetsbrev", exact: true })).toBeFocused();
});

test("the offer waits while Prana is open and never interrupts Studio or sign-in", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    localStorage.setItem("vn-cookie-choices", JSON.stringify({ version: 1, decidedAt: new Date().toISOString(), statistics: false, marketing: false }));
  });
  await page.goto("/en");
  await page.bringToFront();
  await page.clock.fastForward(10_000);
  await page.getByRole("button", { name: "Open Prana assistant" }).click();
  await page.clock.fastForward(40_000);
  await expect(page.getByRole("dialog", { name: "Vastu Nord newsletter" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.clock.fastForward(18_000);
  await expect(page.getByRole("dialog", { name: "Vastu Nord newsletter" })).toBeVisible();
  await page.keyboard.press("Escape");
  for (const route of ["/en/signin", "/app/tools/room-reimagination"]) {
    await page.goto(route);
    await page.clock.fastForward(60_000);
    await expect(page.getByRole("dialog", { name: "Vastu Nord newsletter" })).toHaveCount(0);
  }
});
