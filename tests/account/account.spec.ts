import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { AccountPage } from '../../src/pages/AccountPage';
import { validUser } from '../../src/data/users';

/**
 * Feature: Account Page
 *
 * Tests the FashionHub account page using Given / When / Then BDD style.
 * Linked feature file: tests/account/account.feature
 */
test.describe('Feature: FashionHub Account Page', () => {
  // ── Shared setup helper ────────────────────────────────────────────────────
  /** Logs in with valid credentials and waits for the account page URL. */
  async function loginAndGoToAccount(
    loginPage: { goto: () => Promise<void>; login: (u: string, p: string) => Promise<void> },
    accountPage: { page: import('@playwright/test').Page },
  ) {
    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    await expect(accountPage.page).toHaveURL(AccountPage.URL_PATTERN);
  }

  // ── Scenario 1 — Smoke ──────────────────────────────────────────────────────
  test('@smoke Smoke: Account page shows correct title when logged in', async ({
    loginPage,
    accountPage,
  }) => {
    await Given('I am logged in as a valid user', async () => {
      await loginAndGoToAccount(loginPage, accountPage);
    });

    await Then('the page title should be "My Account - FashionHub"', async () => {
      const title = await accountPage.getTitle();
      expect(title).toBe('My Account - FashionHub');
    });
  });

  // ── Scenario 2 — Welcome message ─────────────────────────────────────────────
  test('@regression Scenario: Welcome message includes the logged-in username', async ({
    loginPage,
    accountPage,
  }) => {
    await Given('I am logged in as a valid user', async () => {
      await loginAndGoToAccount(loginPage, accountPage);
    });

    await Then('the welcome message should contain my username', async () => {
      const message = await accountPage.getWelcomeMessage();
      expect(message).toContain(validUser.username);
    });

    await And('it should include the word "Welcome"', async () => {
      const message = await accountPage.getWelcomeMessage();
      expect(message).toMatch(/welcome/i);
    });
  });

  // ── Scenario 3 — Logout button visible ───────────────────────────────────────
  test('@regression Scenario: Logout button is visible when logged in', async ({
    loginPage,
    accountPage,
  }) => {
    await Given('I am logged in as a valid user', async () => {
      await loginAndGoToAccount(loginPage, accountPage);
    });

    await Then('the account page should confirm I am authenticated', async () => {
      const isLoggedIn = await accountPage.isLoggedIn();
      expect(isLoggedIn).toBe(true);
    });
  });

  // ── Scenario 4 — Logout ────────────────────────────────────────────────────
  test('@regression Scenario: Clicking Logout redirects away from the account page', async ({
    loginPage,
    accountPage,
  }) => {
    await Given('I am logged in as a valid user', async () => {
      await loginAndGoToAccount(loginPage, accountPage);
    });

    await When('I click the Logout button', async () => {
      await accountPage.logout();
    });

    await Then('I should be redirected away from the Account page', async () => {
      await expect(accountPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
    });
  });

  // ── Scenario 5 — Access control ──────────────────────────────────────────────
  test('@regression Scenario: Unauthenticated user sees no welcome message', async ({
    accountPage,
  }) => {
    await Given('I am NOT logged in', async () => {
      await accountPage.navigate(AccountPage.PATH);
      await accountPage.page.waitForLoadState('domcontentloaded');
    });

    await Then('the welcome message should not be visible', async () => {
      const isLoggedIn = await accountPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });
  });
});
