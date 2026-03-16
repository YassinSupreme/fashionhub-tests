import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Unit tests for src/utils/env.ts
 * --------------------------------
 * Tests the resolveBaseUrl() helper which determines the target URL
 * from environment variables (BASE_URL, TEST_ENV).
 *
 * Uses vi.stubEnv() so each test gets a clean environment without
 * polluting subsequent tests.
 */

describe('resolveBaseUrl()', () => {
  const PRODUCTION_URL = 'https://pocketaces2.github.io/fashionhub/';
  const STAGING_URL = 'https://staging-env/fashionhub/';

  beforeEach(() => {
    vi.unstubAllEnvs();
    // Clear the module cache so env changes are picked up
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('returns PRODUCTION_URL when TEST_ENV is not set', async () => {
    vi.stubEnv('TEST_ENV', '');
    vi.stubEnv('BASE_URL', '');
    const { resolveBaseUrl } = await import('../../src/utils/env');
    const url = resolveBaseUrl();
    expect(url).toBe(PRODUCTION_URL);
  });

  it('returns PRODUCTION_URL when TEST_ENV is "production"', async () => {
    vi.stubEnv('TEST_ENV', 'production');
    vi.stubEnv('BASE_URL', '');
    const { resolveBaseUrl } = await import('../../src/utils/env');
    expect(resolveBaseUrl()).toBe(PRODUCTION_URL);
  });

  it('returns STAGING_URL when TEST_ENV is "staging"', async () => {
    vi.stubEnv('TEST_ENV', 'staging');
    vi.stubEnv('BASE_URL', '');
    const { resolveBaseUrl } = await import('../../src/utils/env');
    expect(resolveBaseUrl()).toBe(STAGING_URL);
  });

  it('overrides TEST_ENV when BASE_URL is explicitly set', async () => {
    vi.stubEnv('TEST_ENV', 'production');
    vi.stubEnv('BASE_URL', 'https://custom.example.com/');
    const { resolveBaseUrl } = await import('../../src/utils/env');
    expect(resolveBaseUrl()).toBe('https://custom.example.com/');
  });
});
