import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { AccountPage } from '../../src/pages/AccountPage';
import { validUser } from '../../src/data/users';

/**
 * Feature: Account Page
 *
 * Hooks strategy:
 *   beforeEach — logs in as the valid user before every test via the shared
 *               loginAndGoToAccount helper, guaranteeing each test starts in
 *               an authenticated state.
 *   afterEach  — attaches a named failure screenshot.
 */
test.describe('Feature: FashionHub Account Page', () => {

  test.beforeEach(async ({ loginPage, accountPage }) => {
    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    await expect(accountPage.page).toHaveURL(AccountPage.URL_PATTERN);
  });

  test.afterEach(async ({ accountPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach(`${testInfo.title} — failure`, {
        body: await accountPage.page.screenshot(),
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
      expect(message).toContain(validUser.username);
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

  // Access control — override beforeEach by navigating directly without login
  test('@regression Scenario: Unauthenticated user sees no welcome message', async ({ accountPage }) => {
    // Navigate directly without login (overrides the beforeEach logged-in state)
    await Given('I am NOT logged in and navigate directly', async () => {
      await accountPage.navigate(AccountPage.PATH);
      await accountPage.page.waitForLoadState('domcontentloaded');
    });

    await Then('the welcome message should not be visible', async () => {
      expect(await accountPage.isLoggedIn()).toBe(false);
    });
  });
});
