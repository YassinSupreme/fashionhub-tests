import { describe, it, expect } from 'vitest';
import { PRODUCTS, USERS, PAGE_TITLES, NAV_LINKS, ABOUT_SECTIONS } from '../../src/factories/index';

/**
 * Unit tests for src/factories/index.ts
 * ---------------------------------------
 * Validates that the test data factory exports the correct shape and values.
 * These tests act as a contract — if FashionHub renames a product or changes
 * a page title, these tests will fail immediately, directing you to update
 * your test data in one place.
 */

describe('PRODUCTS factory', () => {
  it('exports three known products', () => {
    expect(Object.keys(PRODUCTS)).toHaveLength(3);
  });

  it('Peacock Coat has correct name and price', () => {
    expect(PRODUCTS.coat.name).toBe('Peacock Coat');
    expect(PRODUCTS.coat.price).toMatch(/^\$\d+\.\d{2}$/);
  });

  it('Casual Coat has correct name and price', () => {
    expect(PRODUCTS.casual.name).toBe('Casual Coat');
    expect(PRODUCTS.casual.price).toMatch(/^\$\d+\.\d{2}$/);
  });

  it('Puffer Jacket has correct name and price', () => {
    expect(PRODUCTS.jacket.name).toBe('Puffer Jacket');
    expect(PRODUCTS.jacket.price).toMatch(/^\$\d+\.\d{2}$/);
  });
});

describe('USERS factory', () => {
  it('valid user has a username and password', () => {
    expect(USERS.valid.username).toBeTruthy();
    expect(USERS.valid.password).toBeTruthy();
  });

  it('wrongPassword user has same username as valid', () => {
    expect(USERS.wrongPassword.username).toBe(USERS.valid.username);
    expect(USERS.wrongPassword.password).not.toBe(USERS.valid.password);
  });

  it('wrongUsername user has a different username from valid', () => {
    expect(USERS.wrongUsername.username).not.toBe(USERS.valid.username);
  });
});

describe('PAGE_TITLES factory', () => {
  it('every page title contains "FashionHub"', () => {
    Object.values(PAGE_TITLES).forEach(title => {
      expect(title).toMatch(/FashionHub/);
    });
  });

  it('has titles for all six pages', () => {
    expect(Object.keys(PAGE_TITLES)).toHaveLength(6);
  });
});

describe('NAV_LINKS factory', () => {
  it('contains five navigation links', () => {
    expect(NAV_LINKS).toHaveLength(5);
  });

  it('includes Home, Clothing, About', () => {
    expect(NAV_LINKS).toContain('Home');
    expect(NAV_LINKS).toContain('Clothing');
    expect(NAV_LINKS).toContain('About');
  });
});

describe('ABOUT_SECTIONS factory', () => {
  it('contains four subsection headings', () => {
    expect(ABOUT_SECTIONS).toHaveLength(4);
  });

  it('includes Our Story and Our Vision', () => {
    expect(ABOUT_SECTIONS).toContain('Our Story');
    expect(ABOUT_SECTIONS).toContain('Our Vision');
  });
});
