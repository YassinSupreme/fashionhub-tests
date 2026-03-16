import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';

/**
 * Feature: About Page
 *
 * Hooks strategy:
 *   beforeEach — navigates to the About page so every scenario starts in the
 *               same known state (eliminates repeated goto() in each test).
 *   afterEach  — attaches a named screenshot when a test fails, complementing
 *               the global screenshot: 'only-on-failure' config with a
 *               descriptive attachment visible in the HTML report step list.
 */
test.describe('Feature: FashionHub About Page', () => {

  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.goto();
  });

  test.afterEach(async ({ aboutPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await aboutPage.page.screenshot(),
        contentType: 'image/png',
      });
    }
  });

  // ── Smoke ────────────────────────────────────────────────────────────────────
  test('@smoke Smoke: About page loads with the correct title', async ({ aboutPage }) => {
    await Then('the page title should contain "About"', async () => {
      const title = await aboutPage.getTitle();
      expect(title).toBeTruthy();
      expect(title).toMatch(/about/i);
    });
  });

  // ── Scenario 2 — Main heading ──────────────────────────────────────────────
  test('@smoke Scenario: "About FashionHub" heading is visible', async ({ aboutPage }) => {
    await Then('the main heading should say "About FashionHub"', async () => {
      const heading = await aboutPage.getMainHeading();
      expect(heading).toMatch(/about fashionhub/i);
    });
  });

  // ── Scenario 3 — Subsections Outline ──────────────────────────────────────
  const subsections = ['Our Story', 'Our Vision', 'Our Commitment', 'Join Us'];
  for (const section of subsections) {
    test(`@regression Scenario Outline: All expected subsections are present — "${section}"`, async ({ aboutPage }) => {
      await Then(`the section "${section}" should be visible`, async () => {
        const headings = await aboutPage.getSectionHeadings();
        expect(headings.some(h => h.toLowerCase().includes(section.toLowerCase()))).toBe(true);
      });
    });
  }

  // ── Scenario 4 — Content paragraphs ────────────────────────────────────────
  test('@regression Scenario: About section contains descriptive content paragraphs', async ({ aboutPage }) => {
    await Then('the about page should have content', async () => {
      expect(await aboutPage.isDisplayed()).toBe(true);
      expect(await aboutPage.hasContent()).toBe(true);
    });
  });
});
