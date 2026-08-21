import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  private firstNameInput = this.page.locator('[data-test="firstName"]');
  private lastNameInput = this.page.locator('[data-test="lastName"]');
  private postalCodeInput = this.page.locator('[data-test="postalCode"]');
  private continueButton = this.page.locator('[data-test="continue"]');

  private itemTotalLabel = this.page.locator('.summary_subtotal_label');
  private taxLabel = this.page.locator('.summary_tax_label');
  private totalLabel = this.page.locator('.summary_total_label');

  async fillBuyerInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async verifyCalculations(expectedItemTotal: number) {
    const itemTotalText = await this.itemTotalLabel.innerText();
    const actualItemTotal = parseFloat(itemTotalText.replace('Item total: $', ''));
    
    const taxText = await this.taxLabel.innerText();
    const actualTax = parseFloat(taxText.replace('Tax: $', ''));
    
    const totalText = await this.totalLabel.innerText();
    const actualTotal = parseFloat(totalText.replace('Total: $', ''));

    // Assert Item Total equals the sum of selected prices
    expect(actualItemTotal).toBeCloseTo(expectedItemTotal, 2);

    // Assert Tax is computed at 8% (round half-up behavior check)
    const computedTax = Math.round(expectedItemTotal * 0.08 * 100) / 100;
    expect(actualTax).toBeCloseTo(computedTax, 2);

    // Assert Total equals Item Total + Tax
    const expectedTotal = Math.round((actualItemTotal + actualTax) * 100) / 100;
    expect(actualTotal).toBeCloseTo(expectedTotal, 2);
  }
}