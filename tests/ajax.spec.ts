import { test, expect } from '@playwright/test';

test('handles AJAX response without hardcoded delays', async ({ page }) => {
  // 1. Open the AJAX page.
  await page.goto('https://uitestingplayground.com/ajax');

  const ajaxButton = page.getByRole('button', {
    name: 'Button Triggering AJAX Request',
  });

  // 2. Trigger the asynchronous AJAX request.
  await ajaxButton.click();

  // 3. Wait for the rendered success label instead of using a fixed delay.
  const loadedMessage = page.getByText(/Data loaded with AJAX (?:response|get request)\./);

  // 4. Verify the AJAX response message.
  await expect(loadedMessage).toContainText(/Data loaded with AJAX (?:response|get request)\./, {
    timeout: 30_000,
  });

  // 5. Verify the trigger remains usable after completion.
  await expect(ajaxButton).toBeVisible();
  await expect(ajaxButton).toBeEnabled();
});