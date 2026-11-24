import { Page, expect } from '@playwright/test';

export class InventoryPage {
  constructor(private page: Page) {}

  items = () => this.page.locator('[data-test="inventory-item"]');
  cartBadge = () => this.page.locator('[data-test="shopping-cart-badge"]');

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.items()).toHaveCount(6);
  }

  async addToCart(slug: string) {
    await this.page.locator(`[data-test="add-to-cart-${slug}"]`).click();
  }

  async removeFromCart(slug: string) {
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async sortBy(value: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.page.locator('[data-test="product-sort-container"]').selectOption(value);
  }

  async prices(): Promise<number[]> {
    const texts = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return texts.map((t) => Number(t.replace('$', '')));
  }

  async openCart() {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.locator('[data-test="logout-sidebar-link"]').click();
  }
}
