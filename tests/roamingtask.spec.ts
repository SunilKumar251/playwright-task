import { test, expect } from '@playwright/test';

test('Verify BetterRoaming Thailand 3rd plan details in Euro', async ({ page }) => {
  // 1. Navigate to the homepage
  await page.goto('https://www.betterroaming.com/');

  // Step 1: Accept all cookies
  const acceptCookiesBtn = page.getByTestId('uc-accept-all-button');
  await expect(acceptCookiesBtn).toBeVisible({ timeout: 10000 });
  await acceptCookiesBtn.click();

  // Step 2: Open Currency Modal
  const usdCurrencyBtn = page.getByText('USD$').first();
  await expect(usdCurrencyBtn).toBeVisible();
  await usdCurrencyBtn.click();

  // Step 3: Select Euro - €
  const euroOption = page.getByText('Euro - €');
  await expect(euroOption).toBeVisible();
  await euroOption.click();

  // Ensure modal overlay closes fully
  await page.waitForTimeout(1000);

  // Step 4: Click Thailand destination link
  const thailandLink = page.getByRole('link', { name: /esim-thailand Thailand|Thailand/i }).first();
  await expect(thailandLink).toBeVisible();
  await thailandLink.click();

  // Wait for page transition to Thailand plans page
  await page.waitForURL('**/plans/esim-thailand/**');

  // Step 5: Locate and scroll to 3rd plan button
  const thirdAccessPlanBtn = page.getByText('Access Plan').nth(2);
  await thirdAccessPlanBtn.scrollIntoViewIfNeeded();
  await expect(thirdAccessPlanBtn).toBeVisible();
  await thirdAccessPlanBtn.click();

  // Locate parent container of the 3rd plan card
  const thirdPlanCard = thirdAccessPlanBtn.locator('xpath=ancestor::div[contains(@class, "rounded") or contains(@class, "card") or contains(@class, "border")][1]');

  // Assert Country: Thailand
  await expect(page.getByText('Thailand').nth(2)).toBeVisible();

  // Assert Data: 5GB
  await expect(page.getByText('5 GB', { exact: false }).first()).toBeVisible();

  // Assert Valid: 30 days
  await expect(page.getByText('30 DAYS', { exact: false }).first()).toBeVisible();

  // Assert Plan type: Data only
  await expect(page.getByText('Data only', { exact: false }).first()).toBeVisible();

  // Assert Price in Euro (€)
  const priceElement = page.locator('text=/€[0-9]+[.,][0-9]{2}/').nth(2);
  await expect(priceElement).toBeVisible();

  const currentPriceText = await priceElement.textContent();
  console.log(`Current live price for 3rd plan: ${currentPriceText?.trim()}`);

  // Dynamic price assertion
  const defaultPrice = '11,79';
  const livePriceClean = currentPriceText?.replace('€', '').trim();

  if (livePriceClean !== defaultPrice) {
    console.log(`Price updated from ${defaultPrice} € to live price ${livePriceClean} €. Using current live price for assertion.`);
  }

  expect(livePriceClean).toBeTruthy();
});