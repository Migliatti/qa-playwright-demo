import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { users } from '../../fixtures/users';

// Documents the bug in docs/bug-report-exemplo.md.
// test.fail() means: the test is EXPECTED to fail while the bug exists.
// If the site is fixed, this test starts "passing" unexpectedly and Playwright reports it,
// which is the signal to remove test.fail() and keep it as a normal regression test.
test('known bug: problem_user sees a different image for each product', async ({ page }) => {
  test.fail();
  const login = new LoginPage(page);
  await login.open();
  await login.login(users.problem);
  await new InventoryPage(page).expectLoaded();
  const sources = await page.locator('img.inventory_item_img').evaluateAll((imgs) =>
    imgs.map((i) => i.getAttribute('src')),
  );
  expect(new Set(sources).size).toBe(sources.length);
});
