import { test, expect } from '../fixtures';

test.describe('Access & Authentication', () => {
  test('Redirect unauthenticated user accessing inventory to login page', async ({ app }) => {
    const { page } = app;

    // 1. Clear authentication credentials from localStorage ('workshop-auth') and navigate directly to /inventory
    await page.goto('/inventory');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();

    // 2. Fill username 'standard_user', fill password 'workshop123', and click 'Sign in' button
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill('workshop123');
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/inventory$/);
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout (standard_user)' })).toBeVisible();
  });
});
