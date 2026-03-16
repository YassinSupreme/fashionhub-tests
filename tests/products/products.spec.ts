import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { CartPage } from '../../src/pages/CartPage';

/**
 * Feature: Products Page
 *
 * Hooks strategy:
 *   beforeEach — navigates to the Products page.
 *   afterEach  — attaches a named failure screenshot.
 */
test.describe('Feature: FashionHub Products Page', () => {

  test.beforeEach(async ({ productsPage }) => {
    await productsPage.goto();
  });

  test.afterEach(async ({ productsPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await productsPage.page.screenshot(),
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
      expect(names).toContain('Peacock Coat');
    });
  });

  test('@regression Scenario: Product prices are formatted as currency (e.g. $49.99)', async ({ productsPage }) => {
    await Then('the price of "Peacock Coat" should match the currency format', async () => {
      const price = await productsPage.getProductPrice('Peacock Coat');
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    });
  });

  test('@regression Scenario: Adding a product to the cart updates the cart', async ({ productsPage, page }) => {
    await When('I click "Add to Cart" for "Peacock Coat"', async () => {
      await productsPage.addProductToCart('Peacock Coat');
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
