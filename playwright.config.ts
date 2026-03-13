import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { resolveBaseUrl } from './src/utils/env';

dotenv.config();

const baseURL   = resolveBaseUrl();
const apiBaseURL = process.env.API_BASE_URL ?? '';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  // Shared defaults for all projects (can be overridden per-project)
  use: {
    baseURL,
    trace:             'on-first-retry',
    screenshot:        'only-on-failure',
    video:             'on-first-retry',
    actionTimeout:     30_000,
    navigationTimeout: 60_000,
  },

  projects: [
    // ── Browser projects (UI + performance tests) ──────────────────────────
    {
      name: 'chromium',
      use:  { ...devices['Desktop Chrome'] },
      testIgnore: ['**/api/**'],
    },
    {
      name: 'firefox',
      use:  { ...devices['Desktop Firefox'] },
      testIgnore: ['**/api/**', '**/performance/**'],
    },
    {
      name: 'webkit',
      use:  { ...devices['Desktop Safari'] },
      testIgnore: ['**/api/**', '**/performance/**'],
    },

    // ── API project (browserless, no viewport/UI) ──────────────────────────
    {
      name: 'api',
      use: {
        baseURL:    apiBaseURL,
        // No browser — API tests use the request fixture directly
        extraHTTPHeaders: {
          Accept:         'application/json',
          'Content-Type': 'application/json',
        },
      },
      testMatch: ['**/tests/api/**/*.spec.ts', '**/tests/api/**/*.api.spec.ts'],
    },
  ],

  outputDir: 'test-results',
});
