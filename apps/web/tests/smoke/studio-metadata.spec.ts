import { expect, test } from "@playwright/test";
import { tools } from "../../../../packages/contracts/src/tools";

test("Studio routes expose their own title without project identifiers", async ({ page }) => {
  await page.context().addCookies([{name:"vn-locale", value:"en", url:"http://127.0.0.1:3100"}]);
  for (const tool of tools) {
    await page.goto(`/app/tools/${tool.id}`);
    await expect(page).toHaveTitle(`${tool.name} · Studio · Vastu Nord`);
  }
  await page.goto("/app/projects/synthetic-private-id");
  await expect(page).toHaveTitle("Project · Studio · Vastu Nord");
  await page.context().addCookies([{name:"vn-locale", value:"nb-NO", url:"http://127.0.0.1:3100"}]);
  await page.goto("/app/renders");
  await expect(page).toHaveTitle("Bildegalleri · Studio · Vastu Nord");
});
