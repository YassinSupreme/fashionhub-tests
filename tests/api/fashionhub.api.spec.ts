import { test, expect } from '../../src/fixtures/index';

/**
 * FashionHub REST API Test Suite
 * --------------------------------
 * Full test scenarios for the FashionHub backend API.
 *
 * STATUS: Stubbed — awaiting real API availability.
 *
 * Each test describes the intended behaviour and the apiClient calls needed.
 * Remove test.skip() and fill in API_BASE_URL in .env once the API is live.
 *
 * Run with:
 *   API_BASE_URL=https://your-api.example.com npx playwright test tests/api/fashionhub.api.spec.ts --project=api
 *
 * How to activate:
 *   1. Set API_BASE_URL in your .env file (see .env.example)
 *   2. Remove the test.skip() call from each test you want to enable
 *   3. Adjust expected values to match the real API contract
 */

test.describe('FashionHub API: Authentication', () => {

  test.skip('POST /auth/login with valid credentials returns token', async ({ apiClient }) => {
    // Given valid credentials
    const credentials = { username: 'demouser', password: 'fashion123' };

    // When the user logs in
    const body = await apiClient.login(credentials);

    // Then a token should be returned
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
    expect(body.username).toBe(credentials.username);
  });

  test.skip('POST /auth/login with invalid credentials returns 401', async ({ request }) => {
    const apiBaseUrl = process.env.API_BASE_URL ?? '';
    const res = await request.post(`${apiBaseUrl}/auth/login`, {
      data: { username: 'wronguser', password: 'wrongpass' },
    });

    expect(res.status()).toBe(401);
  });
});

test.describe('FashionHub API: Products', () => {

  test.skip('GET /products returns a list of products', async ({ apiClient }) => {
    const body = await apiClient.getProducts();

    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expect(typeof body.total).toBe('number');

    // Each product should have required fields
    for (const product of body.products) {
      expect(typeof product.id).toBeTruthy();
      expect(typeof product.name).toBe('string');
      expect(typeof product.price).toBe('number');
    }
  });

  test.skip('GET /products/:id returns a single product', async ({ apiClient }) => {
    // TODO: Replace 1 with a known product ID from your test data
    const product = await apiClient.getProductById(1);

    expect(product.id).toBeTruthy();
    expect(typeof product.name).toBe('string');
    expect(typeof product.price).toBe('number');
  });

  test.skip('GET /products/:id with non-existent ID returns 404', async ({ request }) => {
    const apiBaseUrl = process.env.API_BASE_URL ?? '';
    const res = await request.get(`${apiBaseUrl}/products/99999999`);
    expect(res.status()).toBe(404);
  });
});

test.describe('FashionHub API: Shopping Cart', () => {

  test.skip('POST /cart adds a product to the cart', async ({ apiClient }) => {
    // Authenticate first
    await apiClient.login({ username: 'demouser', password: 'fashion123' });

    // Add a product (TODO: replace productId with a real ID)
    const item = await apiClient.addToCart({ productId: 1, quantity: 1 });

    expect(item.productId).toBeTruthy();
    expect(item.quantity).toBe(1);
  });

  test.skip('GET /cart returns the current cart contents', async ({ apiClient }) => {
    await apiClient.login({ username: 'demouser', password: 'fashion123' });
    const cart = await apiClient.getCart();

    expect(Array.isArray(cart.items)).toBe(true);
    expect(typeof cart.totalPrice).toBe('number');
  });

  test.skip('DELETE /cart/:id removes an item from the cart', async ({ apiClient }) => {
    await apiClient.login({ username: 'demouser', password: 'fashion123' });

    // Add an item first, then immediately remove it
    const item = await apiClient.addToCart({ productId: 1, quantity: 1 });
    await apiClient.removeFromCart(item.id); // expects 204, no error thrown

    // Verify the cart no longer contains the item
    const cart = await apiClient.getCart();
    const stillInCart = cart.items.some((i) => i.id === item.id);
    expect(stillInCart).toBe(false);
  });
});

test.describe('FashionHub API: Account', () => {

  test.skip('GET /account/me returns the logged-in user details', async ({ apiClient }) => {
    await apiClient.login({ username: 'demouser', password: 'fashion123' });
    const account = await apiClient.getAccount();

    expect(account.id).toBeTruthy();
    expect(account.username).toBe('demouser');
  });

  test.skip('GET /account/me without auth returns 401', async ({ request }) => {
    const apiBaseUrl = process.env.API_BASE_URL ?? '';
    const res = await request.get(`${apiBaseUrl}/account/me`);
    expect(res.status()).toBe(401);
  });
});
