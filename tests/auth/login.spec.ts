import { test, expect } from '../../src/fixtures/index';
import { Given, When, Then, And } from '../../src/utils/bdd';
import { validUser, invalidUsers } from '../../src/data/users';
import { AccountPage } from '../../src/pages/AccountPage';

/**
 * Feature: Authentication — Login
 *
 * Tests the FashionHub login flow using Given / When / Then BDD style.
 * Each step appears as a named entry in the Playwright HTML report.
 *
 * Linked feature file: tests/auth/login.feature
 */
test.describe('Feature: FashionHub Login', () => {
  // ── Scenario 1 — Happy Path ─────────────────────────────────────────────────
  test('@regression Scenario: Valid user can log in and sees a welcome message', async ({
    loginPage,
    accountPage,
  }) => {
    await Given('I am on the Login page', async () => {
      await loginPage.goto();
    });

    await When('I enter valid credentials and submit', async () => {
      await loginPage.login(validUser.username, validUser.password);
    });

    await Then('I am redirected to the Account page', async () => {
      await expect(accountPage.page).toHaveURL(AccountPage.URL_PATTERN);
    });

    await And('a welcome message containing my username is visible', async () => {
      const message = await accountPage.getWelcomeMessage();
      expect(message).toContain(validUser.username);
      expect(message).toMatch(/welcome/i);
    });
  });

  // ── Scenario 2 — Wrong password ─────────────────────────────────────────────
  test('@regression Scenario: Wrong password keeps user on the login page', async ({
    loginPage,
  }) => {
    await Given('I am on the Login page', async () => {
      await loginPage.goto();
    });

    await When('I enter a correct username but wrong password', async () => {
      await loginPage.login(
        invalidUsers.wrongPassword.username,
        invalidUsers.wrongPassword.password,
      );
    });

    await Then('I remain on the Login page', async () => {
      await expect(loginPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
    });

    await And('the login form is still visible', async () => {
      expect(await loginPage.isDisplayed()).toBe(true);
    });
  });

  // ── Scenario 3 — Wrong username ─────────────────────────────────────────────
  test('@regression Scenario: Non-existent username keeps user on the login page', async ({
    loginPage,
  }) => {
    await Given('I am on the Login page', async () => {
      await loginPage.goto();
    });

    await When('I enter an unrecognised username', async () => {
      await loginPage.login(
        invalidUsers.wrongUsername.username,
        invalidUsers.wrongUsername.password,
      );
    });

    await Then('I remain on the Login page', async () => {
      await expect(loginPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
      expect(await loginPage.isDisplayed()).toBe(true);
    });
  });

  // ── Scenario 4 — Empty fields ────────────────────────────────────────────────
  test('@regression Scenario: Submitting empty credentials does not navigate away', async ({
    loginPage,
  }) => {
    await Given('I am on the Login page', async () => {
      await loginPage.goto();
    });

    await When('I click the submit button without filling any field', async () => {
      await loginPage.page.locator('input[type="submit"]').click();
    });

    await Then('I remain on the Login page', async () => {
      await expect(loginPage.page).not.toHaveURL(AccountPage.URL_PATTERN);
      expect(await loginPage.isDisplayed()).toBe(true);
    });
  });

  // ── Scenario 5 — Smoke ──────────────────────────────────────────────────────
  test('@smoke Smoke: Login page loads and displays the login form', async ({ loginPage }) => {
    await Given('I navigate to the Login page', async () => {
      await loginPage.goto();
    });

    await Then('the page should have a title', async () => {
      const title = await loginPage.getTitle();
      expect(title).toBeTruthy();
    });

    await And('the login form should be visible', async () => {
      expect(await loginPage.isDisplayed()).toBe(true);
    });
  });
});
