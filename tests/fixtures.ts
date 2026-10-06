import { test as base, expect } from '@playwright/test';
import { createApp, type App } from '../src/app';
import * as loginActions from '../src/actions/login';
import * as cartActions from '../src/actions/cart';

export interface ShopActor {
  login: (username?: string, password?: string) => Promise<void>;
  addToCart: (productName: string) => Promise<void>;
  openCart: () => Promise<void>;
}

export interface VerifyActor {
  onInventory: () => Promise<void>;
  itemAdded: (productName: string) => Promise<void>;
  cartBadge: (count: number | string) => Promise<void>;
  onCart: () => Promise<void>;
  itemInCart: (productName: string) => Promise<void>;
  checkoutAvailable: () => Promise<void>;
}

/**
 * Network evidence fixture - a working example of Playwright's fixture
 * architecture (studied in stage 01).
 *
 * Records every failed request and every HTTP >= 400 response during a test.
 * When the test fails, the log is attached to the report as
 * `network-failures.txt`, tagged [first-party] (same origin as baseURL) or
 * [third-party] - so a failure report can tell "the app misbehaved" apart
 * from "an external dependency or the environment misbehaved".
 *
 * Evidence is kept in memory and only attached on failure, so it behaves
 * identically headed (workshop laptops) and headless (CI). The fixture is
 * `auto`, so every test gets it without asking.
 *
 * Specs import { test, expect } from this file instead of '@playwright/test'.
 */

/** Hard cap so a redirect loop or a hammering retry can't grow the log unbounded. */
const MAX_ENTRIES = 100;

export const test = base.extend<{
  _networkEvidence: void;
  app: App;
  shop: ShopActor;
  verify: VerifyActor;
}>({
  app: async ({ page, request }, use) => {
    await use(createApp(page, request));
  },

  shop: async ({ app }, use) => {
    await use({
      login: (username, password) => loginActions.login(app, username, password),
      addToCart: (productName) => cartActions.addToCart(app, productName),
      openCart: () => cartActions.openCart(app),
    });
  },

  verify: async ({ app }, use) => {
    await use({
      onInventory: () => loginActions.onInventory(app),
      itemAdded: (productName) => cartActions.itemAdded(app, productName),
      cartBadge: (count) => cartActions.cartBadge(app, count),
      onCart: () => cartActions.onCart(app),
      itemInCart: (productName) => cartActions.itemInCart(app, productName),
      checkoutAvailable: () => cartActions.checkoutAvailable(app),
    });
  },

  _networkEvidence: [
    async ({ page, baseURL }, use, testInfo) => {
      const entries: string[] = [];
      const firstParty = baseURL ? new URL(baseURL).origin : undefined;

      const originLabel = (url: string): string => {
        if (!firstParty) return '';
        try {
          return new URL(url).origin === firstParty ? ' [first-party]' : ' [third-party]';
        } catch {
          return '';
        }
      };

      page.on('requestfailed', (request) => {
        if (entries.length >= MAX_ENTRIES) return;
        const reason = request.failure()?.errorText ?? 'request failed';
        entries.push(`${request.method()} ${request.url()} - ${reason}${originLabel(request.url())}`);
      });

      page.on('response', (response) => {
        if (entries.length >= MAX_ENTRIES) return;
        if (response.status() >= 400) {
          entries.push(
            `${response.request().method()} ${response.url()} - HTTP ${response.status()}${originLabel(response.url())}`
          );
        }
      });

      await use();

      if (testInfo.status !== testInfo.expectedStatus && entries.length > 0) {
        await testInfo.attach('network-failures.txt', {
          body: entries.join('\n'),
          contentType: 'text/plain',
        });
      }
    },
    { auto: true },
  ],
});

export { expect };

