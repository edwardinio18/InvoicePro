import { test, expect } from "@playwright/test";

test.describe("Invoice page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");

    await page.fill("[name=email]", "demo@altametrics.com");
    await page.fill("[name=password]", "password123");

    await page.click("button[type=submit]");

    await page.waitForURL("/dashboard");
  });

  test("should display invoices after login", async ({ page }) => {
    await page.goto("/invoices");

    await page.waitForSelector("table");

    const invoiceTable = await page.locator("table");
    await expect(invoiceTable).toBeVisible();

    const rows = await page.locator("table tr");
    const count = await rows.count();
    expect(count).toBeGreaterThan(1);

    const pagination = await page.locator('button:has-text("1")');
    await expect(pagination).toBeVisible();
  });

  test("should handle pagination correctly", async ({ page }) => {
    await page.goto("/invoices");

    await page.waitForSelector("table");

    const firstPageFirstRow = await page
      .locator("table tbody tr")
      .first()
      .textContent();

    const secondPageButton = await page.locator('button:has-text("2")');
    if ((await secondPageButton.count()) > 0) {
      await secondPageButton.click();

      await page.waitForTimeout(500);

      const secondPageFirstRow = await page
        .locator("table tbody tr")
        .first()
        .textContent();

      expect(firstPageFirstRow).not.toEqual(secondPageFirstRow);
    }
  });
});
