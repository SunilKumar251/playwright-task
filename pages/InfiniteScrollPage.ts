import { Page, Locator, expect } from '@playwright/test';

export class InfiniteScrollPage {
  constructor(private page: Page) {}

  private addedBlocks: Locator = this.page.locator('.jscroll-added');

  async navigate() {
    await this.page.goto('/infinite_scroll', { waitUntil: 'domcontentloaded' });
  }

  async scrollToLoadBlocks(targetCount: number) {
    let currentCount = await this.addedBlocks.count();
    let attempts = 0;
    const maxAttempts = 20;

    while (currentCount < targetCount && attempts < maxAttempts) {
      // Scroll down by 1000px to trigger the scroll listener reliably
      await this.page.evaluate(() => window.scrollBy(0, 1000));
      
      // Wait briefly for network request/DOM insertion
      await this.page.waitForTimeout(1000);

      currentCount = await this.addedBlocks.count();
      attempts++;
    }

    if (currentCount < targetCount) {
      throw new Error(`Failed to load ${targetCount} blocks. Only loaded ${currentCount} after ${maxAttempts} scroll attempts.`);
    }
  }

  async verifyAddedBlocksCount(minCount: number) {
    const actualCount = await this.addedBlocks.count();
    expect(actualCount).toBeGreaterThanOrEqual(minCount);
  }

  async verifyBlocksHaveNonEmptyText() {
    const count = await this.addedBlocks.count();
    
    for (let i = 0; i < count; i++) {
      const blockText = await this.addedBlocks.nth(i).innerText();
      expect(blockText.trim().length).toBeGreaterThan(0);
    }
  }
}