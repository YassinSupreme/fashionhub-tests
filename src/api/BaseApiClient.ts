import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * BaseApiClient
 * -------------
 * Abstract base class for all API clients.
 *
 * Wraps Playwright's APIRequestContext to provide:
 *   - Typed GET / POST / PUT / PATCH / DELETE helpers
 *   - Consistent auth-header injection
 *   - Shared error logging
 *
 * Extend this class for each service you want to test.
 */
export abstract class BaseApiClient {
  protected readonly request: APIRequestContext;
  protected readonly baseUrl: string;
  private authToken: string | null = null;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl  = baseUrl.replace(/\/$/, ''); // strip trailing slash
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  /** Set a Bearer token to be sent with every subsequent request. */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /** Clear the stored auth token. */
  clearAuthToken(): void {
    this.authToken = null;
  }

  // ── HTTP Helpers ──────────────────────────────────────────────────────────

  protected buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept:         'application/json',
      ...extra,
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async get(path: string, params?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(this.baseUrl + path, {
      headers: this.buildHeaders(),
      params,
    });
  }

  async post<T>(path: string, body: T): Promise<APIResponse> {
    return this.request.post(this.baseUrl + path, {
      headers: this.buildHeaders(),
      data:    body,
    });
  }

  async put<T>(path: string, body: T): Promise<APIResponse> {
    return this.request.put(this.baseUrl + path, {
      headers: this.buildHeaders(),
      data:    body,
    });
  }

  async patch<T>(path: string, body: Partial<T>): Promise<APIResponse> {
    return this.request.patch(this.baseUrl + path, {
      headers: this.buildHeaders(),
      data:    body,
    });
  }

  async delete(path: string): Promise<APIResponse> {
    return this.request.delete(this.baseUrl + path, {
      headers: this.buildHeaders(),
    });
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

  /**
   * Assert the response has the expected status code and return the parsed
   * JSON body. Throws a descriptive error if the status doesn't match.
   */
  async expectJson<T>(response: APIResponse, expectedStatus = 200): Promise<T> {
    if (response.status() !== expectedStatus) {
      const text = await response.text();
      throw new Error(
        `Expected HTTP ${expectedStatus} but got ${response.status()}\n` +
        `URL:  ${response.url()}\n` +
        `Body: ${text}`,
      );
    }
    return response.json() as Promise<T>;
  }
}
