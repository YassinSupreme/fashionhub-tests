import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ENVIRONMENTS, DEFAULT_ENV } from '../../src/utils/env';

/**
 * Unit tests for src/utils/env.ts — resolveBaseUrl()
 *
 * We import and re-require the module per test so env var overrides take effect.
 * Each test isolates itself by setting/deleting env vars in beforeEach/afterEach.
 */
describe('resolveBaseUrl()', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    // Restore env after each test
    Object.keys(process.env).forEach((key) => delete process.env[key]);
    Object.assign(process.env, ORIGINAL_ENV);
    vi.resetModules();
  });

  it('returns BASE_URL when it is set (highest priority)', async () => {
    process.env.BASE_URL = 'https://custom.example.com/';
    delete process.env.TEST_ENV;

    const { resolveBaseUrl } = await import('../../src/utils/env');
    expect(resolveBaseUrl()).toBe('https://custom.example.com/');
  });

  it('returns the mapped URL for a valid TEST_ENV', async () => {
    delete process.env.BASE_URL;
    process.env.TEST_ENV = 'local';

    const { resolveBaseUrl } = await import('../../src/utils/env');
    expect(resolveBaseUrl()).toBe(ENVIRONMENTS.local);
  });

  it('throws a descriptive error for an unknown TEST_ENV', async () => {
    delete process.env.BASE_URL;
    process.env.TEST_ENV = 'unknown_env';

    const { resolveBaseUrl } = await import('../../src/utils/env');
    expect(() => resolveBaseUrl()).toThrow(/Unknown TEST_ENV/);
    expect(() => resolveBaseUrl()).toThrow('unknown_env');
  });

  it('falls back to the production URL when no env vars are set', async () => {
    delete process.env.BASE_URL;
    delete process.env.TEST_ENV;

    const { resolveBaseUrl } = await import('../../src/utils/env');
    expect(resolveBaseUrl()).toBe(ENVIRONMENTS[DEFAULT_ENV]);
  });

  it('ENVIRONMENTS map contains local, staging, and production keys', () => {
    expect(ENVIRONMENTS).toHaveProperty('local');
    expect(ENVIRONMENTS).toHaveProperty('staging');
    expect(ENVIRONMENTS).toHaveProperty('production');
  });

  it('all environment URLs start with http', () => {
    Object.values(ENVIRONMENTS).forEach((url) => {
      expect(url).toMatch(/^https?:\/\//);
    });
  });
});
