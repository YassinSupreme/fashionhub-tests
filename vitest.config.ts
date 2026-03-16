import { defineConfig } from 'vitest/config';

/**
 * vitest.config.ts
 * ----------------
 * Separate config for unit tests — runs independently from Playwright.
 *
 * Run:  npm run test:unit
 * Watch: npm run test:unit:watch
 */
export default defineConfig({
  test: {
    // Only match files inside tests/unit/
    include: ['tests/unit/**/*.test.ts'],

    // Reporters
    reporters: ['verbose'],

    // Coverage (optional: npm run test:unit:coverage)
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/pages/**', 'src/fixtures/**'],
      reporter: ['text', 'html'],
    },

    // TypeScript path aliases mirror tsconfig.json
    alias: {
      '@pages': new URL('./src/pages', import.meta.url).pathname,
      '@fixtures': new URL('./src/fixtures', import.meta.url).pathname,
      '@data': new URL('./src/data', import.meta.url).pathname,
      '@utils': new URL('./src/utils', import.meta.url).pathname,
    },
  },
});
