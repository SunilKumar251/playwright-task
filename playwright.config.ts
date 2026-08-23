import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Retry failed tests automatically when running in CI */
  retries: process.env.CI ? 2 : 0,
  /* Use 1 worker on CI to prevent overloading the runner machine */
  workers: process.env.CI ? 1 : undefined,
  /* Generate HTML and JUnit/List reports */
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  use: {
    /* Set base URL from environment variable or fallback */
    baseURL: process.env.BASE_URL || 'https://staging.example.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});