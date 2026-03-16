import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';

/**
 * Feature: About Page
 *
 * Parallelism: parallel — all tests are stateless read-only navigations.
 */
test.describe('Feature: FashionHub About Page', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.goto();
  });

  test.afterEach(async ({ aboutPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await aboutPage.screenshot(),
        contentType: 'image/png',
      });
    }
  });

  test('@smoke Smoke: About page loads with the correct title', async ({ aboutPage }) => {
    await Then('the page title should contain "About"', async () => {
      const title = await aboutPage.getTitle();
      expect(title).toBeTruthy();
      expect(title).toMatch(/about/i);
    });
  });

  test('@smoke Scenario: "About FashionHub" heading is visible', async ({ aboutPage }) => {
    await Then('the main heading should say "About FashionHub"', async () => {
      const heading = await aboutPage.getMainHeading();
      expect(heading).toMatch(/about fashionhub/i);
    });
  });

  const subsections = ['Our Story', 'Our Vision', 'Our Commitment', 'Join Us'];
  for (const section of subsections) {
    test(`@regression Scenario Outline: All expected subsections are present — "${section}"`, async ({ aboutPage }) => {
      await Then(`the section "${section}" should be visible`, async () => {
        const headings = await aboutPage.getSectionHeadings();
        expect(headings.some(h => h.toLowerCase().includes(section.toLowerCase()))).toBe(true);
      });
    });
  }

  test('@regression Scenario: About section contains descriptive content paragraphs', async ({ aboutPage }) => {
    await Then('the about page should have content', async () => {
      expect(await aboutPage.isDisplayed()).toBe(true);
      expect(await aboutPage.hasContent()).toBe(true);
    });
  });
});
