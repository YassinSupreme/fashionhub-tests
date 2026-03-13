import { test, expect } from '@playwright/test';

/**
 * API Demo: GitHub REST API
 * -------------------------
 * A working demonstration of Playwright API testing capabilities.
 *
 * Uses the public GitHub REST API (no auth required) to prove the entire
 * API stack works today — before the FashionHub API is available.
 *
 * Run with:
 *   npx playwright test tests/api/example.api.spec.ts --project=api
 */

const GITHUB_API = 'https://api.github.com';
const REPO_OWNER = 'pocketaces2';
const REPO_NAME  = 'fashionhub';

test.describe('API Demo: GitHub REST API', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // Test 1 — GET known public repo returns 200 + correct shape
  // ──────────────────────────────────────────────────────────────────────────
  test('GET /repos/:owner/:repo returns 200 and expected response shape', async ({ request }) => {
    const res = await request.get(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();

    // Shape assertions — verify key fields are present and typed correctly
    expect(typeof body.id).toBe('number');
    expect(typeof body.name).toBe('string');
    expect(body.name).toBe(REPO_NAME);
    expect(body.owner.login).toBe(REPO_OWNER);
    expect(typeof body.html_url).toBe('string');
    expect(body.html_url).toContain('github.com');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 2 — GET non-existent repo returns 404
  // ──────────────────────────────────────────────────────────────────────────
  test('GET /repos/:owner/:repo returns 404 for a non-existent repository', async ({ request }) => {
    const res = await request.get(`${GITHUB_API}/repos/nonexistent-user-xyz/nonexistent-repo-abc`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    expect(res.status()).toBe(404);

    const body = await res.json();
    expect(body.message).toBeDefined();
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 3 — Response headers include JSON content type
  // ──────────────────────────────────────────────────────────────────────────
  test('Response includes correct Content-Type header', async ({ request }) => {
    const res = await request.get(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    const contentType = res.headers()['content-type'] ?? '';
    expect(contentType).toContain('application/json');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Test 4 — GET /repos/:owner/:repo/contents lists root files
  // ──────────────────────────────────────────────────────────────────────────
  test('GET repository contents returns an array of files', async ({ request }) => {
    const res = await request.get(`${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    expect(res.status()).toBe(200);

    const files = await res.json();
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBeGreaterThan(0);

    // Each file entry should have name and type fields
    for (const file of files) {
      expect(typeof file.name).toBe('string');
      expect(['file', 'dir']).toContain(file.type);
    }
  });
});
