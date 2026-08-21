import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000, // Increased timeout so slowMo actions do not cause test timeouts
  use: {
    baseURL: 'https://demoqa.com',
    headless: false, // Opens visible browser window
    launchOptions: {
      slowMo: 1000, // Delays every action by 1000ms (1 second)
    },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});