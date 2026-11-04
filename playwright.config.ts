import { defineConfig, devices } from '@playwright/test';

/**
 * Simple, beginner-friendly Playwright configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    /* Base URL so in tests you can simply write `await page.goto('/')` */
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Test with Chromium (Google Chrome engine) */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
