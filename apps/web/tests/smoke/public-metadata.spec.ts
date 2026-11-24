import { expect, test } from "@playwright/test";
import { marketingResources } from "../../src/lib/marketing-resources";

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
