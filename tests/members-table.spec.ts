import { test, expect } from "@playwright/test";

test("renders rows", async ({ page }) => {
  await page.goto("/");

  const rows = page.locator('tr[data-row="true"]');
  await rows.first().waitFor();

  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);
});
