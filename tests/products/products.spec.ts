import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { CartPage } from '../../src/pages/CartPage';

/**
 * Feature: Products / Clothing Page
 *
 * Tests the FashionHub products page using Given / When / Then BDD style.
 * Linked feature file: tests/products/products.feature
 */
test.describe('Feature: FashionHub Products Page', () => {

  // ── Scenario 1 — Smoke ──────────────────────────────────────────────────────
  test('Smoke: Products page loads with the correct title', async ({ productsPage }) => {
    await Given('I navigate to the Products page', async () => {
      await productsPage.goto();
    });

    await Then('the page title should be "Products - FashionHub"', async () => {
      const title = await productsPage.getTitle();
      expect(title).toBe('Products - FashionHub');
    });
  });

  // ── Scenario 2 — Products visible ────────────────────────────────────────────
  test('Scenario: At least one product card is displayed', async ({ productsPage }) => {
    await Given('I am on the Products page', async () => {
      await productsPage.goto();
    });

    await Then('at least one product card should be visible', async () => {
      expect(await productsPage.hasProducts()).toBe(true);
    });

    await And('the product count should be greater than zero', async () => {
      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  // ── Scenario 3 — Product card anatomy ────────────────────────────────────────
  test('Scenario: Each product card shows a name and a price', async ({ productsPage }) => {
    await Given('I am on the Products page', async () => {
      await productsPage.goto();
    });

    await Then('product names should be visible', async () => {
      const names = await productsPage.getProductNames();
      expect(names.length).toBeGreaterThan(0);
    });

    await And('the known product "Peacock Coat" should be listed', async () => {
      const names = await productsPage.getProductNames();
      expect(names).toContain('Peacock Coat');
    });
  });

  // ── Scenario 4 — Price format ─────────────────────────────────────────────────
  test('Scenario: Product prices are formatted as currency (e.g. $49.99)', async ({ productsPage }) => {
    await Given('I am on the Products page', async () => {
      await productsPage.goto();
    });

    await Then('the price of "Peacock Coat" should match the currency format', async () => {
      const price = await productsPage.getProductPrice('Peacock Coat');
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    });
  });

  // ── Scenario 5 — Add to Cart ──────────────────────────────────────────────────
  test('Scenario: Adding a product to the cart updates the cart', async ({ productsPage, page }) => {
    await Given('I am on the Products page', async () => {
      await productsPage.goto();
    });

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
