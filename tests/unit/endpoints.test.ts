import { describe, it, expect } from 'vitest';
import { ENDPOINTS } from '../../src/api/endpoints';

/**
 * Unit tests for src/api/endpoints.ts
 *
 * Ensures that all endpoint path constants and builder functions
 * produce the expected URL segments. If a path changes in endpoints.ts,
 * these tests will catch it immediately — before any E2E run.
 */
describe('ENDPOINTS — Auth', () => {
  it('login path is /auth/login', () => {
    expect(ENDPOINTS.auth.login).toBe('/auth/login');
  });

  it('logout path is /auth/logout', () => {
    expect(ENDPOINTS.auth.logout).toBe('/auth/logout');
  });
});

describe('ENDPOINTS — Products', () => {
  it('list path is /products', () => {
    expect(ENDPOINTS.products.list).toBe('/products');
  });

  it('byId builder returns /products/:id for a numeric ID', () => {
    expect(ENDPOINTS.products.byId(42)).toBe('/products/42');
  });

  it('byId builder returns /products/:id for a string ID', () => {
    expect(ENDPOINTS.products.byId('abc123')).toBe('/products/abc123');
  });
});

describe('ENDPOINTS — Cart', () => {
  it('get path is /cart', () => {
    expect(ENDPOINTS.cart.get).toBe('/cart');
  });

  it('addItem path is /cart', () => {
    expect(ENDPOINTS.cart.addItem).toBe('/cart');
  });

  it('checkout path is /cart/checkout', () => {
    expect(ENDPOINTS.cart.checkout).toBe('/cart/checkout');
  });

  it('removeItem builder returns /cart/:id', () => {
    expect(ENDPOINTS.cart.removeItem(7)).toBe('/cart/7');
  });

  it('removeItem builder works with a string ID', () => {
    expect(ENDPOINTS.cart.removeItem('item-uuid')).toBe('/cart/item-uuid');
  });
});

describe('ENDPOINTS — Account', () => {
  it('me path is /account/me', () => {
    expect(ENDPOINTS.account.me).toBe('/account/me');
  });

  it('update path is /account/me', () => {
    expect(ENDPOINTS.account.update).toBe('/account/me');
  });
});
