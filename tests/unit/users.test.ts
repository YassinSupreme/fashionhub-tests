import { describe, it, expect } from 'vitest';
import { validUser, invalidUsers } from '../../src/data/users';

/**
 * Unit tests for src/data/users.ts
 * ---------------------------------
 * Validates the shape and basic correctness of the login credentials used
 * across all authentication-related specs and BDD scenarios.
 */

describe('validUser', () => {
  it('has a non-empty username', () => {
    expect(validUser.username).toBeTruthy();
    expect(typeof validUser.username).toBe('string');
  });

  it('has a non-empty password', () => {
    expect(validUser.password).toBeTruthy();
    expect(typeof validUser.password).toBe('string');
  });

  it('password is at least 6 characters', () => {
    expect(validUser.password.length).toBeGreaterThanOrEqual(6);
  });
});

describe('invalidUsers', () => {
  it('wrongPassword has the same username as validUser', () => {
    expect(invalidUsers.wrongPassword.username).toBe(validUser.username);
  });

  it('wrongPassword has a different password from validUser', () => {
    expect(invalidUsers.wrongPassword.password).not.toBe(validUser.password);
  });

  it('wrongUsername has a different username from validUser', () => {
    expect(invalidUsers.wrongUsername.username).not.toBe(validUser.username);
  });

  it('non-empty credential entries have valid username and password', () => {
    // Only include entries where empty strings are NOT intentional
    const nonEmpty = [invalidUsers.wrongPassword, invalidUsers.wrongUsername];
    nonEmpty.forEach(({ username, password }) => {
      expect(username).toBeTruthy();
      expect(password).toBeTruthy();
    });
  });

  it('edge-case entries intentionally use empty strings', () => {
    // emptyCredentials, emptyUsername, emptyPassword are edge cases for HTML5 validation tests
    expect(invalidUsers.emptyCredentials.username).toBe('');
    expect(invalidUsers.emptyCredentials.password).toBe('');
    expect(invalidUsers.emptyUsername.username).toBe('');
    expect(invalidUsers.emptyPassword.password).toBe('');
  });
});
