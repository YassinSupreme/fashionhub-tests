import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductsPage
 * ------------
 * Encapsulates all interactions with the FashionHub products / clothing page.
 *
 * Key DOM selectors:
 *   - Product cards:  .product
 *   - Product name:   .product h3
 *   - Product price:  .product p.price
 *   - Add to Cart:    .product button
 */
export class ProductsPage extends BasePage {
  private readonly productCards: Locator;

  static readonly PATH = 'products.html';
  static readonly URL_PATTERN = /products\.html/;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('.product');
  }

  async goto(): Promise<void> {
    await this.navigate(ProductsPage.PATH);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Returns the number of product cards on the page. */
  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  /** Returns an array of product name strings. */
  async getProductNames(): Promise<string[]> {
    return this.productCards.locator('h3').allInnerTexts();
  }

  /** Returns the price text of a product by its name, e.g. "$49.99". */
  async getProductPrice(productName: string): Promise<string> {
    const card = this.productCards.filter({ has: this.page.locator(`h3:text("${productName}")`) });
    return card.locator('p:not(.product-description)').innerText();
  }

  /**
   * Clicks the "Add to Cart" button for a product identified by its name.
   * Waits for the DOM to settle after the click.
   */
  async addProductToCart(productName: string): Promise<void> {
    const card = this.productCards.filter({ has: this.page.locator(`h3:text("${productName}")`) });
    await card.locator('button').click();
  }

  /** Returns true if at least one product card is visible. */
  async hasProducts(): Promise<boolean> {
    await this.productCards.first().waitFor({ state: 'visible' });
    return (await this.productCards.count()) > 0;
  }
}
