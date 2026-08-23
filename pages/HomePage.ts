import { expect, Page } from '@playwright/test';

export class HomePage {
  constructor(private readonly page: Page) {}

  async open() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });

    const acceptCookies = this.page.getByTestId('uc-accept-all-button').or(
      this.page.getByRole('button', { name: /Accept All/i }),
    ).first();
    await expect(acceptCookies).toBeVisible({ timeout: 15000 });
    await acceptCookies.click();
  }

  async selectEuro() {
    const currencyButton = this.page.locator('div:visible').filter({
      hasText: /^USD\s*\$$/i,
    }).first();
    await expect(currencyButton).toBeVisible();
    await currencyButton.click();

    const euroOption = this.page.getByRole('option', { name: /Euro/i }).or(
      this.page.getByText(/Euro\s*-\s*€/i),
    ).first();
    await expect(euroOption).toBeVisible();
    await euroOption.click();
  }

  async openThailandPlans() {
    const thailandLink = this.page.getByRole('link', { name: /Thailand/i }).first();
    await expect(thailandLink).toBeVisible();
    await thailandLink.click();
    await this.page.waitForURL('**/plans/esim-thailand/**');
  }
}