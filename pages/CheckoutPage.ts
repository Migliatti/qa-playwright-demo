import { Page, expect } from '@playwright/test';

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.page.locator('[data-test="firstName"]').fill(firstName);
    await this.page.locator('[data-test="lastName"]').fill(lastName);
    await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    await this.page.locator('[data-test="continue"]').click();
  }

  async continueEmpty() {
    await this.page.locator('[data-test="continue"]').click();
  }

  async expectError(text: string | RegExp) {
    await expect(this.page.locator('[data-test="error"]')).toContainText(text);
  }

  async finish() {
    await this.page.locator('[data-test="finish"]').click();
  }

  async expectComplete() {
    await expect(this.page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  }
}
