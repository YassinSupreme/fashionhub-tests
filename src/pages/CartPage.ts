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

  /**
   * Removes the cart item with the given name.
   * Waits for the item to be detached from the DOM — no arbitrary timeouts.
   */
  async removeItem(productName: string): Promise<void> {
    const item = this.cartItems.filter({ has: this.page.locator(`h3:text("${productName}")`) });
    await item.locator('button').click();
    // Wait for the DOM node to be removed — deterministic, no arbitrary sleep.
    await item.waitFor({ state: 'detached' });
  }

  /** Clicks the Checkout button (no dialog handling). */
  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  /**
   * Clicks the Checkout button and intercepts the browser alert dialog.
   * Returns the dialog message text (e.g. "Proceeding to checkout.").
   *
   * Implementation note: We use page.once('dialog', ...) + a Promise wrapper
   * rather than Promise.all([waitForEvent, click()]) because the latter causes
   * a deadlock — click() waits for the page to settle, but the page can't settle
   * while the alert dialog is still open, and the dialog is only accepted inside
   * the Promise.all callback which runs after both promises resolve… never.
   *
   * The page.once pattern accepts the dialog immediately inside the event handler,
   * which unblocks click() and the browser, with no arbitrary sleep needed.
   */
  async clickCheckoutAndGetDialog(): Promise<string> {
    let dialogMessage = '';

    // Register the handler BEFORE clicking to prevent any race condition.
    // The handler accepts the dialog immediately, unblocking the browser.
    const dialogHandled = new Promise<void>((resolve) => {
      this.page.once('dialog', async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.accept();
        resolve();
      });
    });

    await this.checkoutButton.click();
    await dialogHandled; // Waits for dialog to fire and be fully handled
    return dialogMessage;
  }

  /** Returns true if the Checkout button is visible. */
  async isCheckoutVisible(): Promise<boolean> {
    return this.checkoutButton.isVisible();
  }
}
