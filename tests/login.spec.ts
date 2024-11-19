import { expect, test } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel("Username")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("user");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("user");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/");
  await expect(page).toHaveURL("/");
});

test("user can log out", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/");
  await page.getByRole("button", { name: "#user" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await page.waitForURL("/login");
  await expect(page).toHaveURL("/login");

  await page.goto("/");
  await page.waitForURL("/");
  await expect(page).toHaveURL("/login");
});
