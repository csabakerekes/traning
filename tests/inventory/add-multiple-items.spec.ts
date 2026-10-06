import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Cart Interaction from Inventory', () => {
  test('Add multiple items to cart from inventory and verify cumulative badge increments', async ({ app }) => {
    const { page } = app;

    // 1. Log in as standard_user with empty cart on /inventory
    await login(app);
    const cartBadge = page.locator('[data-test="cart-badge"]');
    await expect(cartBadge).toHaveCount(0);

    // 2. Click 'Add to cart' on Workshop Backpack [data-test="add-p-001"]
    await page.locator('[data-test="add-p-001"]').click();
    await expect(page.locator('[data-test="remove-p-001"]')).toHaveText('Remove');
    await expect(cartBadge).toHaveText('1');

    // 3. Click 'Add to cart' on Mechanical Keyboard [data-test="add-p-002"]
    await page.locator('[data-test="add-p-002"]').click();
    await expect(page.locator('[data-test="remove-p-002"]')).toHaveText('Remove');
    await expect(cartBadge).toHaveText('2');

    // 4. Click 'Add to cart' on Lab Notebook [data-test="add-p-003"]
    await page.locator('[data-test="add-p-003"]').click();
    await expect(page.locator('[data-test="remove-p-003"]')).toHaveText('Remove');
    await expect(cartBadge).toHaveText('3');
    await expect(page.locator('[data-test="remove-p-001"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-p-002"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-p-003"]')).toBeVisible();
    await expect(page.locator('[data-test="add-p-005"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-006"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-004"]')).toHaveText('Unavailable');
    await expect(page.locator('[data-test="add-p-004"]')).toBeDisabled();
  });
});
