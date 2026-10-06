import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Product Sorting', () => {
  test('Sort products alphabetically by Name (A-Z) by default and after changing sort option', async ({ app }) => {
    const { page } = app;

    // 1. Log in as standard_user and navigate to /inventory
    await login(app);
    const sortSelect = page.getByTestId('sort');
    await expect(sortSelect).toHaveValue('name-asc');

    // 2. Read all product headings (.product-card h3) in DOM order
    const expectedOrder = [
      'Aeropress Go',
      'Desk Lamp',
      'Field Recorder',
      'Lab Notebook',
      'Mechanical Keyboard',
      'Workshop Backpack',
    ];
    await expect(page.locator('.product-card h3')).toHaveText(expectedOrder);

    // 3. Select 'price-asc' and then select 'name-asc' again in [data-test="sort"]
    await sortSelect.selectOption('price-asc');
    await sortSelect.selectOption('name-asc');
    await expect(page.locator('.product-card h3')).toHaveText(expectedOrder);
  });
});
