# Performance Testing — FashionHub

A guide to running and extending the Playwright-based performance test suite for FashionHub.

---

## Overview

Performance tests live in `tests/performance/` and use only Playwright's built-in APIs:

| API | Purpose |
|---|---|
| `performance.getEntriesByType('navigation')` | Navigation Timing (TTFB, DOM load, page load) |
| CDP `Performance.getMetrics` via `newCDPSession` | JS heap size, layout/style counts, script duration |
| `Date.now()` wall-clock | Action round-trip timing (e.g. login submit -> redirect) |

No external tools (k6, Lighthouse, etc.) are required.

> **Chromium only** — CDP metrics require a Chromium-based browser.
> Performance tests are excluded from Firefox and WebKit projects automatically.

---

## Running the Tests

```bash
# Run all performance tests (Chromium)
npx playwright test tests/performance/ --project=chromium

# Run only the login performance spec
npx playwright test tests/performance/login.perf.spec.ts --project=chromium

# Run with verbose console output (shows actual metric values)
npx playwright test tests/performance/ --project=chromium --reporter=list

# View the HTML report after the run
npx playwright show-report
```

---

## Current Specs

### `tests/performance/login.perf.spec.ts`

6 scenarios covering the FashionHub login page:

| # | Test | API Used | Budget |
|---|---|---|---|
| 1 | Page load completes within budget | Navigation Timing (`loadEventEnd`) | < 5 000 ms |
| 2 | Time to First Byte (TTFB) | Navigation Timing (`responseStart - requestStart`) | < 2 000 ms |
| 3 | DOM becomes interactive | Navigation Timing (`domInteractive`) | < 4 000 ms |
| 4 | Login form submission round-trip | Wall-clock (`Date.now()`) | < 5 000 ms |
| 5 | JS heap usage | CDP `JSHeapUsedSize` | < 50 MB |
| 6 | Layout + style recalculation ops | CDP `LayoutCount + RecalcStyleCount` | < 100 |

Actual values recorded against production (GitHub Pages CDN):

| Metric | Observed |
|---|---|
| TTFB | ~17 ms |
| Page load | ~144 ms |
| DOM interactive | ~433 ms |
| Login round-trip | ~257 ms |
| JS heap used | ~0.98 MB |
| Layout + recalc ops | 0 |

---

## Performance Utility Helpers

All reusable measurement functions live in `src/utils/performanceUtils.ts`.

### `getNavigationTimings(page)`

Reads the Navigation Timing API from the browser and returns a typed object:

```ts
const timings = await getNavigationTimings(page);
// timings.ttfb           — Time to First Byte (ms)
// timings.domInteractive — DOM interactive (ms from nav start)
// timings.domContentLoaded
// timings.pageLoad       — Full load event end (ms from nav start)
// timings.dnsLookup
// timings.tcpConnect
```

### `getCdpMetrics(page)`

Opens a CDP session and returns Chrome performance counters:

```ts
const metrics = await getCdpMetrics(page);
// metrics.jsHeapUsedSize   — Bytes
// metrics.jsHeapTotalSize  — Bytes
// metrics.layoutCount      — Number of layout passes
// metrics.recalcStyleCount — Number of style recalcs
// metrics.taskDuration     — CPU time in seconds
// metrics.scriptDuration   — JS eval time in seconds
```

### `measureActionTime(page, fn)`

Wall-clock wrapper for timing any async action:

```ts
const elapsed = await measureActionTime(page, async () => {
  await loginPage.login(user, password);
  await page.waitForURL(/account.html/);
});
// elapsed — milliseconds
```

---

## Adding a New Performance Test

1. Create a spec file in `tests/performance/`:

```
tests/performance/
    login.perf.spec.ts    <- existing
    home.perf.spec.ts     <- your new file
```

2. Import the helpers and fixtures:

```ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import {
  getNavigationTimings,
  getCdpMetrics,
  measureActionTime,
} from '../../src/utils/performanceUtils';
```

3. Define your budgets at the top of the file:

```ts
const BUDGET = {
  pageLoad:  3_000,  // ms
  jsHeapMb:     50,  // MB
} as const;
```

4. Write your test using the existing patterns:

```ts
test('Perf: Home page load within budget', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await page.waitForLoadState('load');

  const timings = await getNavigationTimings(page);
  console.log('[Timings] pageLoad:', timings.pageLoad, 'ms');

  expect(timings.pageLoad).toBeLessThan(BUDGET.pageLoad);
});
```

5. Run it (Chromium only):

```bash
npx playwright test tests/performance/home.perf.spec.ts --project=chromium
```

---

## Adjusting Budgets

Budgets are defined as constants at the top of each spec file:

```ts
// tests/performance/login.perf.spec.ts
const BUDGET = {
  pageLoad:      5_000,  // Full load event
  ttfb:          2_000,  // Time to first byte
  domInteractive:4_000,  // DOM interactive
  loginActionMs: 5_000,  // Login round-trip
  jsHeapMb:         50,  // JS heap (MB)
  layoutOps:       100,  // Layout + recalc total
} as const;
```

Tighten values for production SLAs. For example, if your SLA requires load < 2 s:

```ts
pageLoad: 2_000,
```

---

## CI Integration

Performance tests run automatically on every push via GitHub Actions (Chromium only).
To exclude them from CI, add a filter to `.github/workflows/playwright.yml`:

```yaml
- name: Run UI tests
  run: npx playwright test --project=chromium --ignore=tests/performance/

- name: Run performance tests
  run: npx playwright test tests/performance/ --project=chromium
```

This lets you separate performance failures from functional failures in the CI report.

---

## Interpreting the HTML Report

After a run, open the report:

```bash
npx playwright show-report
```

Each performance test prints the actual metric values to the console via `console.log`.
These appear in the **Attachments** pane of the HTML report — click any test to see them.

---

## Project Structure

```
fashionhub-tests/
├── src/
│   └── utils/
│       └── performanceUtils.ts    # Shared timing helpers
└── tests/
    └── performance/
        └── login.perf.spec.ts     # Login page performance scenarios
```
