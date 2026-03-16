import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';

/**
 * Feature: Shopping Cart Page
 *
 * Tests the FashionHub cart page using Given / When / Then BDD style.
 * Linked feature file: tests/cart/cart.feature
 */
test.describe('Feature: FashionHub Shopping Cart', () => {
  // ── Scenario 1 — Smoke ──────────────────────────────────────────────────────
  test('@smoke Smoke: Cart page loads with the correct title', async ({ cartPage }) => {
    await Given('I navigate to the Cart page', async () => {
      await cartPage.goto();
    });

    await Then('the page title should be "Shopping Cart - FashionHub"', async () => {
      const title = await cartPage.getTitle();
      expect(title).toBe('Shopping Cart - FashionHub');
    });
  });

  // ── Scenario 2 — Empty cart ───────────────────────────────────────────────────
  test('@regression Scenario: Visiting an empty cart is gracefully handled', async ({
    cartPage,
  }) => {
    await Given('I am on the Cart page with no items', async () => {
      await cartPage.goto();
    });

    await Then('the page should load without errors', async () => {
      const url = cartPage.getCurrentUrl();
      expect(url).toMatch(/cart\.html/);
    });
  });

  // ── Scenario 3 — Item appears after Add to Cart ───────────────────────────────
  test('@regression Scenario: Adding a product shows it in the cart', async ({
    productsPage,
    cartPage,
  }) => {
    await Given('I am on the Products page', async () => {
      await productsPage.goto();
    });

    await When('I add "Peacock Coat" to the cart', async () => {
      await productsPage.addProductToCart('Peacock Coat');
    });

    await And('I navigate to the Cart page', async () => {
      await cartPage.goto();
    });

    await Then('the cart should contain at least one item', async () => {
      const itemCount = await cartPage.getCartItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });

    await And('"Peacock Coat" should appear in the cart item list', async () => {
      const itemNames = await cartPage.getCartItemNames();
      expect(itemNames).toContain('Peacock Coat');
    });
  });

  // ── Scenario 4 — Cart total ────────────────────────────────────────────────────
  test('@regression Scenario: Cart displays a total amount after adding a product', async ({
    productsPage,
    cartPage,
  }) => {
    await Given('a product has been added to the cart', async () => {
      await productsPage.goto();
      await productsPage.addProductToCart('Peacock Coat');
      await cartPage.goto();
    });

    await Then('the total should display a valid dollar amount', async () => {
      const total = await cartPage.getTotal();
      expect(total).toMatch(/\$\d+\.\d{2}/);
    });
  });

  // ── Scenario 5 — Remove item ──────────────────────────────────────────────────
  test('@regression Scenario: Removing an item decreases the cart count', async ({
    productsPage,
    cartPage,
  }) => {
    await Given('"Peacock Coat" is in the cart', async () => {
      await productsPage.goto();
      await productsPage.addProductToCart('Peacock Coat');
      await cartPage.goto();
    });

    const countBefore = await cartPage.getCartItemCount();

    await When('I click the remove button for "Peacock Coat"', async () => {
      await cartPage.removeItem('Peacock Coat');
    });

    await Then('the cart item count should decrease by one', async () => {
      const countAfter = await cartPage.getCartItemCount();
      expect(countAfter).toBe(countBefore - 1);
    });
  });

  // ── Scenario 6 — Checkout ─────────────────────────────────────────────────────
  test('@regression Scenario: Checkout triggers a confirmation dialog and stays on cart', async ({
    productsPage,
    cartPage,
  }) => {
    await Given('at least one product is in the cart', async () => {
      await productsPage.goto();
      await productsPage.addProductToCart('Peacock Coat');
      await cartPage.goto();
      expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);
    });

    await When('I click the Checkout button', async () => {
      // clickCheckoutAndGetDialog auto-accepts the dialog and returns its message
    });

    await Then('a confirmation dialog should appear', async () => {
      const dialogMessage = await cartPage.clickCheckoutAndGetDialog();
      expect(dialogMessage).toMatch(/proceeding to checkout/i);
    });

    await And('I should remain on the Cart page', async () => {
      await expect(cartPage.page).toHaveURL(/cart\.html/);
    });
  });
});
