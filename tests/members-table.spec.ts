import { test, expect } from "@playwright/test";
import {
  createMembersSnapshot,
  restoreFromSnapshot,
} from "../test-server/table";

const dateRE = /\d\d\/\d\d\/\d\d\d\d/;

test.beforeAll(async () => {
  await createMembersSnapshot();
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

test("finds a member", async ({ page }) => {
  const memberRow = await searchForMember(page, "Giulia Rossi");
  await expect(await memberRow.count()).toBeGreaterThan(0);
});

test("adds a member", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add member" }).click();
  await page.getByLabel("First name").fill("Test");
  await page.getByLabel("Surname").fill("Test");
  await page.getByLabel("day").fill("1");
  await page.getByLabel("month").fill("1");
  await page.getByLabel("year").fill("90");
  await page.getByLabel("Country of origin").press("Tab");
  await page.getByLabel("Place of birth").click();
  await page.getByRole("option", { name: "Abbateggio" }).click();
  await page.getByLabel("Document type").click();
  await page.getByLabel("Id card").getByText("Id card").click();
  await page.getByLabel("Document ID").fill("1234");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByRole("button", { name: "Create member" }).click();
  const toast = page.getByText("Creation successful");
  await expect(toast).toBeInViewport();
  await expect(toast).not.toBeInViewport({ timeout: 10000 });
});

test("fails to add member when missing fields", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add member" }).click();
  await page.getByRole("button", { name: "Create member" }).click();
  await expect(page.getByText("is required")).toHaveCount(6);
});

test.describe("edits member", () => {
  test("updates personal details", async ({ page }) => {
    const memberRow = await searchForMember(page, "Giulia Rossi");
    await expect(await memberRow.count()).toBeGreaterThan(0);
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();
    const saveButton = page.getByRole("button", { name: "Save" });
    await expect(saveButton).toBeDisabled();

    const dayField = await page.getByLabel("day");
    await dayField.fill("11");
    await saveButton.click();

    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });

    await editButton.click();
    await expect(saveButton).toBeDisabled();
    await expect(dayField).toHaveValue("11");
  });

  test("prevents save of personal tab when name is missing", async ({
    page,
  }) => {
    await page.goto("/");
    const memberRow = await searchForMember(page, "Giulia Rossi");
    await expect(await memberRow.count()).toBeGreaterThan(0);
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();
    const saveButton = page.getByRole("button", { name: "Save" });

    await page.getByLabel("First name").fill("");
    await saveButton.click();

    await expect(page.getByText("is required")).toBeVisible();
  });

  test("suspends member for a week", async ({ page }) => {
    await page.goto("/");
    const memberRow = await searchForMember(page, "Fabio Barbieri");
    await expect(await memberRow.count()).toBeGreaterThan(0);
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();
    const membershipTab = page.getByRole("tab", { name: "Membership" });
    await membershipTab.click();

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

    await editButton.click();
    await membershipTab.click();
    const suspendedField = page.getByLabel("Suspended till");
    await expect(saveButton).toBeDisabled();
    await expect(suspendedField).toHaveValue(dateRE);
  });

  test("cancels members suspension", async ({ page }) => {
    await page.goto("/");
    const memberRow = await searchForMember(page, "Luca Bianchi");
    await expect(await memberRow.count()).toBeGreaterThan(0);
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();
    const membershipTab = page.getByRole("tab", { name: "Membership" });
    await membershipTab.click();

    const cancelButton = page.getByRole("button", {
      name: "Cancel suspension",
    });
    await cancelButton.click();
    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();
    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });

    await editButton.click();
    await membershipTab.click();
    const suspendedField = page.getByLabel("Suspended till");
    await expect(saveButton).toBeDisabled();
    await expect(suspendedField).toHaveValue("");
  });

  test("renews member via member details", async ({ page }) => {
    await page.goto("/");
    const memberRow = await searchForMember(page, "Giulia Rossi");
    await expect(await memberRow.count()).toBeGreaterThan(0);
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();
    const membershipTab = page.getByRole("tab", { name: "Membership" });
    await membershipTab.click();

    const renewButton = page.getByRole("button", {
      name: "Renew",
    });
    await renewButton.click();
    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();
    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });

    await editButton.click();
    await membershipTab.click();
    const expiredField = page.getByLabel("Expires");
    await expect(saveButton).toBeDisabled();
    await expect(expiredField).toHaveValue(dateRE);
  });

  test("renews member via action button", async ({ page }) => {
    await page.goto("/");
    const memberRow = await searchForMember(page, "Giulia Rossi");
    await expect(await memberRow.count()).toBeGreaterThan(0);
    const renewButton = memberRow.getByRole("button").nth(1);
    await renewButton.click();

    const confirmButton = page.getByRole("button", {
      name: "Renew",
    });
    await confirmButton.click();

    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });
    await expect(renewButton).toBeDisabled();
  });

  test("add note for a member", async ({ page }) => {
    await page.goto("/");
    const memberRow = await searchForMember(page, "Giulia Rossi");
    await expect(await memberRow.count()).toBeGreaterThan(0);
    const noteButton = memberRow.getByRole("button").nth(2);
    await expect(noteButton).toBeDisabled();
    const editButton = memberRow.getByRole("button").first();
    await editButton.click();

    const noteTab = page.getByRole("tab", { name: "Note" });
    await noteTab.click();
    const noteField = page.getByRole("textbox", { name: "Note" });
    await noteField.fill("test");
    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();

    const toast = page.getByText("Update successful");
    await expect(toast).toBeInViewport();
    await expect(toast).not.toBeInViewport({ timeout: 10000 });
    await expect(noteButton).toBeEnabled();

    await editButton.click();
    await noteTab.click();
    await expect(noteField).toHaveValue("test");
  });
});

async function searchForMember(page, name) {
  await page.goto("/");
  await page.locator("input[type=search]").fill(name);
  await page.locator("input[type=search]").click();
  const memberRow = await page.getByRole("row", { name });
  await memberRow.first().waitFor();
  return memberRow;
}
