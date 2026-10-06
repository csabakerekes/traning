import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Catalog & Product Cards Display', () => {
  test('Render all 6 products with complete card details, USD currency format, and correct stock status badges', async ({ app }) => {
    const { page } = app;

    // 1. Log in with standard_user and navigate to /inventory
    await login(app);
    await expect(page.locator('[data-test="inventory"]')).toBeVisible();
    await expect(page.locator('.product-card')).toHaveCount(6);

    // 2. Verify product card details for Workshop Backpack (p-001)
    await expect(page.locator('[data-test="product-image-p-001"]')).toHaveAttribute('alt', 'Workshop Backpack');
    await expect(page.locator('[data-test="product-name-p-001"]')).toHaveText('Workshop Backpack');
    await expect(page.locator('[data-test="product-description-p-001"]')).toHaveText('Carry-on backpack with padded laptop sleeve and water bottle pocket.');
    await expect(page.locator('[data-test="product-stock-p-001"]')).toHaveText('In stock');
    await expect(page.locator('[data-test="product-price-p-001"]')).toHaveText('$29.99');
    await expect(page.locator('[data-test="add-p-001"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-001"]')).toBeEnabled();

    // 3. Verify product card details for Mechanical Keyboard (p-002)
    await expect(page.locator('[data-test="product-image-p-002"]')).toHaveAttribute('alt', 'Mechanical Keyboard');
    await expect(page.locator('[data-test="product-name-p-002"]')).toHaveText('Mechanical Keyboard');
    await expect(page.locator('[data-test="product-description-p-002"]')).toHaveText('75% layout with hot-swappable switches and per-key RGB.');
    await expect(page.locator('[data-test="product-stock-p-002"]')).toHaveText('In stock');
    await expect(page.locator('[data-test="product-price-p-002"]')).toHaveText('$89.50');
    await expect(page.locator('[data-test="add-p-002"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-002"]')).toBeEnabled();

    // 4. Verify product card details for Lab Notebook (p-003)
    await expect(page.locator('[data-test="product-image-p-003"]')).toHaveAttribute('alt', 'Lab Notebook');
    await expect(page.locator('[data-test="product-name-p-003"]')).toHaveText('Lab Notebook');
    await expect(page.locator('[data-test="product-description-p-003"]')).toHaveText('Dot-grid notebook with numbered pages and an index. 200 sheets.');
    await expect(page.locator('[data-test="product-stock-p-003"]')).toHaveText('In stock');
    await expect(page.locator('[data-test="product-price-p-003"]')).toHaveText('$12.00');
    await expect(page.locator('[data-test="add-p-003"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-003"]')).toBeEnabled();

    // 5. Verify product card details for Aeropress Go (p-004)
    await expect(page.locator('[data-test="product-image-p-004"]')).toHaveAttribute('alt', 'Aeropress Go');
    await expect(page.locator('[data-test="product-name-p-004"]')).toHaveText('Aeropress Go');
    await expect(page.locator('[data-test="product-description-p-004"]')).toHaveText('Portable coffee press for travel. Brews a single cup in under a minute.');
    await expect(page.locator('[data-test="product-stock-p-004"]')).toHaveText('Out of stock');
    await expect(page.locator('[data-test="product-price-p-004"]')).toHaveText('$39.95');
    await expect(page.locator('[data-test="add-p-004"]')).toHaveText('Unavailable');
    await expect(page.locator('[data-test="add-p-004"]')).toBeDisabled();

    // 6. Verify product card details for Desk Lamp (p-005)
    await expect(page.locator('[data-test="product-image-p-005"]')).toHaveAttribute('alt', 'Desk Lamp');
    await expect(page.locator('[data-test="product-name-p-005"]')).toHaveText('Desk Lamp');
    await expect(page.locator('[data-test="product-description-p-005"]')).toHaveText('Warm-white LED with three brightness levels and a USB charging port.');
    await expect(page.locator('[data-test="product-stock-p-005"]')).toHaveText('Only 3 left');
    await expect(page.locator('[data-test="product-price-p-005"]')).toHaveText('$45.00');
    await expect(page.locator('[data-test="add-p-005"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-005"]')).toBeEnabled();

    // 7. Verify product card details for Field Recorder (p-006)
    await expect(page.locator('[data-test="product-image-p-006"]')).toHaveAttribute('alt', 'Field Recorder');
    await expect(page.locator('[data-test="product-name-p-006"]')).toHaveText('Field Recorder');
    await expect(page.locator('[data-test="product-description-p-006"]')).toHaveText('Two-channel handheld recorder with XLR inputs and a built-in stereo mic.');
    await expect(page.locator('[data-test="product-stock-p-006"]')).toHaveText('Only 1 left');
    await expect(page.locator('[data-test="product-price-p-006"]')).toHaveText('$199.00');
    await expect(page.locator('[data-test="add-p-006"]')).toHaveText('Add to cart');
    await expect(page.locator('[data-test="add-p-006"]')).toBeEnabled();
  });
});
