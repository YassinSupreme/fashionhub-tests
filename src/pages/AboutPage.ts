import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AboutPage
 * ---------
 * Encapsulates all interactions with the FashionHub About page.
 *
 * Key DOM selectors (from live inspection):
 *   - Main heading:      .about-banner h1  → "About FashionHub"
 *   - Section headings:  .about-content h2  → "Our Story", "Our Vision", etc.
 *   - Content paras:     .about-content p
 */
export class AboutPage extends BasePage {
  private readonly mainHeading: Locator;
  private readonly sectionHeadings: Locator;
  private readonly contentParagraphs: Locator;

  static readonly PATH = 'about.html';
  static readonly URL_PATTERN = /about\.html/;

  constructor(page: Page) {
    super(page);
    this.mainHeading       = page.locator('.about-banner h1');
    this.sectionHeadings   = page.locator('.about-content h2');
    this.contentParagraphs = page.locator('.about-content p');
  }

  async goto(): Promise<void> {
    await this.navigate(AboutPage.PATH);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Returns the text of the primary "About FashionHub" heading. */
  async getMainHeading(): Promise<string> {
    await this.mainHeading.waitFor({ state: 'visible' });
    return this.mainHeading.innerText();
  }

  /** Returns all subsection heading texts (Our Story, Our Vision, etc.). */
  async getSectionHeadings(): Promise<string[]> {
    return this.sectionHeadings.allInnerTexts();
  }

  /** Returns true if the about content section has paragraphs. */
  async hasContent(): Promise<boolean> {
    const count = await this.contentParagraphs.count();
    return count > 0;
  }

  /** Returns true when the main heading is visible. */
  async isDisplayed(): Promise<boolean> {
    return this.mainHeading.isVisible();
  }
}
