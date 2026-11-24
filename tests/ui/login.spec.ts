import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../fixtures/users';

test.describe('Login', () => {
  test('standard user reaches the product list', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(users.standard);
    await new InventoryPage(page).expectLoaded();
  });

  test('locked out user sees an error and stays on the login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(users.locked);
    await login.expectError('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory/);
  });

  test('wrong password is rejected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(users.standard, 'wrong_password');
    await login.expectError('Username and password do not match');
  });

  test('empty username shows a required-field error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login('', '');
    await login.expectError('Username is required');
  });

  test('protected page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page).toHaveURL('/');
    await new LoginPage(page).expectError("You can only access '/inventory.html' when you are logged in");
  });

  test('logout returns to the login page', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(users.standard);
    await new InventoryPage(page).logout();
    await expect(page).toHaveURL('/');
  });
});
