/**
 * bdd.ts
 * ------
 * Thin BDD-style wrappers around Playwright's `test.step()`.
 *
 * Usage:
 *   import { Given, When, Then, And } from '../../src/utils/bdd';
 *
 *   Given('I am on the About page', async () => { ... });
 *   When('I read the main heading', async () => { ... });
 *   Then('it should say "About FashionHub"', async () => { ... });
 *
 * Each call maps to a named step in the Playwright HTML report,
 * giving you a BDD narrative without needing a separate test runner.
 */
import { test } from '@playwright/test';

type StepFn = () => Promise<void>;

/** Represents a precondition. Maps to test.step('Given: ...') */
export const Given = (description: string, fn: StepFn): Promise<void> =>
  test.step(`Given: ${description}`, fn);

/** Represents an action. Maps to test.step('When: ...') */
export const When = (description: string, fn: StepFn): Promise<void> =>
  test.step(`When: ${description}`, fn);

/** Represents an assertion. Maps to test.step('Then: ...') */
export const Then = (description: string, fn: StepFn): Promise<void> =>
  test.step(`Then: ${description}`, fn);

/** Used for additional steps (chaining Given/When/Then). */
export const And = (description: string, fn: StepFn): Promise<void> =>
  test.step(`  And: ${description}`, fn);

/** Used for background context (optional). */
export const Background = (description: string, fn: StepFn): Promise<void> =>
  test.step(`Background: ${description}`, fn);
