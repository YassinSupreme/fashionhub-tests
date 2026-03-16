import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { ProductsPage } from '../../src/pages/ProductsPage';

/**
 * Feature: Home Page
 *
 * Tests the FashionHub home page using Given / When / Then BDD style.
 * Linked feature file: tests/home/home.feature
 */
test.describe('Feature: FashionHub Home Page', () => {

  // ── Scenario 1 — Smoke ──────────────────────────────────────────────────────
  test('Smoke: Home page loads with the correct title', async ({ homePage }) => {
    await Given('I navigate to the Home page', async () => {
      await homePage.goto();
    });

    await Then('the page title should be "Home - FashionHub"', async () => {
      const title = await homePage.getTitle();
      expect(title).toBe('Home - FashionHub');
    });
  });

  // ── Scenario 2 — Hero heading ────────────────────────────────────────────────
  test('Scenario: Hero section contains a welcome heading', async ({ homePage }) => {
    await Given('I am on the Home page', async () => {
      await homePage.goto();
    });

    await Then('the hero heading should mention "FashionHub"', async () => {
      const heading = await homePage.getHeroHeading();
      expect(heading).toMatch(/fashionhub/i);
    });
  });

  // ── Scenario 3 — Shop Now CTA ────────────────────────────────────────────────
  test('Scenario: Clicking Shop Now navigates to the Products page', async ({ homePage }) => {
    await Given('I am on the Home page', async () => {
      await homePage.goto();
    });

    await When('I click the "Shop Now" button', async () => {
      await homePage.clickShopNow();
    });

    await Then('the URL should point to the Products page', async () => {
      await expect(homePage.page).toHaveURL(ProductsPage.URL_PATTERN);
    });
  });

  // ── Scenario 4 — Navigation links ────────────────────────────────────────────
  test('Scenario: Navigation bar contains all expected links', async ({ homePage }) => {
    await Given('I am on the Home page', async () => {
      await homePage.goto();
    });

    await Then('the nav should contain links for each main section', async () => {
      const navLinks = await homePage.getNavLinkTexts();
      expect(navLinks).toContain('Clothing');
      expect(navLinks).toContain('Shopping bag');
      expect(navLinks).toContain('About');
    });
  });

  // ── Scenario 5 — Feature section ─────────────────────────────────────────────
  test('Scenario: Feature section displays three highlights', async ({ homePage }) => {
    await Given('I am on the Home page', async () => {
      await homePage.goto();
    });

    await Then('three feature headings should be visible', async () => {
      const features = await homePage.getFeatureTitles();
      expect(features.length).toBe(3);
    });

    await And('they include the expected collection highlights', async () => {
      const features = await homePage.getFeatureTitles();
      expect(features).toContain('Exclusive Collections');
      expect(features).toContain('Quality Craftsmanship');
      expect(features).toContain('Exceptional Service');
    });
  });
});
