import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  private sortSelect = this.page.locator('[data-test="product-sort-container"]');
  private inventoryItems = this.page.locator('.inventory_item');

  async sortByPriceLowToHigh() {
    await this.sortSelect.selectOption('lohi');
  }

  async addCheapestAndMostExpensiveToCart(): Promise<{ cheapest: { title: string, price: number }, expensive: { title: string, price: number } }> {
    const itemsCount = await this.inventoryItems.count();
    
    // First item is cheapest after sorting
    const cheapestItem = this.inventoryItems.nth(0);
    const cheapTitle = await cheapestItem.locator('.inventory_item_name').innerText();
    const cheapPriceText = await cheapestItem.locator('.inventory_item_price').innerText();
    const cheapPrice = parseFloat(cheapPriceText.replace('$', ''));
    await cheapestItem.locator('button').click();

    // Last item is most expensive after sorting
    const expensiveItem = this.inventoryItems.nth(itemsCount - 1);
    const expTitle = await expensiveItem.locator('.inventory_item_name').innerText();
    const expPriceText = await expensiveItem.locator('.inventory_item_price').innerText();
    const expPrice = parseFloat(expPriceText.replace('$', ''));
    await expensiveItem.locator('button').click();

    return {
      cheapest: { title: cheapTitle, price: cheapPrice },
      expensive: { title: expTitle, price: expPrice }
    };
  }

  async goToCart() {
    await this.page.locator('.shopping_cart_link').click();
  }
}