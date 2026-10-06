# Inventory — Requirements

## 1. Overview

The Inventory page is the product-browsing screen of the workshop demo e-commerce
application. It lists the product catalog, lets an authenticated user sort the
products, and lets them add or remove items from their cart directly from each
product card. It is served at `http://localhost:5173/inventory`.

Source: [app/src/pages/Inventory.tsx](../app/src/pages/Inventory.tsx) ·
Catalog data: [app/public/api/inventory.json](../app/public/api/inventory.json)

## 2. Access & Authentication

- **REQ-INV-1** — The Inventory page is available only to authenticated users.
  If no user is logged in, the page redirects to `/login`.

## 3. Data Loading

- **REQ-INV-2** — On mount, the page fetches the live catalog from
  `GET /api/inventory.json`. Runtime fields (`name`, `price`, `stock`) come from
  this response; static fields (`description`, `imageUrl`) come from the bundled
  catalog and are merged by product `id`.
- **REQ-INV-3** — While the request is in flight, a loading message
  (`Loading products…`) is shown and the Sort control is disabled.
- **REQ-INV-4** — If the request fails (non-2xx response or network error), an
  error notice (`Couldn't load inventory.` plus the error detail) is shown with
  `role="alert"`. No product grid is rendered.
- **REQ-INV-5** — Only products present in both the API response and the static
  catalog are displayed; an API product with no matching catalog entry is dropped.

## 4. Catalog

The catalog contains **6 products**:

| ID    | Name                | Price    | Stock | Status        | Button       |
|-------|---------------------|----------|-------|---------------|--------------|
| p-001 | Workshop Backpack   | $29.99   | 14    | In stock      | Add to cart  |
| p-002 | Mechanical Keyboard | $89.50   | 7     | In stock      | Add to cart  |
| p-003 | Lab Notebook        | $12.00   | 42    | In stock      | Add to cart  |
| p-004 | Aeropress Go        | $39.95   | 0     | Out of stock  | Unavailable  |
| p-005 | Desk Lamp           | $45.00   | 3     | Only 3 left   | Add to cart  |
| p-006 | Field Recorder      | $199.00  | 1     | Only 1 left   | Add to cart  |

## 5. Product Card

- **REQ-INV-6** — Each product is rendered as a card showing: product image,
  name, short description, stock status, price, and an action button.
- **REQ-INV-7** — Prices are displayed in USD with two decimal places
  (e.g. `$12.00`, `$199.00`).

### Stock status

- **REQ-INV-8** — Stock status is derived from the `stock` count:
  - `stock <= 0` → **"Out of stock"** (danger tone).
  - `0 < stock < 5` → **"Only N left"** where N is the stock count (warning tone).
  - `stock >= 5` → **"In stock"** (ok tone).

### Action button

- **REQ-INV-9** — When the product is in stock and **not** in the cart, the card
  shows an enabled **"Add to cart"** button.
- **REQ-INV-10** — When the product is **out of stock** (`stock <= 0`), the card
  shows a disabled **"Unavailable"** button that cannot be clicked.
- **REQ-INV-11** — When the product **is** in the cart, the card shows a
  **"Remove"** button (secondary/highlighted state) in place of "Add to cart".

## 6. Sorting

- **REQ-INV-12** — A **Sort** dropdown is shown in the page header. It offers four
  options and defaults to **"Name (A–Z)"**.
- **REQ-INV-13** — Changing the Sort option re-orders the product grid instantly
  (no page reload). The supported orders are:
  - **Name (A–Z)** — alphabetical:
    Aeropress Go, Desk Lamp, Field Recorder, Lab Notebook, Mechanical Keyboard, Workshop Backpack
  - **Name (Z–A)** — reverse alphabetical:
    Workshop Backpack, Mechanical Keyboard, Lab Notebook, Field Recorder, Desk Lamp, Aeropress Go
  - **Price (low–high)**:
    Lab Notebook ($12.00), Workshop Backpack ($29.99), Aeropress Go ($39.95), Desk Lamp ($45.00), Mechanical Keyboard ($89.50), Field Recorder ($199.00)
  - **Price (high–low)**:
    Field Recorder ($199.00), Mechanical Keyboard ($89.50), Desk Lamp ($45.00), Aeropress Go ($39.95), Workshop Backpack ($29.99), Lab Notebook ($12.00)

## 7. Cart Interaction from Inventory

- **REQ-INV-14** — Clicking **"Add to cart"** adds the product to the cart, the
  card's button switches to **"Remove"**, and the header Cart badge increments.
- **REQ-INV-15** — The header Cart badge reflects the number of distinct items in
  the cart. When the cart is empty, the badge is not shown (or shows no count).
- **REQ-INV-16** — Multiple items can be added; the badge increments with each
  add (e.g. 1, 2, 3) and each added product's card shows "Remove".
- **REQ-INV-17** — Clicking **"Remove"** on a card removes the item from the cart,
  reverts the button to **"Add to cart"**, and decrements the header badge.
- **REQ-INV-18** — Cart state persists across navigation: returning to the
  Inventory page shows the same badge count and the same cards in their
  "Remove" state.

## 8. Test Coverage

Scenarios are specified in
[specs/inventory-cart.plan.md](inventory-cart.plan.md) and implemented under
[tests/inventory/](../tests/inventory/):

| Requirement(s)          | Spec file |
|-------------------------|-----------|
| REQ-INV-6 … 11          | `displays-all-products.spec.ts` |
| REQ-INV-12, 13          | `sort-name-asc.spec.ts`, `sort-name-desc.spec.ts`, `sort-price-asc.spec.ts`, `sort-price-desc.spec.ts` |
| REQ-INV-14, 15          | `add-single-item.spec.ts` |
| REQ-INV-16              | `add-multiple-items.spec.ts` |
| REQ-INV-17              | `remove-item-from-inventory.spec.ts` |
| REQ-INV-10              | `out-of-stock.spec.ts` |
