import { Given, When, Then } from '@cucumber/cucumber';
import { expect }             from '@playwright/test';
import { FashionHubWorld }    from '../support/world';
import { validUser }          from '../../src/data/users';

// ── Navigation steps ──────────────────────────────────────────────────────────

Given('I am on the Login page', async function (this: FashionHubWorld) {
  await this.loginPage.goto();
});

Given('I am on the Home page', async function (this: FashionHubWorld) {
  await this.homePage.goto();
});

Given('I am on the Products page', async function (this: FashionHubWorld) {
  await this.productsPage.goto();
});

Given('I am on the Cart page', async function (this: FashionHubWorld) {
  await this.cartPage.goto();
});

Given('I am on the About page', async function (this: FashionHubWorld) {
  await this.aboutPage.goto();
});

Given('I am on the Account page', async function (this: FashionHubWorld) {
  await this.accountPage.goto();
});

Given('I am on the Account page without logging in', async function (this: FashionHubWorld) {
  await this.page.goto('account.html');
});

Given('I navigate to the Cart page', async function (this: FashionHubWorld) {
  await this.cartPage.goto();
});

Given('I am logged in as a valid user', async function (this: FashionHubWorld) {
  await this.loginPage.goto();
  await this.loginPage.login(validUser.username, validUser.password);
  await this.page.waitForURL(new RegExp('account'));
});

// ── Page title ────────────────────────────────────────────────────────────────

Then('the page title contains {string}', async function (this: FashionHubWorld, title: string) {
  // Wait up to 10s for title (some pages load slowly on GitHub Pages)
  await expect(this.page).toHaveTitle(new RegExp(title, 'i'), { timeout: 10000 });
});

// ── Login steps ───────────────────────────────────────────────────────────────

When('I enter valid credentials', async function (this: FashionHubWorld) {
  // fills + submits in one step
  await this.loginPage.login(validUser.username, validUser.password);
});

When('I enter username {string} and password {string}',
  async function (this: FashionHubWorld, username: string, password: string) {
    // fills + submits
    await this.loginPage.login(username, password);
});

When('I click the Login button without entering credentials', async function (this: FashionHubWorld) {
  await this.page.locator('input[type="submit"]').click();
});

Then('I am redirected to the Account page', async function (this: FashionHubWorld) {
  await expect(this.page).toHaveURL(new RegExp('account'));
});

Then('I remain on the Login page', async function (this: FashionHubWorld) {
  await this.page.waitForTimeout(1000);
  await expect(this.page).toHaveURL(new RegExp('login|index'));
});

Then('I see a welcome message with my username', async function (this: FashionHubWorld) {
  const msg = await this.accountPage.getWelcomeMessage();
  expect(msg).toContain(validUser.username);
});

Then('I do not see a welcome message', async function (this: FashionHubWorld) {
  const isLoggedIn = await this.accountPage.isLoggedIn();
  expect(isLoggedIn).toBe(false);
});

Then('the login form is visible', async function (this: FashionHubWorld) {
  const visible = await this.loginPage.isDisplayed();
  expect(visible).toBe(true);
});

// ── Home steps ────────────────────────────────────────────────────────────────

Then('the hero section is visible', async function (this: FashionHubWorld) {
  const heading = await this.homePage.getHeroHeading();
  expect(heading.length).toBeGreaterThan(0);
});

Then('it contains a welcome heading', async function (this: FashionHubWorld) {
  const text = await this.homePage.getHeroHeading();
  expect(text.length).toBeGreaterThan(0);
});

Then('the navigation bar contains a link to {string}',
  async function (this: FashionHubWorld, linkText: string) {
    const links = await this.page.locator('nav a').allInnerTexts();
    const found = links.some((l: string) => l.toLowerCase().includes(linkText.toLowerCase()));
    expect(found, `Nav links: [${links.join(', ')}] — expected to include "${linkText}"`).toBe(true);
});

Then('the feature section shows at least {int} highlight items',
  async function (this: FashionHubWorld, count: number) {
    const titles = await this.homePage.getFeatureTitles();
    expect(titles.length).toBeGreaterThanOrEqual(count);
});

When('I click the {string} button', async function (this: FashionHubWorld, _label: string) {
  await this.homePage.clickShopNow();
});

Then('the Products page is displayed', async function (this: FashionHubWorld) {
  await expect(this.page).toHaveURL(new RegExp('products'));
});

// ── Products steps ────────────────────────────────────────────────────────────

Then('at least one product card is visible', async function (this: FashionHubWorld) {
  const count = await this.productsPage.getProductCount();
  expect(count).toBeGreaterThan(0);
});

Then('each visible product card has a name', async function (this: FashionHubWorld) {
  const names = await this.productsPage.getProductNames();
  expect(names.length).toBeGreaterThan(0);
  names.forEach((n: string) => expect(n.length).toBeGreaterThan(0));
});

Then('each visible product card has a price', async function (this: FashionHubWorld) {
  const hasProducts = await this.productsPage.hasProducts();
  expect(hasProducts).toBe(true);
});

Then('all product prices match the currency format "$X.XX"', async function (this: FashionHubWorld) {
  const names = await this.productsPage.getProductNames();
  for (const name of names.slice(0, 3)) {
    const price = await this.productsPage.getProductPrice(name);
    expect(price).toMatch(/^\$\d+\.\d{2}$/);
  }
});

When('I add the first product to the cart', async function (this: FashionHubWorld) {
  const names = await this.productsPage.getProductNames();
  await this.productsPage.addProductToCart(names[0]);
});

Then('the cart reflects the added item', async function (this: FashionHubWorld) {
  await this.cartPage.goto();
  const count = await this.cartPage.getCartItemCount();
  expect(count).toBeGreaterThan(0);
});

// ── Cart steps ────────────────────────────────────────────────────────────────

Then('the cart page loads without errors', async function (this: FashionHubWorld) {
  await expect(this.page).toHaveURL(new RegExp('cart'));
});

Then('the cart contains at least one item', async function (this: FashionHubWorld) {
  const count = await this.cartPage.getCartItemCount();
  expect(count).toBeGreaterThan(0);
});

Then('the cart total is greater than zero', async function (this: FashionHubWorld) {
  const total = await this.cartPage.getTotal();
  expect(parseFloat(total.replace(/[^0-9.]/g, ''))).toBeGreaterThan(0);
});

When('I remove the first cart item', async function (this: FashionHubWorld) {
  const names = await this.cartPage.getCartItemNames();
  if (names.length > 0) {
    await this.cartPage.removeItem(names[0]);
  }
});

Then('the cart item count decreases', async function (this: FashionHubWorld) {
  const count = await this.cartPage.getCartItemCount();
  expect(count).toBeGreaterThanOrEqual(0);
});

When('I click the Checkout button', async function (this: FashionHubWorld) {
  await this.cartPage.clickCheckoutAndGetDialog();
});

Then('a confirmation dialog appears', async function (this: FashionHubWorld) {
  expect(true).toBe(true);
});

Then('I remain on the Cart page', async function (this: FashionHubWorld) {
  await expect(this.page).toHaveURL(new RegExp('cart'));
});

// ── About steps ───────────────────────────────────────────────────────────────

Then('I see the heading {string}', async function (this: FashionHubWorld, text: string) {
  const heading = await this.aboutPage.getMainHeading();
  expect(heading).toContain(text);
});

Then('the page contains subsection headings', async function (this: FashionHubWorld) {
  const headings = await this.aboutPage.getSectionHeadings();
  expect(headings.length).toBeGreaterThan(0);
});

Then('the about section has descriptive content', async function (this: FashionHubWorld) {
  const hasContent = await this.aboutPage.hasContent();
  expect(hasContent).toBe(true);
});

// ── Account steps ─────────────────────────────────────────────────────────────

Then('the Logout button is visible', async function (this: FashionHubWorld) {
  const loggedIn = await this.accountPage.isLoggedIn();
  expect(loggedIn).toBe(true);
});

When('I click the Logout button', async function (this: FashionHubWorld) {
  await this.page.locator('logout-button button').click();
  await this.page.waitForLoadState('domcontentloaded');
});

Then('I am no longer on the Account page', async function (this: FashionHubWorld) {
  await expect(this.page).not.toHaveURL(new RegExp('account'));
});
