import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Step 1: Navigates to the homepage and explicitly blocks execution until
   * the cookie popup appears, clicking 'Set preferences' / 'More' and 'Accept All'.
   */
  async handleCookiePopup() {
    await this.page.goto('https://www.betterroaming.com/', { waitUntil: 'networkidle' });

    // Target Usercentrics buttons using shadow DOM piercing locators
    const moreBtn = this.page.locator('[data-testid="uc-more-button"], button:has-text("Set preferences"), button:has-text("More options")').first();
    const acceptAllBtn = this.page.locator('[data-testid="uc-accept-all-button"], button:has-text("Accept All")').first();

    // Force wait for the popup banner to render on screen before moving forward
    await moreBtn.waitFor({ state: 'visible', timeout: 15000 });
    await moreBtn.click();

    await acceptAllBtn.waitFor({ state: 'visible', timeout: 10000 });
    await acceptAllBtn.click();

    // Confirm the overlay is dismissed/closed from the DOM
    await acceptAllBtn.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  }

  /**
   * Step 2: Clicks the USD currency button in the header and selects Euro - €
   */
  async changeCurrencyToEuro() {
    // Locates header currency button matching USD$ / USD / $
    const currencyDropdown = this.page.locator('header').getByRole('button').filter({ hasText: /USD|\$|EN/i }).first();
    await currencyDropdown.waitFor({ state: 'visible', timeout: 10000 });
    await currencyDropdown.click();

    // Select Euro - € from the dropdown menu
    const euroOption = this.page.getByText(/Euro\s*-\s*€|Euro|EUR/i).first();
    await euroOption.waitFor({ state: 'visible', timeout: 10000 });
    await euroOption.click();

    // Short wait to ensure active session currency updates
    await this.page.waitForTimeout(1000);
  }

  /**
   * Step 3: Navigates to the Thailand eSIM destination page
   */
  async goToThailandPage() {
    const thailandLink = this.page.getByRole('link', { name: /Thailand/i }).first();
    if (await thailandLink.isVisible({ timeout: 4000 }).catch(() => false)) {
      await thailandLink.click();
    } else {
      await this.page.goto('https://www.betterroaming.com/plans/esim-thailand/', { waitUntil: 'networkidle' });
    }
  }
}