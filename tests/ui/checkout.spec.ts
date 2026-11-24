import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { users, customer } from '../../fixtures/users';

test.describe('Checkout', () => {
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(users.standard);
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.openCart();
    await new CartPage(page).checkout();
    checkout = new CheckoutPage(page);
  });

  test('complete purchase shows the confirmation message', async () => {
    await checkout.fillInfo(customer.firstName, customer.lastName, customer.postalCode);
    await checkout.finish();
    await checkout.expectComplete();
  });

  test('empty form shows first name required', async () => {
    await checkout.continueEmpty();
    await checkout.expectError('First Name is required');
  });

  test('missing postal code is rejected', async () => {
    await checkout.fillInfo(customer.firstName, customer.lastName, '');
    await checkout.expectError('Postal Code is required');
  });
});
