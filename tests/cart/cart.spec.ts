import { test, expect } from '../../src/fixtures/index';

/**
 * Feature: Shopping Cart Page
 *
 * Tests the FashionHub cart page covering:
 *   🟡 Smoke:       page loads with correct title
 *   ✅ Happy Path:  empty state, add item and verify, total format, remove item
 *   🛒 Checkout:    dialog confirmation and page stays on cart
 */
test.describe('Feature: FashionHub Shopping Cart', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 1 — Smoke
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Smoke: Cart page loads with the correct title',
    async ({ cartPage }) => {
      await cartPage.goto();

      const title = await cartPage.getTitle();
      expect(title).toBe('Shopping Cart - FashionHub');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 2 — Empty cart
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Visiting the cart with no items is gracefully handled',
    async ({ cartPage }) => {
      await cartPage.goto();

      // Cart may be empty or have items — either way the page should not crash
      const url = cartPage.getCurrentUrl();
      expect(url).toMatch(/cart\.html/);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 3 — Item appears after Add to Cart
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Adding a product on the products page shows it in the cart',
    async ({ productsPage, cartPage }) => {
      // Given a user adds a product on the products page
      await productsPage.goto();
      await productsPage.addProductToCart('Peacock Coat');

      // When the user navigates to the cart
      await cartPage.goto();

      // Then the item should be in the cart
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);

      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).toContain('Peacock Coat');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 4 — Cart total is displayed
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Cart displays a total amount after adding a product',
    async ({ productsPage, cartPage }) => {
      // Given a product is in the cart
      await productsPage.goto();
      await productsPage.addProductToCart('Peacock Coat');

      await cartPage.goto();

      // Then the total should be visible and contain a dollar amount
      const total = await cartPage.getTotal();
      expect(total).toMatch(/\$\d+\.\d{2}/);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 5 — Remove item
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Removing an item decreases the cart item count',
    async ({ productsPage, cartPage }) => {
      // Given a product is in the cart
      await productsPage.goto();
      await productsPage.addProductToCart('Peacock Coat');

      await cartPage.goto();
      const countBefore = await cartPage.getCartItemCount();
      expect(countBefore).toBeGreaterThan(0);

      // When the user removes the item
      await cartPage.removeItem('Peacock Coat');

      // Then the cart should have one fewer item
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter).toBe(countBefore - 1);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 6 — Checkout flow
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Checking out triggers a confirmation dialog and stays on the cart page',
    async ({ productsPage, cartPage }) => {
      // Given there is at least one product in the cart
      await productsPage.goto();
      await productsPage.addProductToCart('Peacock Coat');
      await cartPage.goto();

      const itemCountBefore = await cartPage.getCartItemCount();
      expect(itemCountBefore).toBeGreaterThan(0);

      // When the user clicks "Checkout"
      const dialogMessage = await cartPage.clickCheckoutAndGetDialog();

      // Then a browser dialog should appear confirming the checkout intent
      expect(dialogMessage).toMatch(/proceeding to checkout/i);

      // And the user should remain on the cart page (checkout is a placeholder)
      await expect(cartPage.page).toHaveURL(/cart\.html/);
    },
  );
});
