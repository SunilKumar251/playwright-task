import { expect, Locator, Page } from '@playwright/test';

export class ThailandPlansPage {
  constructor(private readonly page: Page) {}

  async thirdPlan(): Promise<Locator> {
    const dataAmount = this.page.getByText('5 GB', { exact: true });
    await expect(dataAmount).toBeVisible();

    return dataAmount.locator(
      'xpath=ancestor::div[contains(@class, "rounded-[16px]")][1]',
    );
  }
}