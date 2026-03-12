import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * HomePage
 * --------
 * Encapsulates all interactions with the FashionHub home page (/).
 */
export class HomePage extends BasePage {
  private readonly heroHeading: Locator;
  private readonly shopNowButton: Locator;
  private readonly nav: Locator;
  private readonly featureHeadings: Locator;

  static readonly PATH = '';

  constructor(page: Page) {
    super(page);
    this.heroHeading     = page.locator('section.hero h1');
    this.shopNowButton   = page.locator('a.cta-button');
    this.nav             = page.locator('nav');
    this.featureHeadings = page.locator('section.features h2');
  }

  async goto(): Promise<void> {
    await this.navigate(HomePage.PATH);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickShopNow(): Promise<void> {
    await this.shopNowButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickNavLink(linkText: string): Promise<void> {
    await this.nav.getByRole('link', { name: linkText }).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getHeroHeading(): Promise<string> {
    await this.heroHeading.waitFor({ state: 'visible' });
    return this.heroHeading.innerText();
  }

  async getNavLinkTexts(): Promise<string[]> {
    return this.nav.getByRole('link').allInnerTexts();
  }

  async getFeatureTitles(): Promise<string[]> {
    return this.featureHeadings.allInnerTexts();
  }

  async isShopNowVisible(): Promise<boolean> {
    return this.shopNowButton.isVisible();
  }
}
