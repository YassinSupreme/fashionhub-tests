import { test, expect } from '../../src/fixtures/index';

/**
 * Feature: About Page
 *
 * Tests the FashionHub About page covering:
 *   🟡 Smoke:     page loads with correct title
 *   ✅ Happy Path: heading, subsections, non-empty content
 */
test.describe('Feature: FashionHub About Page', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 1 — Smoke
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Smoke: About page loads with the correct title',
    async ({ aboutPage }) => {
      await aboutPage.goto();

      const title = await aboutPage.getTitle();
      expect(title).toBe('About Us - FashionHub');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 2 — Main heading
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: "About FashionHub" heading is visible',
    async ({ aboutPage }) => {
      await aboutPage.goto();

      const heading = await aboutPage.getMainHeading();
      expect(heading).toMatch(/about fashionhub/i);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 3 — Subsections
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: All expected subsections are present',
    async ({ aboutPage }) => {
      await aboutPage.goto();

      const headings = await aboutPage.getSectionHeadings();
      expect(headings).toContain('Our Story');
      expect(headings).toContain('Our Vision');
      expect(headings).toContain('Our Commitment');
      expect(headings).toContain('Join Us');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 4 — Content is not empty
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: About section contains descriptive content paragraphs',
    async ({ aboutPage }) => {
      await aboutPage.goto();

      const hasContent = await aboutPage.hasContent();
      expect(hasContent).toBe(true);
    },
  );
});
