import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { users } from '../../fixtures/users';

test.describe('Cart and sorting', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(users.standard);
    inventory = new InventoryPage(page);
    await inventory.expectLoaded();
  });

  test('adding an item updates the cart badge', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge()).toHaveText('1');
  });

  test('removing an item clears the cart badge', async () => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.removeFromCart('sauce-labs-backpack');
    await expect(inventory.cartBadge()).toHaveCount(0);
  });

  test('cart page lists the items that were added', async ({ page }) => {
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.addToCart('sauce-labs-bike-light');
    await inventory.openCart();
    await new CartPage(page).expectItemCount(2);
  });

  test('sorting by price low to high orders the prices', async () => {
    await inventory.sortBy('lohi');
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorting by price high to low orders the prices', async () => {
    await inventory.sortBy('hilo');
    const prices = await inventory.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
