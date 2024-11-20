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
