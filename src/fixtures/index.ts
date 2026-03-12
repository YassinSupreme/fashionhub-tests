import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';

/**
 * Extended test fixtures.
 *
 * Usage:
 *   import { test } from '@fixtures/index';
 *
 *   test('my test', async ({ loginPage, accountPage }) => { ... });
 */
type FashionHubFixtures = {
  loginPage: LoginPage;
  accountPage: AccountPage;
};

export const test = base.extend<FashionHubFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
});

export { expect } from '@playwright/test';
