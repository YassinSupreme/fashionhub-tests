import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { PRODUCTS } from '../../src/factories';

/**
 * Feature: Shopping Cart
 *
 * Parallelism: serial — cart tests mutate shared localStorage state.
 */
test.describe('Feature: FashionHub Shopping Cart', () => {
  test.describe.configure({ mode: 'serial' });

  test.afterEach(async ({ cartPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await cartPage.screenshot(),
        contentType: 'image/png',
      });
    }
  });

  test('@smoke Smoke: Cart page loads with the correct title', async ({ cartPage }) => {
    await Given('I navigate to the Cart page', async () => {
      await cartPage.goto();
    });

    await Then('the page title should be "Shopping Cart - FashionHub"', async () => {
      const title = await cartPage.getTitle();
      expect(title).toBe('Shopping Cart - FashionHub');
    });
  });

  test('@smoke Scenario: Visiting an empty cart is gracefully handled', async ({ cartPage }) => {
    await Given('I am on the Cart page with no items', async () => {
      await cartPage.goto();
    });

    await Then('the page should load without errors', async () => {
      const url = cartPage.getCurrentUrl();
      expect(url).toMatch(/cart\.html/);
    });
  });

  test('@regression Scenario: Adding a product shows it in the cart', async ({ productsPage, cartPage }) => {
    await Given('I am on the Products page', async () => {
      await productsPage.goto();
    });

    await When(`I add "${PRODUCTS.coat.name}" to the cart`, async () => {
      await productsPage.addProductToCart(PRODUCTS.coat.name);
    });

    await And('I navigate to the Cart page', async () => {
      await cartPage.goto();
    });

    await Then('the cart should contain at least one item', async () => {
      expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);
    });

    await And(`"${PRODUCTS.coat.name}" should appear in the cart item list`, async () => {
      expect(await cartPage.getCartItemNames()).toContain(PRODUCTS.coat.name);
    });
  });

  test('@regression Scenario: Cart displays a total amount after adding a product', async ({ productsPage, cartPage }) => {
    await Given('a product has been added to the cart', async () => {
      await productsPage.goto();
      await productsPage.addProductToCart(PRODUCTS.coat.name);
      await cartPage.goto();
    });

    await Then('the total should display a valid dollar amount', async () => {
      const total = await cartPage.getTotal();
      expect(total).toMatch(/\$\d+\.\d{2}/);
    });
  });

  test('@regression Scenario: Removing an item decreases the cart count', async ({ productsPage, cartPage }) => {
    await Given(`"${PRODUCTS.coat.name}" is in the cart`, async () => {
      await productsPage.goto();
      await productsPage.addProductToCart(PRODUCTS.coat.name);
      await cartPage.goto();
    });

    const countBefore = await cartPage.getCartItemCount();

    await When(`I click the remove button for "${PRODUCTS.coat.name}"`, async () => {
      await cartPage.removeItem(PRODUCTS.coat.name);
    });

    await Then('the cart item count should decrease by one', async () => {
      expect(await cartPage.getCartItemCount()).toBe(countBefore - 1);
    });
  });

  test('@regression Scenario: Checkout triggers a confirmation dialog and stays on cart', async ({ productsPage, cartPage }) => {
    await Given('at least one product is in the cart', async () => {
      await productsPage.goto();
      await productsPage.addProductToCart(PRODUCTS.coat.name);
      await cartPage.goto();
      expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);
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
