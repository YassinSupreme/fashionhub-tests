import { test, expect } from '../../src/fixtures/index';
import { validUser, invalidUsers } from '../../src/data/users';
import { AccountPage } from '../../src/pages/AccountPage';

/**
 * Feature: Authentication — Login
 *
 * Tests the FashionHub login flow covering:
 *   ✅ Happy path: valid credentials → welcome message
 *   🔴 Negative:  wrong password / username → stays on login page
 *   ⚠️  Edge case: empty fields → browser validation fires
 *   🟡 Smoke:     login page loads with correct title
 */
test.describe('Feature: FashionHub Login', () => {

  // ────────────────────────────────────────────────────────────────────────
  // Scenario 1 — Happy Path (primary requirement)
  // ────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Valid user can log in and sees a welcome message with their username',
    async ({ loginPage, accountPage }) => {
      // Given a valid user navigates to the login page
      await loginPage.goto();

      // When the user provides correct credentials and submits
      await loginPage.login(validUser.username, validUser.password);

      // Then the user should be redirected to the account page
      await expect(accountPage.page).toHaveURL(AccountPage.URL_PATTERN);

      // And a welcome message containing the username should be visible
      const welcomeMessage = await accountPage.getWelcomeMessage();
      expect(welcomeMessage).toContain(validUser.username);
      expect(welcomeMessage).toMatch(/welcome/i);
    },
  );

  // ────────────────────────────────────────────────────────────────────────
  // Scenario 2 — Wrong password
  // ────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: User with wrong password stays on login page',
    async ({ loginPage }) => {
      // Given the user is on the login page
      await loginPage.goto();

      // When the user enters an incorrect password
      await loginPage.login(
        invalidUsers.wrongPassword.username,
        invalidUsers.wrongPassword.password,
      );

      // Then the user should remain on the login page (not redirected)
      await expect(loginPage.page).not.toHaveURL(AccountPage.URL_PATTERN);

      // And the login form should still be visible
      expect(await loginPage.isDisplayed()).toBe(true);
    },
  );

  // ────────────────────────────────────────────────────────────────────────
  // Scenario 3 — Wrong username
  // ────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Non-existent username stays on login page',
    async ({ loginPage }) => {
      // Given the user is on the login page
      await loginPage.goto();

      // When the user enters an unrecognised username
      await loginPage.login(
        invalidUsers.wrongUsername.username,
        invalidUsers.wrongUsername.password,
      );

      // Then the user should remain on the login page
      await expect(loginPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
      expect(await loginPage.isDisplayed()).toBe(true);
    },
  );

  // ────────────────────────────────────────────────────────────────────────
  // Scenario 4 — Empty fields (HTML5 required validation)
  // ────────────────────────────────────────────────────────────────────────
  test(
    'Scenario: Submitting empty credentials does not navigate away from login',
    async ({ loginPage }) => {
      // Given the user is on the login page
      await loginPage.goto();

      // When the user submits the form without filling any fields
      // (HTML5 required attribute prevents submission — page stays put)
      await loginPage.page.locator('input[type="submit"]').click();

      // Then the user should still be on the login page
      await expect(loginPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
      expect(await loginPage.isDisplayed()).toBe(true);
    },
  );

  // ────────────────────────────────────────────────────────────────────────
  // Scenario 5 — Smoke: login page loads correctly
  // ────────────────────────────────────────────────────────────────────────
  test(
    'Smoke: Login page loads and displays the login form',
    async ({ loginPage }) => {
      // Given the user navigates to the login page
      await loginPage.goto();

      // Then the page should have loaded (has a title)
      const title = await loginPage.getTitle();
      expect(title).toBeTruthy();

      // And the login form should be visible — confirming we're on the right page
      expect(await loginPage.isDisplayed()).toBe(true);
    },
  );
});
