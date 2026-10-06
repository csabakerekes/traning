import { expect } from '@playwright/test';
import type { App } from '../app';

function productCard(app: App, productName: string) {
  return app.page
    .locator('.product-card')
    .filter({ has: app.page.getByRole('heading', { name: productName }) });
}

export async function addToCart(app: App, productName: string): Promise<void> {
  await productCard(app, productName).getByRole('button', { name: 'Add to cart' }).click();
}

export async function openCart(app: App): Promise<void> {
  await app.page.getByRole('link', { name: /^Cart/ }).click();
}

export async function itemAdded(app: App, productName: string): Promise<void> {
  await expect(productCard(app, productName).getByRole('button', { name: 'Remove' })).toBeVisible();
}

export async function cartBadge(app: App, count: number | string): Promise<void> {
  await expect(app.page.getByTestId('cart-badge')).toHaveText(String(count));
}

export async function onCart(app: App): Promise<void> {
  await expect(app.page).toHaveURL(/\/cart$/);
}

export async function itemInCart(app: App, productName: string): Promise<void> {
  await expect(app.page.getByRole('heading', { name: productName })).toBeVisible();
}

export async function checkoutAvailable(app: App): Promise<void> {
  await expect(app.page.getByRole('button', { name: 'Checkout' })).toBeVisible();
}
