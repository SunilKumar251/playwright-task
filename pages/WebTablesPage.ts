import { Page, expect } from '@playwright/test';

export interface UserRecord {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export class WebTablesPage {
  constructor(private page: Page) {}

  // Page Locators
  private addButton = this.page.locator('#addNewRecordButton');
  private searchInput = this.page.locator('#searchBox');
  private searchButton = this.page.locator('#basic-addon2');

  // Modal Locators
  private firstNameInput = this.page.locator('#firstName');
  private lastNameInput = this.page.locator('#lastName');
  private emailInput = this.page.locator('#userEmail');
  private ageInput = this.page.locator('#age');
  private salaryInput = this.page.locator('#salary');
  private departmentInput = this.page.locator('#department');
  private submitButton = this.page.locator('#submit');

  // Step 1: Navigate with strict Ad Blocking & CSS injection
  async navigate() {
    await this.page.route('**/*', (route) => {
      const url = route.request().url().toLowerCase();
      if (
        url.includes('googlesyndication') ||
        url.includes('doubleclick') ||
        url.includes('google-analytics') ||
        url.includes('adservice') ||
        url.includes('amazon-adsystem') ||
        url.includes('adnxs')
      ) {
        return route.abort();
      }
      return route.continue();
    });

    await this.page.goto('https://demoqa.com/webtables', { waitUntil: 'domcontentloaded' });

    await this.page.addStyleTag({
      content: `
        #fixedban, #adplus-wrapper, [id^="google_ads"], iframe[id^="google_ads"] {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `,
    });
  }

  // Step 2: Add record
  async addRecord(user: UserRecord) {
    await this.addButton.click();

    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.ageInput.fill(user.age);
    await this.salaryInput.fill(user.salary);
    await this.departmentInput.fill(user.department);

    await this.submitButton.click({ force: true });
    await expect(this.submitButton).toBeHidden();
  }

  // Step 3: Enter search term and safely click edit icon button
  async searchAndClickEditPath(searchTerm: string) {
    await this.searchInput.fill('');
    await this.searchInput.fill(searchTerm);

    await this.searchButton.waitFor({ state: 'visible' });
    await this.searchButton.click();

    const editButton = this.page.locator('#edit-record-1');
    await editButton.waitFor({ state: 'visible' });
    await editButton.click({ force: true });
  }

  // Step 4: Clear React input state and update salary
  async updateSalary(newSalary: string) {
    await this.salaryInput.waitFor({ state: 'visible' });
    await this.salaryInput.click();
    
    await this.salaryInput.press('ControlOrMeta+A');
    await this.salaryInput.press('Backspace');
    await this.salaryInput.fill(newSalary);

    await this.submitButton.click({ force: true });
    await expect(this.submitButton).toBeHidden();
  }

  // Assert user's salary matches expected value
  async verifyUserSalary(email: string, expectedSalary: string) {
    const targetRow = this.page.locator('.rt-tr-group', {
      has: this.page.locator('.rt-td', { hasText: email }),
    });

    const salaryCell = targetRow.locator('.rt-td').nth(4);
    await expect(salaryCell).toHaveText(expectedSalary);
  }
}