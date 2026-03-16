import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import { resolveBaseUrl } from './src/utils/env';

dotenv.config();

const baseURL = resolveBaseUrl();
const apiBaseURL = process.env.API_BASE_URL ?? '';

// ── Parallel / shard tuning ─────────────────────────────────────────────────
// Override locally:  WORKERS=8 npm test
// Run a shard:       SHARD_INDEX=1 SHARD_TOTAL=4 npm test
// Filter by tag:     GREP=@smoke npm test
const workerCount = process.env.CI
  ? Number(process.env.WORKERS ?? 2)
  : Number(process.env.WORKERS ?? 4);

const shardIndex = process.env.SHARD_INDEX ? Number(process.env.SHARD_INDEX) : undefined;
const shardTotal = process.env.SHARD_TOTAL ? Number(process.env.SHARD_TOTAL) : undefined;
const shard =
  shardIndex !== undefined && shardTotal !== undefined
    ? { current: shardIndex, total: shardTotal }
    : undefined;

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/{about,auth,cart,home,products,account,performance}/**/*.spec.ts'],

  // Run every test file in its own worker when possible.
  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  // 1 retry locally to absorb transient GitHub Pages flakiness;
  // 2 retries in CI to keep the pipeline green on intermittent failures.
  retries: process.env.CI ? 2 : 1,

  // Explicit worker count — tunable via WORKERS env var.
  workers: workerCount,

  // Optional shard — driven by SHARD_INDEX / SHARD_TOTAL env vars.
  ...(shard ? { shard } : {}),

  // Optional grep — driven by GREP env var (e.g. GREP=@smoke npm test).
  ...(process.env.GREP ? { grep: new RegExp(process.env.GREP) } : {}),

  // Run global-setup once before the suite: logs in and saves storageState.
  globalSetup: './playwright/global-setup.ts',

  reporter: [
    // Blob reporter enables merging shard reports into one unified HTML report.
    ...(process.env.CI ? [['blob', { outputDir: 'blob-report' }] as ['blob', object]] : []),
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

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
      // Account tests run exclusively under the 'authenticated' project
      // (which has storageState pre-loaded). Excluding them here prevents
      // running them without a session, which would cause false failures.
      testIgnore: ['**/api/**', '**/account/**'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/api/**', '**/performance/**', '**/account/**'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['**/api/**', '**/performance/**', '**/account/**'],
    },

    // ── Authenticated project — reuses saved session, skips login ───────────
    // Account tests live here exclusively. storageState is pre-loaded by
    // global-setup.ts so no UI login happens per test.
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
