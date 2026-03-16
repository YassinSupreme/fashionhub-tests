import { Page } from '@playwright/test';

/**
 * BasePage
 * -----------
 * Abstract base for all Page Object classes.
 * Provides shared navigation helpers and common interactions.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a page-relative path with automatic retry on network error.
   * Retries up to 2 times to handle transient GitHub Pages timeouts.
   */
  async navigate(path: string, retries = 2): Promise<void> {
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      try {
        await this.page.goto(path, { timeout: 30_000 });
        return;
      } catch (err) {
        if (attempt > retries) throw err;
        // Brief pause before retrying to allow network to recover
        await this.page.waitForTimeout(1_500);
      }
    }
  }

  /**
   * Returns the current page title.
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Returns the current page URL.
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for the network to be idle (useful after form submissions).
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
