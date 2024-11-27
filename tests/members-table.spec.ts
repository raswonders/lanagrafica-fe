import { test, expect } from "@playwright/test";
import { createSnapshot, restoreFromSnapshot } from "../test-server/table";

test.beforeAll(async () => {
  await createSnapshot();
});

test.afterAll(async () => {
  await restoreFromSnapshot();
});

test.beforeEach(async () => {
  await restoreFromSnapshot();
});

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
  const toast = page.getByText("Creation successful");
  await expect(toast).toBeInViewport();
  await expect(toast).not.toBeInViewport({ timeout: 10000 });
});

test("shows errors for missing fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add member" }).click();
  await page.getByRole("button", { name: "Create member" }).click();
  await expect(page.getByText("is required")).toHaveCount(6);
});

test.describe("member details - personal tab", () => {
  test("updates personal details", async ({ page }) => {
    await page.goto("/");
    const memberRow = page.getByRole("row", { name: "Giulia Rossi" });
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();

    const saveButton = page.getByRole("button", { name: "Save" });
    await expect(saveButton).toBeDisabled();

    // Perform update
    await page.getByLabel("day").fill("11");
    await saveButton.click();

    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });

    // Form was reset
    await editButton.click();
    await expect(saveButton).toBeDisabled();
  });

  test("shows error when name is missing", async ({ page }) => {
    await page.goto("/");
    const memberRow = page.getByRole("row", { name: "Giulia Rossi" });
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();

    await page.getByLabel("First name").fill("");

    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();
    await expect(page.getByText("is required")).toBeVisible();
  });
});

test.describe("member details: membership tab", () => {
  test("suspends member for a week", async ({ page }) => {
    await page.goto("/");
    const memberRow = page.getByRole("row", { name: "Fabio Barbieri" });
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();
    await page.getByRole("tab", { name: "Membership" }).click();

    const suspendButton = page.getByRole("button", { name: "Suspend" });
    await suspendButton.click();
    const weekButton = page.getByRole("button", { name: "week" });
    await weekButton.click();
    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();
    await expect(page.getByText("is required")).toBeVisible();

    await page.getByLabel("Reason for suspension").fill("just a test");
    await saveButton.click();
    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });
  });

  test("cancels suspension", async ({ page }) => {
    await page.goto("/");
    const memberRow = page.getByRole("row", { name: "Lucaa Bianchi" });
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();
    await page.getByRole("tab", { name: "Membership" }).click();

    const cancelButton = page.getByRole("button", {
      name: "Cancel suspension",
    });

    await cancelButton.click();
    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();
    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });
  });
});
