import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { AboutPage } from '../pages/AboutPage';
import { FashionHubApiClient } from '../api/FashionHubApiClient';

/**
 * Extended test fixtures.
 *
 * Browser page objects:
 *   loginPage, accountPage, homePage, productsPage, cartPage, aboutPage
 *
 * API client (browserless):
 *   apiClient — pre-configured FashionHubApiClient
 *
 * Usage:
 *   import { test } from '../../src/fixtures/index';
 *   test('my test', async ({ homePage, apiClient }) => { ... });
 */
type FashionHubFixtures = {
  // ── UI fixtures ────────────────────────────────────────────────────────────
  loginPage: LoginPage;
  accountPage: AccountPage;
  homePage: HomePage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  aboutPage: AboutPage;

  // ── API fixtures ───────────────────────────────────────────────────────────
  /** Pre-configured FashionHub API client (no browser required). */
  apiClient: FashionHubApiClient;
};

export const test = base.extend<FashionHubFixtures>({
  // ── UI page objects ────────────────────────────────────────────────────────
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

  // ── API client ─────────────────────────────────────────────────────────────
  apiClient: async ({ request }, use) => {
    const apiBaseUrl = process.env.API_BASE_URL ?? '';
    await use(new FashionHubApiClient(request, apiBaseUrl));
  },
});

export { expect } from '@playwright/test';
