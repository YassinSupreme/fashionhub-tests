import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { resolveBaseUrl } from './src/utils/env';

dotenv.config();

const baseURL = resolveBaseUrl();
const apiBaseURL = process.env.API_BASE_URL ?? '';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  // 1 retry locally to absorb transient GitHub Pages flakiness;
  // 2 retries in CI to keep the pipeline green on intermittent failures.
  retries: process.env.CI ? 2 : 1,

  workers: process.env.CI ? 2 : undefined,

  // Run global-setup once before the suite: logs in and saves storageState.
  globalSetup: './playwright/global-setup.ts',

  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
  },

  projects: [
    // ── Browser projects (UI + performance tests) ───────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/api/**'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/api/**', '**/performance/**'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['**/api/**', '**/performance/**'],
    },

    // ── Authenticated project — reuses saved session, skips login ───────────
    {
      name: 'authenticated',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      testMatch: ['**/tests/account/**/*.spec.ts'],
    },

    // ── API project (browserless) ───────────────────────────────────────────
    {
      name: 'api',
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      testMatch: ['**/tests/api/**/*.spec.ts'],
    },
  ],

  outputDir: 'test-results',
});
