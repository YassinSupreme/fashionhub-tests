/* eslint-disable no-console */
/**
 * Environment URL resolution
 *
 * Priority (highest → lowest):
 *   1. BASE_URL environment variable  (CLI / CI direct injection)
 *   2. TEST_ENV environment variable  (name-to-URL mapping)
 *   3. .env file values               (loaded by dotenv in playwright.config.ts)
 *   4. Default: production URL
 *
 * Environments:
 *   local      → http://fashionhub-app:4000/fashionhub/
 *                (Docker internal service name — used by playwright-tests
 *                 container when running via docker compose)
 *   production → https://pocketaces2.github.io/fashionhub/ (default)
 *   staging    → https://staging-env/fashionhub/
 *
 * Running locally against Docker app (from host machine):
 *   BASE_URL=http://localhost:4000/fashionhub/ npm test
 * Running inside docker compose:
 *   TEST_ENV=local (set automatically by docker-compose.yml)
 */

export const ENVIRONMENTS: Record<string, string> = {
  // Used inside docker compose — Playwright container reaches the app
  // via Docker's internal DNS using the service name 'fashionhub-app'.
  local:      'http://fashionhub-app:4000/fashionhub/',
  staging:    'https://staging-env/fashionhub/',
  production: 'https://pocketaces2.github.io/fashionhub/',
};

export const DEFAULT_ENV = 'production';

/**
 * Returns the resolved base URL to use for the test run.
 * Logs the resolution source so CI output is clear.
 */
export function resolveBaseUrl(): string {
  // 1. Explicit BASE_URL wins always
  if (process.env.BASE_URL) {
    console.info(`[env] Using BASE_URL from environment variable: ${process.env.BASE_URL}`);
    return process.env.BASE_URL;
  }

  // 2. Named environment (TEST_ENV)
  if (process.env.TEST_ENV) {
    const url = ENVIRONMENTS[process.env.TEST_ENV];
    if (!url) {
      const valid = Object.keys(ENVIRONMENTS).join(', ');
      throw new Error(`[env] Unknown TEST_ENV "${process.env.TEST_ENV}". Valid values: ${valid}`);
    }
    console.info(`[env] Using TEST_ENV "${process.env.TEST_ENV}": ${url}`);
    return url;
  }

  // 3. Fallback to default environment
  const fallbackUrl = ENVIRONMENTS[DEFAULT_ENV];
  console.info(`[env] No environment specified — defaulting to "${DEFAULT_ENV}": ${fallbackUrl}`);
  return fallbackUrl;
}
