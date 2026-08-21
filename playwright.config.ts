import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://uitestingplayground.com',
    headless: false,
    ignoreHTTPSErrors: true,
    launchOptions: {
      slowMo: 1000,
    },
  },
});