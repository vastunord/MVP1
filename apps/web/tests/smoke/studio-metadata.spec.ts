import { expect, test } from "@playwright/test";
import { tools } from "../../../../packages/contracts/src/tools";

test("Studio routes expose their own title without project identifiers in both locales", async ({ page, baseURL }) => {
  test.setTimeout(90000);
  for (const locale of ["en", "nb-NO"]) {
    await page.context().addCookies([{name:"vn-locale", value:locale, url:baseURL!}]);
    for (const tool of tools) {
      await page.goto(`/app/tools/${tool.id}`);
      await expect(page).toHaveTitle(`${tool.name} · Studio · Vastu Nord`);
    }
  }
  await page.context().addCookies([{name:"vn-locale", value:"en", url:baseURL!}]);
  await page.goto("/app/projects/synthetic-private-id");
  await expect(page).toHaveTitle("Project · Studio · Vastu Nord");
  await page.context().addCookies([{name:"vn-locale", value:"nb-NO", url:baseURL!}]);
  await page.goto("/app/renders");
  await expect(page).toHaveTitle("Bildegalleri · Studio · Vastu Nord");
});
