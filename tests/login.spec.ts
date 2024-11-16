import { expect, test } from "@playwright/test";

test("username user with password user can log in", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("user");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("user");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/");
});
