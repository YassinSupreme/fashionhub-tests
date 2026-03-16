import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { AccountPage } from '../../src/pages/AccountPage';
import { USERS } from '../../src/factories';

/**
 * Feature: Account Page
 *
 * Parallelism: parallel — each test runs in an isolated browser context.
 *
 * Authentication strategy:
 *   Runs under the 'authenticated' project — storageState pre-loaded by
 *   global-setup.ts so no UI login is needed per test.
 */
test.describe('Feature: FashionHub Account Page', () => {
  test.describe.configure({ mode: 'parallel' });

  test.beforeEach(async ({ accountPage }) => {
    await accountPage.goto();
    await expect(accountPage.page).toHaveURL(AccountPage.URL_PATTERN);
  });

  test.afterEach(async ({ accountPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await accountPage.screenshot(),
        contentType: 'image/png',
      });
    }
  });

  test('@smoke Smoke: Account page shows correct title when logged in', async ({ accountPage }) => {
    await Then('the page title should be "My Account - FashionHub"', async () => {
      const title = await accountPage.getTitle();
      expect(title).toBe('My Account - FashionHub');
    });
  });

  test('@smoke Scenario: Welcome message includes the logged-in username', async ({ accountPage }) => {
    await Then('the welcome message should contain my username', async () => {
      const message = await accountPage.getWelcomeMessage();
      expect(message).toContain(USERS.valid.username);
    });

    await And('it should include the word "Welcome"', async () => {
      const message = await accountPage.getWelcomeMessage();
      expect(message).toMatch(/welcome/i);
    });
  });

  test('@smoke Scenario: Logout button is visible when logged in', async ({ accountPage }) => {
    await Then('the account page should confirm I am authenticated', async () => {
      expect(await accountPage.isLoggedIn()).toBe(true);
    });
  });

  test('@regression Scenario: Clicking Logout redirects away from the account page', async ({ accountPage }) => {
    await When('I click the Logout button', async () => {
      await accountPage.logout();
    });

    await Then('I should be redirected away from the Account page', async () => {
      await expect(accountPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
    });
  });

  /**
   * Simulates unauthenticated visit by clearing localStorage and reloading.
   * The logout button is conditionally rendered based on 'isLoggedIn' in
   * localStorage — after clearing it, the button must be hidden.
   */
  test('@regression Scenario: Unauthenticated user does not see the logout button', async ({ page }) => {
    await Given('the session is cleared to simulate an unauthenticated state', async () => {
      await page.evaluate(() => localStorage.clear());
      await page.reload({ waitUntil: 'domcontentloaded' });
    });

    await Then('the logout button should not be visible', async () => {
      const logoutButton = page.locator('logout-button button');
      await expect(logoutButton).not.toBeVisible();
    });
  });
});
