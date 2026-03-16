import { Before, After, setDefaultTimeout, Status } from '@cucumber/cucumber';

import { FashionHubWorld } from './world';

// Increase timeout to 20s to accommodate GitHub Pages network latency
setDefaultTimeout(20 * 1000);

/**
 * Before — runs before every scenario.
 * Launches a fresh browser + page and wires up all POM instances.
 */
Before(async function (this: FashionHubWorld) {
  await this.init();
});

/**
 * After — runs after every scenario.
 * Takes a screenshot on failure (attached to the Cucumber report),
 * then closes the browser.
 */
After(async function (this: FashionHubWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page?.screenshot({ fullPage: true });
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }
  await this.teardown();
});
