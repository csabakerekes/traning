import { test, expect } from '../fixtures';
import { login } from '../../src/actions/login';

test.describe('Product Sorting', () => {
  test('Sort products in reverse alphabetical order by Name (Z-A)', async ({ app }) => {
    const { page } = app;

    // Log in as standard_user and navigate to /inventory
    await login(app);

    // 1. Select 'name-desc' ('Name (Z–A)') from sort dropdown [data-test="sort"]
    const sortSelect = page.getByTestId('sort');
    await sortSelect.selectOption('name-desc');

    await expect(sortSelect).toHaveValue('name-desc');
    await expect(page.locator('.product-card h3')).toHaveText([
      'Workshop Backpack',
      'Mechanical Keyboard',
      'Lab Notebook',
      'Field Recorder',
      'Desk Lamp',
      'Aeropress Go',
    ]);
  });
});
