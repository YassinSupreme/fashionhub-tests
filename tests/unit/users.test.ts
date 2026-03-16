import { describe, it, expect } from 'vitest';
import { validUser, invalidUsers, UserCredentials } from '../../src/data/users';

/**
 * Unit tests for src/data/users.ts
 *
 * Validates that the test credential fixtures have the expected shape and values.
 * Prevents typos in credentials from silently breaking E2E tests.
 */

function hasCredentialShape(obj: unknown): obj is UserCredentials {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'username' in obj &&
    'password' in obj &&
    typeof (obj as UserCredentials).username === 'string' &&
    typeof (obj as UserCredentials).password === 'string'
  );
}

describe('validUser', () => {
  it('has a non-empty username', () => {
    expect(validUser.username.length).toBeGreaterThan(0);
  });

  it('has a non-empty password', () => {
    expect(validUser.password.length).toBeGreaterThan(0);
  });

  it('matches the expected demo credentials', () => {
    expect(validUser.username).toBe('demouser');
    expect(validUser.password).toBe('fashion123');
  });
});

describe('invalidUsers', () => {
  it('wrongPassword uses a valid username with a wrong password', () => {
    expect(invalidUsers.wrongPassword.username).toBe('demouser');
    expect(invalidUsers.wrongPassword.password).not.toBe('fashion123');
  });

  it('wrongUsername uses a non-existent username', () => {
    expect(invalidUsers.wrongUsername.username).not.toBe('demouser');
    expect(invalidUsers.wrongUsername.username.length).toBeGreaterThan(0);
  });

  it('emptyCredentials has empty username and password', () => {
    expect(invalidUsers.emptyCredentials.username).toBe('');
    expect(invalidUsers.emptyCredentials.password).toBe('');
  });

  it('emptyUsername has empty username but valid password', () => {
    expect(invalidUsers.emptyUsername.username).toBe('');
    expect(invalidUsers.emptyUsername.password.length).toBeGreaterThan(0);
  });

  it('emptyPassword has valid username but empty password', () => {
    expect(invalidUsers.emptyPassword.username.length).toBeGreaterThan(0);
    expect(invalidUsers.emptyPassword.password).toBe('');
  });

  it('all invalidUser entries have the correct UserCredentials shape', () => {
    Object.entries(invalidUsers).forEach(([key, user]) => {
      expect(hasCredentialShape(user), `${key} should have username + password`).toBe(true);
    });
  });
});
