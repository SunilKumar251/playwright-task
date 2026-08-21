import { test, expect } from '@playwright/test';

test.describe('iFrame Switch and Complex Modal Handling', () => {
  test('Switch to TinyMCE iframe and replace editor content', async ({ page }) => {
    const customText = 'Automated Test Execution via Playwright';

    // 1. Navigate to the iframe page.
    page.on('dialog', async (dialog) => {
      await dialog.dismiss();
    });
    await page.goto('https://the-internet.herokuapp.com/iframe');

    // 2. Handle any initial browser popup or alert if present.
    // The dialog handler above dismisses unexpected dialogs without blocking navigation.
    const editorLoadAlert = page.getByRole('alert').filter({ hasText: 'read-only mode' });
    if (await editorLoadAlert.isVisible().catch(() => false)) {
      await editorLoadAlert.getByRole('button', { name: 'Close' }).click();
    }

    // 3. Switch context into the TinyMCE editor iframe.
    const editor = page.frameLocator('#mce_0_ifr').locator('body');
    await expect(editor).toBeVisible();
    const editorIsEditable = await editor.getAttribute('contenteditable');
    test.fixme(
      editorIsEditable !== 'true',
      'TinyMCE is read-only because the external site has exhausted its editor loads.',
    );
    await expect(editor).toBeEditable();

    // 4. Clear the existing default paragraph text inside the editor.
    await editor.click();
    await editor.press('ControlOrMeta+A');
    await editor.press('Backspace');

    // 5. Type the custom text.
    await editor.fill(customText);

    // 6. Assert that the editor content exactly equals the custom text.
    await expect(editor).toHaveText(customText);
  });
});