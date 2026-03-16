import { test, expect } from '../../src/fixtures/index';
import { When, Then, And } from '../../src/utils/bdd';
import { ProductsPage } from '../../src/pages/ProductsPage';

/**
 * Feature: Home Page
 *
 * Parallelism: parallel — all tests are stateless read-only navigations.
 */
test.describe('Feature: FashionHub Home Page', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ homePage, page }) => {
    await homePage.goto();
  });

  test.afterEach(async ({ homePage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await homePage.screenshot(),
        contentType: 'image/png',
      });
    }
  });

  test('@smoke Smoke: Home page loads with the correct title', async ({ homePage, page }) => {
    await Then('the page title should be "Home - FashionHub"', async () => {
      const title = await homePage.getTitle();
      expect(title).toBe('Home - FashionHub');
    });
  });

  test('@smoke Scenario: Hero section contains a welcome heading', async ({ homePage, page }) => {
    await Then('the hero heading should mention "FashionHub"', async () => {
      const heading = await homePage.getHeroHeading();
      expect(heading).toMatch(/fashionhub/i);
    });
  });

  test('@regression Scenario: Clicking Shop Now navigates to the Products page', async ({ homePage, page }) => {
    await When('I click the "Shop Now" button', async () => {
      await homePage.clickShopNow();
    });

    await Then('the URL should point to the Products page', async () => {
      await expect(page).toHaveURL(ProductsPage.URL_PATTERN);
    });
  });

  test('@regression Scenario: Navigation bar contains all expected links', async ({ homePage, page }) => {
    await Then('the nav should contain links for each main section', async () => {
      const navLinks = await homePage.getNavLinkTexts();
      expect(navLinks).toContain('Clothing');
      expect(navLinks).toContain('Shopping bag');
      expect(navLinks).toContain('About');
    });
  });

  test('@regression Scenario: Feature section displays three highlights', async ({ homePage, page }) => {
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
