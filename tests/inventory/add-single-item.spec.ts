import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Cart Interaction from Inventory', () => {
  test('Add single item to cart from inventory, increment badge, and toggle button to Remove', async ({ app }) => {
    const { page } = app;

    // 1. Log in as standard_user with empty cart and view Workshop Backpack (p-001) on /inventory
    await login(app);
    const cartBadge = page.locator('[data-test="cart-badge"]');
    await expect(cartBadge).toHaveCount(0);
    await expect(page.locator('[data-test="add-p-001"]')).toHaveText('Add to cart');

    // 2. Click 'Add to cart' button [data-test="add-p-001"]
    await page.locator('[data-test="add-p-001"]').click();
    await expect(page.locator('[data-test="remove-p-001"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-p-001"]')).toHaveText('Remove');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // 3. Click Cart link in header to open /cart
    await page.getByRole('link', { name: /^Cart/ }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(page.getByRole('heading', { name: 'Workshop Backpack' })).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });
});
