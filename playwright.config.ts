import { defineConfig, devices } from '@playwright/test';

/**
 * Simple, beginner-friendly Playwright configuration
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  /* On CI: fail if test.only is left in, retry flaky tests twice, and print results in the log */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
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
  /* Start the app automatically before the tests.
     CI: serve the production build. Locally: reuse your running `npm run dev` on 3001, or start one. */
  webServer: {
    command: process.env.CI ? 'npm run start -- -p 3001' : 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
