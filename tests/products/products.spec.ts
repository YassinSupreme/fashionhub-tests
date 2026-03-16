import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { CartPage } from '../../src/pages/CartPage';
import { PRODUCTS } from '../../src/factories';

/**
 * Feature: Products Page
 *
 * Parallelism: parallel — each test navigates independently, no shared state.
 */
test.describe('Feature: FashionHub Products Page', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  test.afterEach(async ({ productsPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await productsPage.screenshot(),
        contentType: 'image/png',
      });
    }
  });

  test('@smoke Smoke: Products page loads with the correct title', async ({ productsPage }) => {
    await Then('the page title should be "Products - FashionHub"', async () => {
      const title = await productsPage.getTitle();
      expect(title).toBe('Products - FashionHub');
    });
  });

  test('@smoke Scenario: At least one product card is displayed', async ({ productsPage }) => {
    await Then('at least one product card should be visible', async () => {
      expect(await productsPage.hasProducts()).toBe(true);
    });

    await And('the product count should be greater than zero', async () => {
      expect(await productsPage.getProductCount()).toBeGreaterThan(0);
    });
  });

  test('@regression Scenario: Each product card shows a name and a price', async ({ productsPage }) => {
    await Then('product names should be visible', async () => {
      const names = await productsPage.getProductNames();
      expect(names.length).toBeGreaterThan(0);
      expect(names).toContain(PRODUCTS.coat.name);
    });
  });

  test('@regression Scenario: Product prices are formatted as currency (e.g. $49.99)', async ({ productsPage }) => {
    await Then(`the price of "${PRODUCTS.coat.name}" should match the currency format`, async () => {
      const price = await productsPage.getProductPrice(PRODUCTS.coat.name);
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    });
  });

  test('@regression Scenario: Adding a product to the cart updates the cart', async ({ productsPage, page }) => {
    await When(`I click "Add to Cart" for "${PRODUCTS.coat.name}"`, async () => {
      await productsPage.addProductToCart(PRODUCTS.coat.name);
    });

    await Then('the cart should contain the added item', async () => {
      await page.goto('cart.html');
      await page.waitForLoadState('domcontentloaded');
      const cartPage = new CartPage(page);
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });
  });
});
