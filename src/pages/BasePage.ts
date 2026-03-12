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
   * Navigate to a page-relative path (resolved against baseURL from config).
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
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
