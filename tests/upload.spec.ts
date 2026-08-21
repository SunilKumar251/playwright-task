import { test, expect } from '@playwright/test';
import path from 'node:path';

test('uploads a file successfully', async ({ page }) => {
  await page.goto('/upload');

  const filePath = path.resolve(__dirname, 'fixtures', 'test-file.txt');

  await page.locator('#file-upload').setInputFiles(filePath);
  await page.locator('#file-submit').click();

  await expect(page.locator('h3')).toHaveText('File Uploaded!');
  await expect(page.locator('#uploaded-files')).toHaveText('test-file.txt');
});