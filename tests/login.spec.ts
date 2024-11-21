import { expect, test } from "@playwright/test";

test("can log in with user:user", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("user");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("user");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/");
});

test("can log out", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/");
  await page.getByRole("button", { name: "#user" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await expect(page).toHaveURL("/login");
  await page.goto("/");
  await expect(page).toHaveURL("/login");
});
