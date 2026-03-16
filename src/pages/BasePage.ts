import { Page } from '@playwright/test';

/**
 * BasePage
 * -----------
 * Abstract base for all Page Object classes.
 * Provides shared navigation helpers and common interactions.
 *
 * Design principles:
 *   - The raw `page` property is intentionally protected, not public.
 *     Tests should interact with the page exclusively through the typed
 *     methods on each Page Object — keeping the API surface clean and
 *     ensuring refactors of selectors/page structure stay inside page objects.
 *   - Use screenshot() from this base class instead of page.screenshot()
 *     directly in tests, so the implementation detail stays encapsulated.
 */
export abstract class BasePage {
  /** Intentionally protected — tests should use typed PO methods, not raw `page`. */
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a page-relative path.
   * Relies on Playwright's built-in `retries` config (set in playwright.config.ts)
   * and `navigationTimeout` to handle transient network errors — no manual
   * retry loop or arbitrary sleeps needed here.
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /** Returns the current page title. */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Returns the current page URL. */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Takes a screenshot of the current page and returns it as a Buffer.
   * Use this in afterEach failure hooks instead of accessing raw `page`
   * from test files — keeps the `page` property encapsulated in the PO layer.
   */
  async screenshot(): Promise<Buffer> {
    return this.page.screenshot();
  }

  /**
   * Wait for the network to be idle (useful after form submissions).
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
