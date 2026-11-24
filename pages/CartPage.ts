import { Page, expect } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  items = () => this.page.locator('[data-test="inventory-item"]');

  async expectItemCount(n: number) {
    await expect(this.items()).toHaveCount(n);
  }

  async checkout() {
    await this.page.locator('[data-test="checkout"]').click();
  }
}
