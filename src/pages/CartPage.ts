import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage
 * --------
 * Encapsulates all interactions with the FashionHub shopping cart page.
 *
 * Key DOM selectors:
 *   - Cart items:   .cart-item
 *   - Item name:    .cart-item h3
 *   - Total:        #total-price
 *   - Remove btn:   .cart-item button
 *   - Checkout btn: button:has-text("Checkout")
 *
 * Note: the Checkout button triggers a browser alert as a placeholder.
 * Use clickCheckoutAndGetDialog() to intercept and return the dialog message.
 */
export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly totalElement: Locator;
  private readonly checkoutButton: Locator;

  static readonly PATH = 'cart.html';
  static readonly URL_PATTERN = /cart\.html/;

  constructor(page: Page) {
    super(page);
    this.cartItems      = page.locator('.cart-item');
    this.totalElement   = page.locator('#total-price');
    this.checkoutButton = page.locator('button:has-text("Checkout")');
  }

  async goto(): Promise<void> {
    await this.navigate(CartPage.PATH);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Returns the number of items currently in the cart. */
  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  /** Returns an array of item name strings in the cart. */
  async getCartItemNames(): Promise<string[]> {
    return this.cartItems.locator('h3').allInnerTexts();
  }

  /** Returns the total price text, e.g. "Total: $49.99". */
  async getTotal(): Promise<string> {
    return this.totalElement.innerText();
  }

  /** Returns true if the cart has no items. */
  async isEmpty(): Promise<boolean> {
    return (await this.cartItems.count()) === 0;
  }

  /** Removes the cart item with the given name. */
  async removeItem(productName: string): Promise<void> {
    const item = this.cartItems.filter({ has: this.page.locator(`h3:text("${productName}")`) });
    await item.locator('button').click();
    await this.page.waitForTimeout(300);
  }

  /** Clicks the Checkout button (no dialog handling). */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Clicks the Checkout button and intercepts the browser alert dialog.
   * Returns the dialog message text (e.g. "Proceeding to checkout.").
   */
  async clickCheckoutAndGetDialog(): Promise<string> {
    let dialogMessage = '';
    this.page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });
    await this.checkoutButton.click();
    // Give the dialog handler time to fire
    await this.page.waitForTimeout(500);
    return dialogMessage;
  }

  /** Returns true if the Checkout button is visible. */
  async isCheckoutVisible(): Promise<boolean> {
    return this.checkoutButton.isVisible();
  }
}
