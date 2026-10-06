import { test, expect } from '../fixtures';

const standardCatalog = {
  products: [
    { id: 'p-001', name: 'Workshop Backpack', price: 29.99, stock: 14 },
    { id: 'p-002', name: 'Mechanical Keyboard', price: 89.5, stock: 7 },
    { id: 'p-003', name: 'Lab Notebook', price: 12, stock: 42 },
    { id: 'p-004', name: 'Aeropress Go', price: 39.95, stock: 0 },
    { id: 'p-005', name: 'Desk Lamp', price: 45, stock: 3 },
    { id: 'p-006', name: 'Field Recorder', price: 199, stock: 1 },
  ],
};

test.describe('Data Loading & Error Handling', () => {
  test.beforeEach(async ({ app }) => {
    await app.page.addInitScript(() => {
      localStorage.setItem(
        'workshop-auth',
        JSON.stringify({ state: { username: 'standard_user', kind: 'standard' }, version: 0 })
      );
    });
  });

  test('Display loading state and disable sort control while catalog request is in flight', async ({ app }) => {
    const { page } = app;

    let fulfillCatalog: () => void = () => {};
    const catalogHold = new Promise<void>((resolve) => {
      fulfillCatalog = resolve;
    });

    // 1. Intercept GET /api/products with a delayed response and navigate to /inventory as authenticated user
    await page.route('**/api/products', async (route) => {
      await catalogHold;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(standardCatalog),
      });
    });

    const navPromise = page.goto('/inventory');

    await expect(page.getByText('Loading products…')).toBeVisible();
    await expect(page.getByTestId('sort')).toBeDisabled();

    // 2. Fulfill the intercepted GET /api/products request with standard catalog JSON
    fulfillCatalog();
    await navPromise;

    await expect(page.getByText('Loading products…')).toBeHidden();
    await expect(page.getByTestId('sort')).toBeEnabled();
    await expect(page.locator('[data-test="inventory"] .product-card')).toHaveCount(6);
  });

  test('Display alert banner and hide product grid when catalog API request fails', async ({ app }) => {
    const { page } = app;

    // 1. Intercept GET /api/products to return HTTP 500 Internal Server Error and navigate to /inventory
    await page.route('**/api/products', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/inventory');

    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("Couldn't load inventory. HTTP 500");
    await expect(page.getByTestId('sort')).toBeDisabled();
    await expect(page.locator('[data-test="inventory"]')).toBeHidden();
    await expect(page.locator('.product-card')).toHaveCount(0);
  });

  test('Drop API products that do not match the static catalog', async ({ app }) => {
    const { page } = app;

    // 1. Intercept GET /api/products to inject an extra product payload with id 'p-999' and name 'Unknown Item' and navigate to /inventory
    await page.route('**/api/products', async (route) => {
      const response = await route.fetch();
      const json = await response.json();
      json.products.push({ id: 'p-999', name: 'Unknown Item', price: 10, stock: 5 });
      await route.fulfill({ response, json });
    });

    await page.goto('/inventory');

    await expect(page.locator('[data-test="inventory"]')).toBeVisible();
    await expect(page.getByTestId('product-name-p-999')).toBeHidden();
    await expect(page.locator('[data-test="inventory"] .product-card')).toHaveCount(6);
  });
});
