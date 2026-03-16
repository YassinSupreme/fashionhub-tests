import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { AccountPage } from '../../../src/pages/AccountPage';
import { HomePage } from '../../../src/pages/HomePage';
import { ProductsPage } from '../../../src/pages/ProductsPage';
import { CartPage } from '../../../src/pages/CartPage';
import { AboutPage } from '../../../src/pages/AboutPage';

/**
 * FashionHubWorld
 * ---------------
 * Custom Cucumber World that owns the Playwright browser lifecycle.
 *
 * Every scenario gets:
 *   - A fresh browser context (isolated cookies, storage)
 *   - A fresh page
 *   - Pre-built POM instances ready to use in step definitions
 *
 * The browser is launched in Before hooks and closed in After hooks (hooks.ts).
 */
export class FashionHubWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  // ── POM instances (populated after page is created in hooks.ts) ────────────
  loginPage!: LoginPage;
  accountPage!: AccountPage;
  homePage!: HomePage;
  productsPage!: ProductsPage;
  cartPage!: CartPage;
  aboutPage!: AboutPage;

  // ── Config ─────────────────────────────────────────────────────────────────
  readonly baseUrl: string;
  readonly headless: boolean;

  constructor(options: IWorldOptions) {
    super(options);
    this.baseUrl = process.env.BASE_URL ?? 'https://pocketaces2.github.io/fashionhub/';
    this.headless = process.env.HEADED !== 'true';
  }

  /** Called from the Before hook — initialises browser, context, page, and POM objects. */
  async init(): Promise<void> {
    this.browser = await chromium.launch({ headless: this.headless });
    this.context = await this.browser.newContext({ baseURL: this.baseUrl });
    this.page = await this.context.newPage();
    this.page.setDefaultNavigationTimeout(30000); // 30s for GitHub Pages

    // Instantiate all POM classes against the current page
    this.loginPage = new LoginPage(this.page);
    this.accountPage = new AccountPage(this.page);
    this.homePage = new HomePage(this.page);
    this.productsPage = new ProductsPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.aboutPage = new AboutPage(this.page);
  }

  /** Called from the After hook — closes context and browser. */
  async teardown(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(FashionHubWorld);
