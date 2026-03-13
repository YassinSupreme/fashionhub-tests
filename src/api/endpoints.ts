/**
 * endpoints.ts
 * ------------
 * Central registry of all FashionHub API endpoint paths.
 *
 * Usage:
 *   import { ENDPOINTS } from './endpoints';
 *   const res = await client.get(ENDPOINTS.products.list);
 *
 * When the real API is available, update the values here —
 * all tests pick up the change automatically.
 */
export const ENDPOINTS = {
  auth: {
    /** POST — authenticate and receive a token */
    login:  '/auth/login',
    /** POST — invalidate the current session */
    logout: '/auth/logout',
  },
  products: {
    /** GET — list all products */
    list:        '/products',
    /** GET — single product by ID (:id placeholder) */
    byId:        (id: string | number) => `/products/${id}`,
  },
  cart: {
    /** GET  — retrieve the current cart */
    get:         '/cart',
    /** POST — add an item to the cart */
    addItem:     '/cart',
    /** DELETE — remove a specific cart item */
    removeItem:  (id: string | number) => `/cart/${id}`,
    /** POST — proceed to checkout */
    checkout:    '/cart/checkout',
  },
  account: {
    /** GET — fetch the authenticated user's account info */
    me:          '/account/me',
    /** PATCH — update account details */
    update:      '/account/me',
  },
} as const;
