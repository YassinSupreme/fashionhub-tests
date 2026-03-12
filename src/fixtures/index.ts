import { test as base } from '@playwright/test';
import { LoginPage }    from '../pages/LoginPage';
import { AccountPage }  from '../pages/AccountPage';
import { HomePage }     from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage }     from '../pages/CartPage';
import { AboutPage }    from '../pages/AboutPage';

/**
 * Extended test fixtures.
 *
 * Usage:
 *   import { test } from '../../src/fixtures/index';
 *
 *   test('my test', async ({ homePage, productsPage, cartPage, aboutPage }) => { ... });
 */
type FashionHubFixtures = {
  loginPage:    LoginPage;
  accountPage:  AccountPage;
  homePage:     HomePage;
  productsPage: ProductsPage;
  cartPage:     CartPage;
  aboutPage:    AboutPage;
};

export const test = base.extend<FashionHubFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
});

export { expect } from '@playwright/test';
