import { expect, test } from "@playwright/test";

const topics = {
  en: ["Renovation", "Staging", "Interiors", "Workflow", "Design", "Materials", "Lighting", "Planning"],
  no: ["Oppussing", "Boligstyling", "Interiør", "Arbeidsflyt", "Design", "Materialer", "Belysning", "Planlegging"],
};

for (const locale of ["en", "no"] as const) {
  test(`public and Studio knowledge share every ${locale} topic`, async ({ page, baseURL }) => {
    await page.context().addCookies([{ name:"vn-locale", value:locale === "en" ? "en" : "nb-NO", url:baseURL! }]);
    for (const path of [locale === "en" ? "/en/resources" : "/resources", "/app/knowledge"]) {
      await page.goto(path);
      const group = page.getByRole("group", { name:path === "/app/knowledge" ? (locale === "en" ? "Topic" : "Tema") : (locale === "en" ? "Filter by topic" : "Filtrer på tema") });
      for (const [index, label] of topics[locale].entries()) {
        const choice = group.getByRole("button", { name:label, exact:true });
        await choice.click();
        await expect(choice).toHaveAttribute("aria-pressed", "true");
        await expect(page).toHaveURL(new RegExp(`[?&]topic=${index}(?:&|$)`));
      }
      await page.reload();
      await expect(group.getByRole("button", { name:topics[locale][7], exact:true })).toHaveAttribute("aria-pressed", "true");
    }
  });
}
