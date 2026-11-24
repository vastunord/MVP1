import { expect, test } from "@playwright/test";

for (const example of [
  { route: "/en/contact", form: "Contact form", subject: "Subject", topics: ["Product support", "Sales", "Partnerships", "Feedback"], closed: "The contact form is closed in this demonstration. You can email us or browse the guides." },
  { route: "/contact", form: "Kontaktskjema", subject: "Emne", topics: ["Produkthjelp", "Salg", "Samarbeid", "Tilbakemelding"], closed: "Kontaktskjemaet er stengt i demonstrasjonen. Send oss gjerne en e-post, eller les guidene." },
]) {
  test(`contact fallback preserves the chosen topic on ${example.route}`, async ({ page }) => {
    const apiRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("/api/contact")) apiRequests.push(request.url());
    });
    await page.goto(example.route);
    const main = page.locator("main");
    await expect(main.getByText(example.closed, { exact: true })).toBeVisible();
    const form = main.getByRole("group", { name: example.form });
    await expect(form).toHaveAttribute("disabled", "");
    await expect(form.getByLabel(example.subject)).toBeDisabled();
    for (const topic of example.topics) {
      await main.getByRole("link", { name: new RegExp(`^${topic}`) }).click();
      await expect(form.getByLabel(example.subject)).toHaveValue(topic);
      const fallback = main.locator('#contact-form a[href^="mailto:contact@vastu.no"]');
      await expect(fallback).toHaveAttribute("href", `mailto:contact@vastu.no?subject=${encodeURIComponent(topic)}`);
    }
    expect(apiRequests).toEqual([]);
  });
}
