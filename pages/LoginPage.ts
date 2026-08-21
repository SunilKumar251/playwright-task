import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private usernameInput = this.page.locator('[data-test="username"]');
  private passwordInput = this.page.locator('[data-test="password"]');
  private loginButton = this.page.locator('[data-test="login-button"]');

  async navigate() {
    await this.page.goto('/');
  }

  async login(user: string, pass: string) {
    await this.usernameInput.fill(user);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}