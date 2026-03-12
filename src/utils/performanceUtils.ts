import { Page } from '@playwright/test';

// ── Types ────────────────────────────────────────────────────────────────────

export interface NavigationTimings {
  /** DNS look-up duration (ms) */
  dnsLookup: number;
  /** TCP connection duration (ms) */
  tcpConnect: number;
  /** Time to First Byte: from request start to first byte received (ms) */
  ttfb: number;
  /** Time from navigationStart until the DOM became interactive (ms) */
  domInteractive: number;
  /** Time from navigationStart until DOMContentLoaded fired (ms) */
  domContentLoaded: number;
  /** Full page load time from navigationStart (ms) */
  pageLoad: number;
}

export interface CdpMetrics {
  /** Total JS task CPU time (s) */
  taskDuration: number;
  /** Total script evaluation time (s) */
  scriptDuration: number;
  /** Total layout time (s) */
  layoutDuration: number;
  /** Number of layout passes triggered */
  layoutCount: number;
  /** Number of style-recalculation passes */
  recalcStyleCount: number;
  /** Current JS heap used (bytes) */
  jsHeapUsedSize: number;
  /** Total JS heap size (bytes) */
  jsHeapTotalSize: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns Navigation Timing metrics via the browser's Performance API.
 * Must be called after the page has fully loaded.
 */
export async function getNavigationTimings(page: Page): Promise<NavigationTimings> {
  return page.evaluate(() => {
    const [entry] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];

    if (!entry) {
      throw new Error('No navigation timing entry found. Has the page loaded?');
    }

    return {
      dnsLookup:        Math.round(entry.domainLookupEnd  - entry.domainLookupStart),
      tcpConnect:       Math.round(entry.connectEnd        - entry.connectStart),
      ttfb:             Math.round(entry.responseStart     - entry.requestStart),
      domInteractive:   Math.round(entry.domInteractive),
      domContentLoaded: Math.round(entry.domContentLoadedEventEnd),
      pageLoad:         Math.round(entry.loadEventEnd),
    };
  });
}

/**
 * Returns CDP performance metrics using a CDP session.
 * Only works reliably in Chromium-based browsers.
 *
 * Uses the `Performance.getMetrics` DevTools command which is available
 * in all modern Playwright versions.
 */
export async function getCdpMetrics(page: Page): Promise<CdpMetrics> {
  const client = await page.context().newCDPSession(page);

  // Enable the Performance domain so getMetrics is available
  await client.send('Performance.enable');
  const { metrics } = await client.send('Performance.getMetrics') as {
    metrics: Array<{ name: string; value: number }>;
  };

  await client.detach();

  const map = Object.fromEntries(metrics.map(({ name, value }) => [name, value]));

  return {
    taskDuration:     map['TaskDuration']     ?? 0,
    scriptDuration:   map['ScriptDuration']   ?? 0,
    layoutDuration:   map['LayoutDuration']   ?? 0,
    layoutCount:      map['LayoutCount']      ?? 0,
    recalcStyleCount: map['RecalcStyleCount'] ?? 0,
    jsHeapUsedSize:   map['JSHeapUsedSize']   ?? 0,
    jsHeapTotalSize:  map['JSHeapTotalSize']  ?? 0,
  };
}

/**
 * Measures the wall-clock time (ms) taken for an async action to complete.
 *
 * @example
 * const ms = await measureActionTime(page, () => loginPage.login(user, pass));
 */
export async function measureActionTime(
  page: Page,
  action: () => Promise<void>,
): Promise<number> {
  const start = Date.now();
  await action();
  return Date.now() - start;
}
