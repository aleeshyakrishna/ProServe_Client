import { test, expect } from '@playwright/test';

/**
 * First beginner Playwright test:
 * Verifies that the ProServe homepage loads with correct title and elements.
 */
test.describe('Homepage', () => {
  test('has correct page title and branding', async ({ page }) => {
    // 1. Robot goes to the base URL (http://localhost:3001)
    await page.goto('/');

    // 2. Robot checks the page title in the browser tab
    await expect(page).toHaveTitle(/ProServe/i);

    // 3. Robot verifies the main content is visible on screen
    const mainContent = page.locator('#main-content');
    await expect(mainContent).toBeVisible();
  });

  test('navbar displays navigation links', async ({ page }) => {
    // 1. Open homepage
    await page.goto('/');

    // 2. Check that the navigation bar exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 3. Check for the ProServe brand logo link
    const brandLink = page.getByRole('link', { name: /ProServe/i }).first();
    await expect(brandLink).toBeVisible();
  });
});
