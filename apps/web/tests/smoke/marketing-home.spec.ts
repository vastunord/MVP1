import { test, expect } from "@playwright/test";

test("home study controls and transformation directions lead into the Studio", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(
    page.getByRole("heading", { name: "See what’s possible." }),
  ).toBeVisible();
  const lighting = page.getByRole("slider", { name: "Compare room lighting" });
  await lighting.focus();
  await page.keyboard.press("End");
  await expect(lighting).toHaveValue("100");
  await page.getByRole("button", { name: "Next study" }).click();
  await expect(
    page.getByRole("heading", { name: "Explore texture and depth." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Transform outdoors" }).click();
  await expect(
    page.getByRole("heading", { name: "Garden Design", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Evening", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Evening", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByText("Do I need design experience?", { exact: true }).click();
  await expect(
    page.getByText(
      "Explore the tools and studies without prior design training.",
    ),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore this tool" }).click();
  await expect(page).toHaveURL(/app\/tools\/garden-design$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
