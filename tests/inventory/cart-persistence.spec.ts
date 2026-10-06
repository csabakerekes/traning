import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Cart Interaction from Inventory', () => {
  test('Persist cart items and card button states across cross-page navigation and page reload', async ({ app }) => {
    const { page } = app;

    // 1. Log in as standard_user and add Mechanical Keyboard (p-002) and Field Recorder (p-006) to cart
    await login(app);
    await page.locator('[data-test="add-p-002"]').click();
    await page.locator('[data-test="add-p-006"]').click();

    const cartBadge = page.locator('[data-test="cart-badge"]');
    await expect(cartBadge).toHaveText('2');
    await expect(page.locator('[data-test="remove-p-002"]')).toHaveText('Remove');
    await expect(page.locator('[data-test="remove-p-006"]')).toHaveText('Remove');

    // 2. Navigate to /cart via header Cart link
    await page.getByRole('link', { name: /^Cart/ }).click();
    await expect(page).toHaveURL(/\/cart$/);
    await expect(cartBadge).toHaveText('2');
    await expect(page.getByRole('heading', { name: 'Mechanical Keyboard' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Field Recorder' })).toBeVisible();

    // 3. Navigate back to /inventory
    await page.getByRole('link', { name: 'Inventory' }).click();
    await expect(page).toHaveURL(/\/inventory$/);
    await expect(cartBadge).toHaveText('2');
    await expect(page.locator('[data-test="remove-p-002"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-p-006"]')).toBeVisible();
    await expect(page.locator('[data-test="add-p-001"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-003"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-005"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-004"]')).toHaveText('Unavailable');
    await expect(page.locator('[data-test="add-p-004"]')).toBeDisabled();

    // 4. Reload the page via browser reload
    await page.reload();
    await expect(cartBadge).toHaveText('2');
    await expect(page.locator('[data-test="remove-p-002"]')).toBeVisible();
    await expect(page.locator('[data-test="remove-p-006"]')).toBeVisible();
  });
});
