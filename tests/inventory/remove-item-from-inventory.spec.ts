import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Cart Interaction from Inventory', () => {
  test('Remove item directly from inventory card to decrement badge and revert button state', async ({ app }) => {
    const { page } = app;

    // 1. Log in as standard_user and add Workshop Backpack (p-001) and Lab Notebook (p-003) to cart
    await login(app);
    await page.locator('[data-test="add-p-001"]').click();
    await page.locator('[data-test="add-p-003"]').click();

    const cartBadge = page.locator('[data-test="cart-badge"]');
    await expect(cartBadge).toHaveText('2');
    await expect(page.locator('[data-test="remove-p-001"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-p-003"]')).toBeVisible();

    // 2. Click 'Remove' button [data-test="remove-p-001"] on Workshop Backpack card
    await page.locator('[data-test="remove-p-001"]').click();
    await expect(page.locator('[data-test="add-p-001"]')).toBeVisible();
    await expect(page.locator('[data-test="add-p-001"]')).toHaveText('Add to cart');
    await expect(cartBadge).toHaveText('1');
    await expect(page.locator('[data-test="remove-p-003"]')).toBeVisible();

    // 3. Click 'Remove' button [data-test="remove-p-003"] on Lab Notebook card
    await page.locator('[data-test="remove-p-003"]').click();
    await expect(page.locator('[data-test="add-p-003"]')).toBeVisible();
    await expect(page.locator('[data-test="add-p-003"]')).toHaveText('Add to cart');
    await expect(cartBadge).toHaveCount(0);
  });
});
