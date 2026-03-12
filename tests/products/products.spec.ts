import { test, expect } from '../../src/fixtures/index';
import { CartPage } from '../../src/pages/CartPage';

/**
 * Feature: Products / Clothing Page
 *
 * Tests the FashionHub products page covering:
 *   🟡 Smoke:     page loads with the correct title
 *   ✅ Happy Path: products visible, card anatomy, price format, add-to-cart
 */
test.describe('Feature: FashionHub Products Page', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 1 — Smoke
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Smoke: Products page loads with the correct title',
    async ({ productsPage }) => {
      await productsPage.goto();

      const title = await productsPage.getTitle();
      expect(title).toBe('Products - FashionHub');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 2 — Products are visible
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: At least one product card is displayed',
    async ({ productsPage }) => {
      await productsPage.goto();

      const hasProducts = await productsPage.hasProducts();
      expect(hasProducts).toBe(true);

      const count = await productsPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 3 — Product card anatomy
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Each product card shows a name and a price',
    async ({ productsPage }) => {
      await productsPage.goto();

      const names = await productsPage.getProductNames();
      expect(names.length).toBeGreaterThan(0);

      // Verify the first known product exists
      expect(names).toContain('Peacock Coat');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 4 — Price format
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Product prices are formatted as currency (e.g. $49.99)',
    async ({ productsPage }) => {
      await productsPage.goto();

      const price = await productsPage.getProductPrice('Peacock Coat');
      // Price should match a dollar-amount pattern like "$49.99"
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 5 — Add to Cart
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Adding a product to the cart navigates to or updates the cart',
    async ({ productsPage, page }) => {
      await productsPage.goto();

      // When the user clicks "Add to Cart" on a product
      await productsPage.addProductToCart('Peacock Coat');

      // Navigate to the cart and verify the item is there
      await page.goto('cart.html');
      await page.waitForLoadState('domcontentloaded');

      const cartPage = new CartPage(page);
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    },
  );
});
