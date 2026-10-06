import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Out of Stock Product Handling', () => {
  test('Out of stock product renders disabled Unavailable button and cannot be added to cart', async ({ app }) => {
    const { page } = app;

    // 1. Log in as standard_user and locate Aeropress Go (p-004) card on /inventory
    await login(app);

    const stockBadge = page.locator('[data-test="product-stock-p-004"]');
    const actionButton = page.locator('[data-test="add-p-004"]');

    await expect(stockBadge).toHaveText('Out of stock');
    await expect(actionButton).toHaveText('Unavailable');
    await expect(actionButton).toBeDisabled();

    // 2. Inspect Cart link in the header
    const cartBadge = page.locator('[data-test="cart-badge"]');
    await expect(cartBadge).toHaveCount(0);

    // 3. Attempt to click disabled button [data-test="add-p-004"]
    await actionButton.click({ force: true });
    await expect(actionButton).toHaveText('Unavailable');
    await expect(cartBadge).toHaveCount(0);
  });
});
