import { test, expect } from '@playwright/test';

test('opens, verifies, and closes a new browser window', async ({ page }) => {
  // 1. Navigate to the multiple-windows page.
  await page.goto('https://the-internet.herokuapp.com/windows');

  // 2-3. Capture the new window before clicking the link to avoid a race condition.
  const newPagePromise = page.context().waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here' }).click();
  const newPage = await newPagePromise;
  await newPage.waitForLoadState('domcontentloaded');

  // 4-5. Switch focus to the new tab and verify its main header.
  await expect(newPage).toHaveTitle('New Window');
  await expect(newPage.getByRole('heading', { name: 'New Window' })).toBeVisible();

  // 6. Close the new tab and verify the parent page remains available.
  await newPage.close();
  await expect(page).toHaveURL('https://the-internet.herokuapp.com/windows');
  await expect(page.getByRole('heading', { name: 'Opening a new window' })).toBeVisible();
});