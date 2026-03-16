/**
 * src/factories/index.ts
 * -----------------------
 * Single source of truth for all test data used across spec files.
 *
 * Importing from here instead of hard-coding strings makes it trivial to
 * update product names, credentials, or expected values in one place.
 */
import { validUser, invalidUsers } from '../data/users';

// ── Products ──────────────────────────────────────────────────────────────────
export const PRODUCTS = {
  coat: { name: 'Peacock Coat', price: '$49.99' },
  casual: { name: 'Casual Coat', price: '$59.99' },
  jacket: { name: 'Puffer Jacket', price: '$69.99' },
} as const;

// ── Users ─────────────────────────────────────────────────────────────────────
export const USERS = {
  valid: validUser,
  wrongPassword: invalidUsers.wrongPassword,
  wrongUsername: invalidUsers.wrongUsername,
} as const;

// ── Expected page titles ──────────────────────────────────────────────────────
export const PAGE_TITLES = {
  home: 'Home - FashionHub',
  login: 'Login - FashionHub',
  account: 'My Account - FashionHub',
  products: 'Products - FashionHub',
  cart: 'Shopping Cart - FashionHub',
  about: 'About Us - FashionHub',
} as const;

// ── Expected navigation links ─────────────────────────────────────────────────
export const NAV_LINKS = ['Home', 'Account', 'Clothing', 'Shopping bag', 'About'] as const;

// ── About page sections ───────────────────────────────────────────────────────
export const ABOUT_SECTIONS = ['Our Story', 'Our Vision', 'Our Commitment', 'Join Us'] as const;
