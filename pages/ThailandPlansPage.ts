import { Page, Locator, expect } from '@playwright/test';

export class ThailandPlansPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Step 4: Clicks 'Access Plan' on the 3rd plan card (.nth(2))
   */
  async clickThirdPlan() {
    const accessPlanButtons = this.page.locator('button, a').filter({ hasText: /Access Plan|Select Plan/i });
    await accessPlanButtons.nth(2).waitFor({ state: 'visible', timeout: 15000 });
    await accessPlanButtons.nth(2).click();
  }
}