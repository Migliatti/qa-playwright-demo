import { Page, expect } from '@playwright/test';
import { PASSWORD } from '../fixtures/users';

export class LoginPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/');
  }

  async login(username: string, password = PASSWORD) {
    await this.page.locator('[data-test="username"]').fill(username);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-button"]').click();
  }

  async expectError(text: string | RegExp) {
    await expect(this.page.locator('[data-test="error"]')).toContainText(text);
  }
}
