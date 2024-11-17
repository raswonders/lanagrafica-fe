import { test as setup } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("/login");
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill("user");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("user");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("/");

  await page.context().storageState({ path: authFile });
});
