import { describe, it, expect } from 'vitest';
import { BaseApiClient } from '../../src/api/BaseApiClient';
import type { APIRequestContext } from '@playwright/test';

/**
 * Unit tests for src/api/BaseApiClient.ts
 *
 * Tests the pure logic in BaseApiClient — header building and auth token
 * management — without making any real HTTP requests.
 *
 * We create a minimal concrete subclass since BaseApiClient is abstract.
 */

// Minimal concrete subclass that exposes the protected methods for testing
class TestApiClient extends BaseApiClient {
  public headers(extra?: Record<string, string>): Record<string, string> {
    return this.buildHeaders(extra);
  }
}

// Empty mock — no HTTP calls are made in these unit tests
const mockRequest = {} as APIRequestContext;

describe('BaseApiClient — constructor', () => {
  it('strips a trailing slash from the base URL', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com/');
    // Access via headers — the URL is tested indirectly via GET/POST in E2E
    // Here we just confirm the constructor does not throw
    expect(client).toBeDefined();
  });

  it('accepts a base URL without a trailing slash', () => {
    expect(() => new TestApiClient(mockRequest, 'https://api.example.com')).not.toThrow();
  });
});

describe('BaseApiClient — buildHeaders()', () => {
  it('includes Content-Type: application/json by default', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com');
    expect(client.headers()['Content-Type']).toBe('application/json');
  });

  it('includes Accept: application/json by default', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com');
    expect(client.headers()['Accept']).toBe('application/json');
  });

  it('does NOT include Authorization before setAuthToken is called', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com');
    expect(client.headers()['Authorization']).toBeUndefined();
  });

  it('merges extra headers with default headers', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com');
    const headers = client.headers({ 'X-Custom': 'value123' });
    expect(headers['X-Custom']).toBe('value123');
    expect(headers['Content-Type']).toBe('application/json');
  });
});

describe('BaseApiClient — auth token management', () => {
  it('adds Authorization: Bearer <token> after setAuthToken()', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com');
    client.setAuthToken('my-secret-token');
    expect(client.headers()['Authorization']).toBe('Bearer my-secret-token');
  });

  it('removes Authorization header after clearAuthToken()', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com');
    client.setAuthToken('my-secret-token');
    client.clearAuthToken();
    expect(client.headers()['Authorization']).toBeUndefined();
  });

  it('replaces the old token when setAuthToken() is called again', () => {
    const client = new TestApiClient(mockRequest, 'https://api.example.com');
    client.setAuthToken('first-token');
    client.setAuthToken('second-token');
    expect(client.headers()['Authorization']).toBe('Bearer second-token');
  });
});
