import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage
 * ---------
 * Encapsulates all interactions with the FashionHub login page (/login.html).
 *
 * Selectors are based on the live page DOM:
 *   - Username input:  #username
 *   - Password input:  #password
 *   - Submit button:   input[type="submit"]
 */
export class LoginPage extends BasePage {
  // ── Locators ────────────────────────────────────────────────────────────
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly loginForm: Locator;

  static readonly PATH = 'login.html';

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('input[type="submit"]');
    this.loginForm = page.locator('#loginForm');
  }

  // ── Actions ─────────────────────────────────────────────────────────────

  /**
   * Navigate to the login page.
   */
  async goto(): Promise<void> {
    await this.navigate(LoginPage.PATH);
    // Wait for DOM to be fully parsed (faster and more reliable than waitForSelector on static pages)
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fill in credentials and submit the login form.
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /**
   * Returns true when the login form is visible on the page.
   */
  async isDisplayed(): Promise<boolean> {
    return this.loginForm.isVisible();
  }

  /**
   * Returns the current value of the username field.
   */
  async getUsernameValue(): Promise<string> {
    return this.usernameInput.inputValue();
  }
}
