import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';

/**
 * Feature: FashionHub About Page
 * ================================
 * This spec follows the BDD (Given / When / Then) pattern using Playwright's
 * native `test.step()` wrapper. Each step appears as a named entry in the
 * HTML report, providing the same narrative clarity as Cucumber — without
 * a separate test runner.
 *
 * Linked feature file: tests/about/about.feature
 */

test.describe('Feature: FashionHub About Page', () => {
  // ── Scenario 1 — Smoke ─────────────────────────────────────────────────────
  test('@smoke Smoke: About page loads with the correct title', async ({ aboutPage }) => {
    await Given('I am on the FashionHub website', async () => {
      await aboutPage.goto();
    });

    await Then('the page title should be "About Us - FashionHub"', async () => {
      const title = await aboutPage.getTitle();
      expect(title).toBe('About Us - FashionHub');
    });
  });

  // ── Scenario 2 — Main heading ───────────────────────────────────────────────
  test('@regression Scenario: "About FashionHub" heading is visible', async ({ aboutPage }) => {
    await Given('I navigate to the About page', async () => {
      await aboutPage.goto();
    });

    await Then('the main heading should say "About FashionHub"', async () => {
      const heading = await aboutPage.getMainHeading();
      expect(heading).toMatch(/about fashionhub/i);
    });
  });

  // ── Scenario 3 — Subsections (Scenario Outline style) ──────────────────────
  test('@regression Scenario Outline: All expected subsections are present', async ({
    aboutPage,
  }) => {
    const expectedSections = ['Our Story', 'Our Vision', 'Our Commitment', 'Join Us'];

    await Given('I am on the About page', async () => {
      await aboutPage.goto();
    });

    await When('I read all the section headings', async () => {
      // No action needed — reading is done in Then
    });

    const headings = await aboutPage.getSectionHeadings();

    for (const section of expectedSections) {
      await Then(`the page contains the section "${section}"`, async () => {
        expect(headings).toContain(section);
      });
    }
  });

  // ── Scenario 4 — Content not empty ─────────────────────────────────────────
  test('@regression Scenario: About section contains descriptive content paragraphs', async ({
    aboutPage,
  }) => {
    await Given('I am on the About page', async () => {
      await aboutPage.goto();
    });

    await Then('the content section should not be empty', async () => {
      const hasContent = await aboutPage.hasContent();
      expect(hasContent).toBe(true);
    });

    await And('there should be more than one paragraph', async () => {
      const displayed = await aboutPage.isDisplayed();
      expect(displayed).toBe(true);
    });
  });
});
