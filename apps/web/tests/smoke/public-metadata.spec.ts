import { expect, test } from "@playwright/test";
import { marketingResources } from "../../src/lib/marketing-resources";

test("all public marketing routes identify their page and brand once in both locales", async ({page}) => {
  for (const [prefix, routes] of [
    ["", [["", "Vastu Nord"], ["features", "Muligheter"], ["gallery", "Galleri"], ["about", "Om oss"], ["pricing", "Priser"], ["resources", "Kunnskap"], ["contact", "Kontakt"], ["privacy", "Personvern og informasjonskapsler"], ["terms", "Bruksvilkår"]]],
    ["/en", [["", "Vastu Nord"], ["features", "Features"], ["gallery", "Gallery"], ["about", "About"], ["pricing", "Pricing"], ["resources", "Knowledge"], ["contact", "Contact"], ["privacy", "Privacy and cookies"], ["terms", "Terms of use"]]],
  ] as const) {
    for (const [path, label] of routes) {
      const response = await page.goto(`${prefix}/${path}`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(path ? `${label} · Vastu Nord` : "Vastu Nord");
    }
  }
});

test("public articles and newsletter actions have localized, nonduplicated titles", async ({page}) => {
  for (const locale of ["nb-NO", "en"] as const) {
    const prefix = locale === "en" ? "/en" : "";
    for (const article of marketingResources(locale).articles) {
      await page.goto(`${prefix}/resources/${article.id}`);
      await expect(page).toHaveTitle(`${article.name} · Vastu Nord`);
    }
    const studyTitle = locale === "en" ? "Place exercise equipment outside the walking line" : "Sett treningsutstyret utenfor ganglinjen";
    await page.goto(`${prefix}/resources/place-exercise-equipment-outside-the-walking-line`);
    await expect(page).toHaveTitle(`${studyTitle} · Vastu Nord`);
    for (const [action, expected] of locale === "en"
      ? [["confirm", "Confirm newsletter"], ["unsubscribe", "Unsubscribe from newsletter"]]
      : [["confirm", "Bekreft nyhetsbrev"], ["unsubscribe", "Meld deg av nyhetsbrevet"]]) {
      await page.goto(`${prefix}/newsletter/${action}`);
      await expect(page).toHaveTitle(`${expected} · Vastu Nord`);
    }
  }
});
