import { test } from '../fixtures';

test.describe('Cart', () => {
  test('Add a product to cart and verify in cart', async ({ shop, verify }) => {
    await shop.login();
    await verify.onInventory();

    await shop.addToCart('Lab Notebook');
    await verify.itemAdded('Lab Notebook');
    await verify.cartBadge(1);

    await shop.openCart();
    await verify.onCart();
    await verify.itemInCart('Lab Notebook');
    await verify.checkoutAvailable();
  });
});

