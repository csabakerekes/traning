import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Product Sorting', () => {
  test('Sort products by Price (high-low) in descending numerical price order', async ({ app }) => {
    const { page } = app;

    // Log in as standard_user and navigate to /inventory
    await login(app);

    // 1. Select 'price-desc' ('Price (high–low)') from sort dropdown [data-test="sort"]
    const sortSelect = page.getByTestId('sort');
    await sortSelect.selectOption('price-desc');

    await expect(sortSelect).toHaveValue('price-desc');
    await expect(page.locator('.product-card h3')).toHaveText([
      'Field Recorder',
      'Mechanical Keyboard',
      'Desk Lamp',
      'Aeropress Go',
      'Workshop Backpack',
      'Lab Notebook',
    ]);
  });
});
