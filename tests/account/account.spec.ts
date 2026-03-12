import { test, expect } from '../../src/fixtures/index';
import { AccountPage } from '../../src/pages/AccountPage';
import { validUser } from '../../src/data/users';

/**
 * Feature: Account Page
 *
 * Tests the FashionHub account page covering:
 *   🟡 Smoke:       logged-in account page loads with correct title
 *   ✅ Happy Path:   welcome message, logout button visible, successful logout
 *   🔒 Access ctrl: unauthenticated direct navigation redirects away
 */
test.describe('Feature: FashionHub Account Page', () => {

  // Helper: log in and land on the account page
  async function loginAndGoToAccount(loginPage: any, accountPage: any) {
    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);
    await expect(accountPage.page).toHaveURL(AccountPage.URL_PATTERN);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 1 — Smoke
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Smoke: Account page shows correct title when logged in',
    async ({ loginPage, accountPage }) => {
      await loginAndGoToAccount(loginPage, accountPage);

      const title = await accountPage.getTitle();
      expect(title).toBe('My Account - FashionHub');
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 2 — Welcome message
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Welcome message includes the logged-in username',
    async ({ loginPage, accountPage }) => {
      await loginAndGoToAccount(loginPage, accountPage);

      const message = await accountPage.getWelcomeMessage();
      expect(message).toContain(validUser.username);
      expect(message).toMatch(/welcome/i);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 3 — Logout button visible
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Logout button is visible on the account page',
    async ({ loginPage, accountPage }) => {
      await loginAndGoToAccount(loginPage, accountPage);

      const isLoggedIn = await accountPage.isLoggedIn();
      expect(isLoggedIn).toBe(true);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 4 — Successful logout
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Clicking Logout redirects user away from account page',
    async ({ loginPage, accountPage }) => {
      await loginAndGoToAccount(loginPage, accountPage);

      // When the user clicks logout
      await accountPage.logout();

      // Then they should be redirected away from the account page
      await expect(accountPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
    },
  );

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario 5 — Access control (unauthenticated)
  // ──────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Direct navigation to account page without login does not show welcome message',
    async ({ accountPage }) => {
      // Given the user is NOT logged in and navigates directly
      await accountPage.navigate(AccountPage.PATH);
      await accountPage.page.waitForLoadState('domcontentloaded');

      // Then the welcome message should not be shown (user is not authenticated)
      const isLoggedIn = await accountPage.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    },
  );
});
