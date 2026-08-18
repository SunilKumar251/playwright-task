// tests/betterroaming.spec.ts
import { test, expect } from '@playwright/test';

test('BetterRoaming test - verify third plan', async ({ page }) => {
  console.log('🚀 Test started...');
  
  // Go to website
  await page.goto('https://www.betterroaming.com/');
  await page.waitForLoadState('networkidle');
  console.log('✅ Page loaded');
  
  // Handle cookie popup
  try {
    const acceptBtn = page.locator('button:has-text("Accept All")');
    if (await acceptBtn.isVisible({ timeout: 3000 })) {
      await acceptBtn.click();
      console.log('✅ Cookies accepted');
    }
  } catch (e) {
    console.log('No cookie popup');
  }
  
  // Select Euro
  console.log('Selecting Euro...');
  await page.locator('button:has-text("EN - USD $")').click();
  await page.waitForTimeout(1000);
  await page.locator('text=Euro - €').click();
  await page.waitForTimeout(2000);
  console.log('✅ Euro selected');
  
  // Click Thailand
  console.log('Clicking Thailand...');
  await page.locator('text=Thailand').first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  console.log('✅ Thailand clicked');
  
  // Find plan cards
  console.log('Finding plan cards...');
  const cards = page.locator('.plan-card, .product-card, [class*="plan"]');
  const count = await cards.count();
  console.log(`Found ${count} cards`);
  
  if (count >= 3) {
    const thirdPlan = cards.nth(2);
    const text = await thirdPlan.textContent() || '';
    console.log('Plan text:', text.substring(0, 200));
    
    // Check values
    expect(text).toContain('Thailand');
    expect(text).toContain('5 GB');
    expect(text).toContain('30 DAYS');
    expect(text).toContain('Data only');
    
    // Check price
    const priceMatch = text.match(/€\s*([\d,]+[\\.\\,]?\d*)/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(',', '.'));
      console.log(`💰 Price: €${price.toFixed(2)}`);
      expect(price).toBeGreaterThan(0);
    }
    
    console.log('✅ All assertions passed!');
  } else {
    // Alternative method
    console.log('Trying alternative method...');
    const containers = page.locator('div:has-text("Thailand"):has-text("GB")');
    const containerCount = await containers.count();
    
    if (containerCount >= 3) {
      const thirdContainer = containers.nth(2);
      const text = await thirdContainer.textContent() || '';
      console.log('Container text:', text.substring(0, 200));
      
      expect(text).toContain('Thailand');
      expect(text).toContain('5 GB');
      expect(text).toContain('30 DAYS');
      expect(text).toContain('Data only');
      
      console.log('✅ All assertions passed!');
    } else {
      throw new Error('Could not find plan cards');
    }
  }
  
  await page.screenshot({ path: 'test-result.png', fullPage: true });
  console.log('📸 Screenshot saved');
  console.log('🎉 Test completed!');
});