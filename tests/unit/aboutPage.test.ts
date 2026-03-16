import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AboutPage } from '../../src/pages/AboutPage';

/**
 * Unit tests for src/pages/AboutPage.ts
 *
 * AboutPage is a Page Object Model class — it wraps Playwright's `Page` and
 * `Locator` APIs. Because we don't want a real browser here, we mock both
 * using Vitest's `vi.fn()` so the tests are instant and fully isolated.
 *
 * What we can unit test without a browser:
 *   - Static constants (PATH, URL_PATTERN)
 *   - Constructor wires up the correct CSS selectors
 *   - Each public method calls the right Playwright API and returns the right value
 */

// ── Mock Factory ─────────────────────────────────────────────────────────────

/**
 * Creates a minimal, typed mock of a Playwright Locator.
 * Each function is a Vitest spy so we can assert it was called.
 */
function createMockLocator(overrides: Record<string, unknown> = {}) {
  return {
    waitFor:       vi.fn().mockResolvedValue(undefined),
    innerText:     vi.fn().mockResolvedValue('About FashionHub'),
    allInnerTexts: vi.fn().mockResolvedValue(['Our Story', 'Our Vision', 'Our Team']),
    count:         vi.fn().mockResolvedValue(3),
    isVisible:     vi.fn().mockResolvedValue(true),
    ...overrides,
  };
}

/**
 * Creates a minimal mock of a Playwright Page.
 * `locator()` returns a fresh mockLocator for every call.
 */
function createMockPage(locatorOverrides: Record<string, unknown> = {}) {
  const mockLocator = createMockLocator(locatorOverrides);
  return {
    locator:            vi.fn().mockReturnValue(mockLocator),
    goto:               vi.fn().mockResolvedValue(undefined),
    waitForLoadState:   vi.fn().mockResolvedValue(undefined),
    _mockLocator:       mockLocator, // expose for assertions
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('AboutPage — static constants', () => {
  it('PATH equals about.html', () => {
    expect(AboutPage.PATH).toBe('about.html');
  });

  it('URL_PATTERN matches a full about.html URL', () => {
    expect('https://pocketaces2.github.io/fashionhub/about.html').toMatch(
      AboutPage.URL_PATTERN,
    );
  });

  it('URL_PATTERN matches a relative about.html path', () => {
    expect('/fashionhub/about.html').toMatch(AboutPage.URL_PATTERN);
  });

  it('URL_PATTERN does NOT match unrelated pages', () => {
    expect('https://example.com/index.html').not.toMatch(AboutPage.URL_PATTERN);
    expect('https://example.com/account.html').not.toMatch(AboutPage.URL_PATTERN);
  });
});

describe('AboutPage — constructor', () => {
  it('wires up the .about-banner h1 locator for the main heading', () => {
    const mockPage = createMockPage();
    new AboutPage(mockPage as never);
    expect(mockPage.locator).toHaveBeenCalledWith('.about-banner h1');
  });

  it('wires up the .about-content h2 locator for section headings', () => {
    const mockPage = createMockPage();
    new AboutPage(mockPage as never);
    expect(mockPage.locator).toHaveBeenCalledWith('.about-content h2');
  });

  it('wires up the .about-content p locator for paragraphs', () => {
    const mockPage = createMockPage();
    new AboutPage(mockPage as never);
    expect(mockPage.locator).toHaveBeenCalledWith('.about-content p');
  });

  it('instantiates without throwing', () => {
    const mockPage = createMockPage();
    expect(() => new AboutPage(mockPage as never)).not.toThrow();
  });
});

describe('AboutPage — goto()', () => {
  it('navigates to about.html', async () => {
    const mockPage = createMockPage();
    const aboutPage = new AboutPage(mockPage as never);
    await aboutPage.goto();
    expect(mockPage.goto).toHaveBeenCalledWith(
      expect.stringContaining('about.html'),
    );
  });

  it('waits for domcontentloaded state after navigating', async () => {
    const mockPage = createMockPage();
    const aboutPage = new AboutPage(mockPage as never);
    await aboutPage.goto();
    expect(mockPage.waitForLoadState).toHaveBeenCalledWith('domcontentloaded');
  });
});

describe('AboutPage — getMainHeading()', () => {
  it('waits for the heading to be visible before reading it', async () => {
    const mockPage = createMockPage();
    const aboutPage = new AboutPage(mockPage as never);
    await aboutPage.getMainHeading();
    expect(mockPage._mockLocator.waitFor).toHaveBeenCalledWith({ state: 'visible' });
  });

  it('returns the heading text from innerText()', async () => {
    const mockPage = createMockPage({ innerText: vi.fn().mockResolvedValue('About FashionHub') });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.getMainHeading();
    expect(result).toBe('About FashionHub');
  });

  it('returns a trimmed string (no extra whitespace issues)', async () => {
    const mockPage = createMockPage({ innerText: vi.fn().mockResolvedValue('  About FashionHub  ') });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.getMainHeading();
    expect(result.trim()).toBe('About FashionHub');
  });
});

describe('AboutPage — getSectionHeadings()', () => {
  it('returns an array of heading strings', async () => {
    const mockPage = createMockPage();
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.getSectionHeadings();
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns the expected section headings from the mock', async () => {
    const headings = ['Our Story', 'Our Vision', 'Our Team'];
    const mockPage = createMockPage({ allInnerTexts: vi.fn().mockResolvedValue(headings) });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.getSectionHeadings();
    expect(result).toEqual(headings);
  });

  it('returns an empty array when no headings are found', async () => {
    const mockPage = createMockPage({ allInnerTexts: vi.fn().mockResolvedValue([]) });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.getSectionHeadings();
    expect(result).toHaveLength(0);
  });
});

describe('AboutPage — hasContent()', () => {
  it('returns true when paragraph count is greater than 0', async () => {
    const mockPage = createMockPage({ count: vi.fn().mockResolvedValue(3) });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.hasContent();
    expect(result).toBe(true);
  });

  it('returns false when paragraph count is 0', async () => {
    const mockPage = createMockPage({ count: vi.fn().mockResolvedValue(0) });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.hasContent();
    expect(result).toBe(false);
  });

  it('returns true for exactly 1 paragraph', async () => {
    const mockPage = createMockPage({ count: vi.fn().mockResolvedValue(1) });
    const aboutPage = new AboutPage(mockPage as never);
    expect(await aboutPage.hasContent()).toBe(true);
  });
});

describe('AboutPage — isDisplayed()', () => {
  it('returns true when the main heading is visible', async () => {
    const mockPage = createMockPage({ isVisible: vi.fn().mockResolvedValue(true) });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.isDisplayed();
    expect(result).toBe(true);
  });

  it('returns false when the main heading is not visible', async () => {
    const mockPage = createMockPage({ isVisible: vi.fn().mockResolvedValue(false) });
    const aboutPage = new AboutPage(mockPage as never);
    const result = await aboutPage.isDisplayed();
    expect(result).toBe(false);
  });
});
