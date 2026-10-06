import { expect } from '@playwright/test';
import type { App } from '../app';

export async function login(app: App, username = 'standard_user', password = 'workshop123'): Promise<void> {
  await app.page.goto('/login');
  await app.page.getByLabel('Username').fill(username);
  await app.page.getByLabel('Password').fill(password);
  await app.page.getByRole('button', { name: 'Sign in' }).click();
}

export async function onInventory(app: App): Promise<void> {
  await expect(app.page).toHaveURL(/\/inventory$/);
}
