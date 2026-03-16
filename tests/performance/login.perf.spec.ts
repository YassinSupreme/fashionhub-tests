/* eslint-disable no-console */
import { test, expect } from '../../src/fixtures/index';
import { AccountPage } from '../../src/pages/AccountPage';
import { USERS } from '../../src/factories';
import {
  getNavigationTimings,
  getCdpMetrics,
  measureActionTime,
} from '../../src/utils/performanceUtils';

/**
 * Performance: Login Page
 * -----------------------
 * Validates that the FashionHub login page meets defined performance budgets
 * using Playwright's built-in APIs:
 *
 *   - Navigation Timing API  (TTFB, DOM interactive, full load)
 *   - CDP page.metrics()     (JS heap, layout/style counts)
 *   - Wall-clock timing      (login action round-trip)
 *
 * Uses the shared `loginPage` fixture for page-object interactions and the
 * raw `page` fixture for performance utilities that require the Page object.
 * This is consistent with every other spec file and ensures any constructor
 * changes to LoginPage are reflected here automatically.
 *
 * NOTE: These tests are intentionally scoped to Chromium only.
 *       CDP metrics (page.metrics) require a Chromium-based browser.
 *
 * Performance Budgets
 * -------------------
 * Thresholds are generous to account for GitHub Pages latency and CI
 * network variability. Tighten them for your own production SLA.
 */

// ── Budgets (all times in milliseconds unless noted) ────────────────────────
const BUDGET = {
  pageLoad: 5_000,        // Full load event
  ttfb: 2_000,            // Time to first byte
  domInteractive: 4_000,  // DOM becomes interactive
  loginActionMs: 5_000,   // Login submit → redirect round-trip
  jsHeapMb: 50,           // JS heap used (MB)
  layoutOps: 100,         // Max layout + recalc operations
} as const;

const MB = 1024 * 1024;

// ── Spec ─────────────────────────────────────────────────────────────────────
test.describe('Performance: FashionHub Login Page', () => {

  // Navigate to the login page via fixture before each test.
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goto();
    await page.waitForLoadState('load');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Perf 1 — Full page load within budget
  // ──────────────────────────────────────────────────────────────────────────
  test('Perf: Login page load completes within budget', async ({ page }) => {
    const timings = await getNavigationTimings(page);
    console.log('[Timings] pageLoad:', timings.pageLoad, 'ms');

    expect(
      timings.pageLoad,
      `Page load ${timings.pageLoad}ms exceeds budget of ${BUDGET.pageLoad}ms`,
    ).toBeLessThan(BUDGET.pageLoad);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Perf 2 — Time to First Byte
  // ──────────────────────────────────────────────────────────────────────────
  test('Perf: Time to First Byte (TTFB) is within budget', async ({ page }) => {
    const timings = await getNavigationTimings(page);
    console.log('[Timings] TTFB:', timings.ttfb, 'ms');

    expect(timings.ttfb, `TTFB ${timings.ttfb}ms exceeds budget of ${BUDGET.ttfb}ms`).toBeLessThan(
      BUDGET.ttfb,
    );
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Perf 3 — DOM Interactive
  // ──────────────────────────────────────────────────────────────────────────
  test('Perf: DOM becomes interactive within budget', async ({ page }) => {
    const timings = await getNavigationTimings(page);
    console.log('[Timings] domInteractive:', timings.domInteractive, 'ms');

    expect(
      timings.domInteractive,
      `domInteractive ${timings.domInteractive}ms exceeds budget of ${BUDGET.domInteractive}ms`,
    ).toBeLessThan(BUDGET.domInteractive);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Perf 4 — Login action round-trip
  // ──────────────────────────────────────────────────────────────────────────
  test('Perf: Login form submission completes within budget', async ({ loginPage, page }) => {
    const elapsed = await measureActionTime(page, async () => {
      await loginPage.login(USERS.valid.username, USERS.valid.password);
      await page.waitForURL(AccountPage.URL_PATTERN);
    });

    console.log('[Action] login round-trip:', elapsed, 'ms');

    expect(
      elapsed,
      `Login action took ${elapsed}ms, exceeds budget of ${BUDGET.loginActionMs}ms`,
    ).toBeLessThan(BUDGET.loginActionMs);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Perf 5 — JS Heap size (CDP)
  // ──────────────────────────────────────────────────────────────────────────
  test('Perf: JS heap usage on login page is within budget', async ({ page }) => {
    const metrics = await getCdpMetrics(page);
    const heapMb = metrics.jsHeapUsedSize / MB;
    console.log('[CDP] JS heap used:', heapMb.toFixed(2), 'MB');

    expect(
      heapMb,
      `JS heap ${heapMb.toFixed(2)}MB exceeds budget of ${BUDGET.jsHeapMb}MB`,
    ).toBeLessThan(BUDGET.jsHeapMb);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Perf 6 — Layout / style recalculation count (CDP)
  // ──────────────────────────────────────────────────────────────────────────
  test('Perf: Layout and style recalculation operations stay within budget', async ({ page }) => {
    const metrics = await getCdpMetrics(page);
    const layoutOps = metrics.layoutCount + metrics.recalcStyleCount;
    console.log(
      '[CDP] layoutCount:', metrics.layoutCount,
      '| recalcStyleCount:', metrics.recalcStyleCount,
      '| total ops:', layoutOps,
    );

    expect(
      layoutOps,
      `Layout/recalc ops (${layoutOps}) exceed budget of ${BUDGET.layoutOps}`,
    ).toBeLessThan(BUDGET.layoutOps);
  });
});
