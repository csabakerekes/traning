import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Product Sorting', () => {
  test('Sort products by Price (low-high) in ascending numerical price order', async ({ app }) => {
    const { page } = app;

    // Log in as standard_user and navigate to /inventory
    await login(app);

    // 1. Select 'price-asc' ('Price (low–high)') from sort dropdown [data-test="sort"]
    const sortSelect = page.getByTestId('sort');
    await sortSelect.selectOption('price-asc');

    await expect(sortSelect).toHaveValue('price-asc');
    await expect(page.locator('.product-card h3')).toHaveText([
      'Lab Notebook',
      'Workshop Backpack',
      'Aeropress Go',
      'Desk Lamp',
      'Mechanical Keyboard',
      'Field Recorder',
    ]);
  });
});
