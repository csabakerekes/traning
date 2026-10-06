import type { Page, APIRequestContext } from '@playwright/test';

export interface App {
  readonly page: Page;
  readonly request?: APIRequestContext;
}

export function createApp(page: Page, request?: APIRequestContext): App {
  return { page, request };
}
