import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AccountPage
 * -----------
 * Encapsulates all interactions with the FashionHub account/dashboard page.
 *
 * Post-login DOM:
 *   - Welcome message: h2 inside div.account-page  → "Welcome, {username}!"
 *   - Logout button:   <logout-button> custom element containing a <button>
 */
export class AccountPage extends BasePage {
  // ── Locators ────────────────────────────────────────────────────────────
  private readonly welcomeHeading: Locator;
  private readonly logoutButton: Locator;

  static readonly PATH = 'account.html';
  static readonly URL_PATTERN = /account\.html/;

  constructor(page: Page) {
    super(page);
    // The welcome message is an h2 inside the .account-page container
    this.welcomeHeading = page.locator('.account-page h2');
    this.logoutButton = page.locator('logout-button button');
  }

  // ── Navigation ───────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate(AccountPage.PATH);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // ── Queries ──────────────────────────────────────────────────────────────

  /**
   * Returns the full text of the welcome message, e.g. "Welcome, demouser!"
   */
  async getWelcomeMessage(): Promise<string> {
    await this.welcomeHeading.waitFor({ state: 'visible' });
    return this.welcomeHeading.innerText();
  }

  /**
   * Returns true if the account page is displaying the welcome heading.
   */
  async isLoggedIn(): Promise<boolean> {
    return this.welcomeHeading.isVisible();
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  /**
   * Click the logout button and wait for navigation away from account page.
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
    await this.page.waitForURL((url) => !url.pathname.includes('account'));
  }
}
