import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  private cartItems = this.page.locator('.cart_item');
  private checkoutButton = this.page.locator('[data-test="checkout"]');

  async verifyCartItems(expectedItems: { title: string; price: number }[]) {
    await expect(this.cartItems).toHaveCount(expectedItems.length);

    for (const expectedItem of expectedItems) {
      const itemRow = this.cartItems.filter({ hasText: expectedItem.title });
      await expect(itemRow).toBeVisible();
      
      const priceText = await itemRow.locator('.inventory_item_price').innerText();
      const actualPrice = parseFloat(priceText.replace('$', ''));
      expect(actualPrice).toBe(expectedItem.price);
    }
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}