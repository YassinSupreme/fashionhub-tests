import { chromium, FullConfig } from '@playwright/test';
import { validUser } from '../src/data/users';

/**
 * global-setup.ts
 * ---------------
 * Logs in as the valid user ONCE before the entire suite starts.
 * The resulting browser storage state is saved to playwright/.auth/user.json.
 *
 * Tests that need an authenticated session use:
 *   use: { storageState: 'playwright/.auth/user.json' }
 * in playwright.config.ts, skipping the login round-trip each time.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to login and authenticate
  const baseURL = process.env.BASE_URL ?? 'https://pocketaces2.github.io/fashionhub/';
  await page.goto(`${baseURL}login.html`);
  await page.locator('input[name="username"]').fill(validUser.username);
  await page.locator('input[name="password"]').fill(validUser.password);
  await page.locator('input[type="submit"]').click();

  // Wait until redirected to account page
  await page.waitForURL(/account/, { timeout: 15_000 });

  // Persist the authenticated session for reuse
  await context.storageState({ path: 'playwright/.auth/user.json' });

  await browser.close();
}

export default globalSetup;
