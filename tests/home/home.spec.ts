import { test, expect } from '../../src/fixtures/index';
import { ProductsPage } from '../../src/pages/ProductsPage';

/**
 * Feature: Home Page
 *
 * Tests the FashionHub home page covering:
 *   �� Smoke:     page loads with the correct title
 *   ✅ Happy Path: hero heading, "Shop Now" CTA, navigation links, feature section
 */
test.describe('Feature: FashionHub Home Page', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 1 — Smoke
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Smoke: Home page loads with the correct title',
    async ({ homePage }) => {
      // Given the user navigates to the home page
      await homePage.goto();

      // Then the page title should be "Home - FashionHub"
      const title = await homePage.getTitle();
      expect(title).toBe('Home - FashionHub');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 2 — Hero heading
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Hero section is visible and contains a welcome heading',
    async ({ homePage }) => {
      // Given the user is on the home page
      await homePage.goto();

      // Then the hero heading should mention "FashionHub"
      const heading = await homePage.getHeroHeading();
      expect(heading).toMatch(/fashionhub/i);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 3 — "Shop Now" CTA
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Clicking Shop Now navigates to the Products page',
    async ({ homePage }) => {
      // Given the user is on the home page
      await homePage.goto();

      // When the user clicks "Shop Now"
      await homePage.clickShopNow();

      // Then the URL should include the products page path
      await expect(homePage.page).toHaveURL(ProductsPage.URL_PATTERN);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 4 — Navigation links
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Navigation bar contains all expected links',
    async ({ homePage }) => {
      // Given the user is on the home page
      await homePage.goto();

      // Then the navigation should contain links for each main section
      const navLinks = await homePage.getNavLinkTexts();
      expect(navLinks).toContain('Clothing');
      expect(navLinks).toContain('Shopping bag');
      expect(navLinks).toContain('About');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 5 — Feature section
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Feature section displays three highlights',
    async ({ homePage }) => {
      // Given the user is on the home page
      await homePage.goto();

      // Then 3 feature headings should be visible
      const features = await homePage.getFeatureTitles();
      expect(features.length).toBe(3);
      expect(features).toContain('Exclusive Collections');
      expect(features).toContain('Quality Craftsmanship');
      expect(features).toContain('Exceptional Service');
    },
  );
});
