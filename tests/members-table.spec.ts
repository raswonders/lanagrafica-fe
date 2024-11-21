import { test, expect } from "@playwright/test";

test("renders rows", async ({ page }) => {
  // renders rows on navigation
  await page.goto("/");
  const rows = page.locator('tr[data-row="true"]');
  await rows.first().waitFor();
  const initialRowCount = await rows.count();
  expect(initialRowCount).toBeGreaterThan(0);

  // renders rows on scroll
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page
    .locator('tr[data-row="true"]')
    .nth(initialRowCount + 1)
    .waitFor();
  const afterScrollCount = await rows.count();
  expect(afterScrollCount).toBeGreaterThan(initialRowCount);
});

test("returns a member on search", async ({ page }) => {
  await page.goto("/");
  await page.locator("input[type=search]").click();
  await page.locator("input[type=search]").fill("giulia");
  const rows = page.locator('tr[data-row="true"]');
  await rows.first().waitFor();
  const rowsCount = await rows.count();
  expect(rowsCount).toBeGreaterThan(0);
});

test("adds a member", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add member" }).click();
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("First name").press("Tab");
  await page.getByLabel("Surname").fill("Test");
  await page.getByLabel("Surname").press("Tab");
  await page.getByLabel("day").click();
  await page.getByLabel("day").fill("1");
  await page.getByLabel("day").press("Tab");
  await page.getByLabel("month").fill("1");
  await page.getByLabel("month").press("Tab");
  await page.getByLabel("year").fill("90");
  await page.getByLabel("year").press("Tab");
  await page.getByLabel("Country of origin").press("Tab");
  await page.getByLabel("Place of birth").click();
  await page.getByRole("option", { name: "Abbateggio" }).click();
  await page.getByLabel("Document type").click();
  await page.getByLabel("Id card").getByText("Id card").click();
  await page.getByLabel("Document ID").click();
  await page.getByLabel("Document ID").fill("1234");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByRole("button", { name: "Create member" }).click();
  await expect(page.getByLabel("Add member")).not.toBeInViewport();
  await expect(page.getByRole("status")).toBeInViewport();
  await expect(page.getByRole("status")).not.toBeInViewport({ timeout: 10000 });
});

test("shows errors for missing fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add member" }).click();
  await page.getByRole("button", { name: "Create member" }).click();
  await expect(page.getByText("is required")).toHaveCount(6);
});

test("updates member details", async ({ page }) => {
  await page.goto("/");
  const memberRow = page.getByRole("row", { name: "Giulia Rossi" });
  const editButton = memberRow.getByRole("button").first();
  await editButton.click();

  const saveButton = page.getByRole("button", { name: "Save" });
  await expect(saveButton).toBeDisabled();

  // Perform update 
  await page.getByLabel("day").fill("11");
  await saveButton.click();

  const toast = page.getByRole("status");
  await expect(toast).toBeInViewport();
  await expect(toast).toContainText("successful");
  await expect(toast).not.toBeInViewport({ timeout: 10000 });

  // Form was reset
  await editButton.click();
  await expect(saveButton).toBeDisabled();
});