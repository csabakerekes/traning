# Inventory and Cart Test Plan

## Application Overview

Comprehensive Playwright test plan for the Inventory and Cart functionality of the workshop demo e-commerce store (https://playwright-workshop.pages.dev/inventory). The application features client-side authentication, dynamic catalog loading from GET /api/products, product sorting, real-time cart manipulation from product cards, stock level badges, and persistent cart state across navigation. All interactive elements are tagged with data-test attributes.

## Test Scenarios

### 1. Access & Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Redirect unauthenticated user accessing inventory to login page

**File:** `tests/inventory/auth-access.spec.ts`

**Steps:**
  1. Clear authentication credentials from localStorage ('workshop-auth') and navigate directly to /inventory
    - expect: Browser automatically redirects to /login
    - expect: Page URL matches /login
    - expect: Sign-in form heading 'Sign in' is displayed
    - expect: Username textbox [data-test="username"] and Password textbox [data-test="password"] are visible
    - expect: Sign in button [data-test="login-submit"] is visible
  2. Fill username 'standard_user', fill password 'workshop123', and click 'Sign in' button
    - expect: User is authenticated and redirected to /inventory
    - expect: Inventory page heading 'Products' is visible
    - expect: User session indicates 'Logout (standard_user)' in the header

### 2. Data Loading & Error Handling

**Seed:** `tests/seed.spec.ts`

#### 2.1. Display loading state and disable sort control while catalog request is in flight

**File:** `tests/inventory/data-loading-errors.spec.ts`

**Steps:**
  1. Intercept GET /api/products with a delayed response and navigate to /inventory as authenticated user
    - expect: Loading indicator text 'Loading products…' is displayed in place of the product grid
    - expect: Sort combobox [data-test="sort"] is disabled (has disabled attribute)
  2. Fulfill the intercepted GET /api/products request with standard catalog JSON
    - expect: Loading message disappears
    - expect: Sort combobox [data-test="sort"] becomes enabled
    - expect: Product grid [data-test="inventory"] renders all 6 product cards

#### 2.2. Display alert banner and hide product grid when catalog API request fails

**File:** `tests/inventory/data-loading-errors.spec.ts`

**Steps:**
  1. Intercept GET /api/products to return HTTP 500 Internal Server Error and navigate to /inventory
    - expect: Error notice with role="alert" containing text "Couldn't load inventory. HTTP 500" is displayed
    - expect: Sort combobox [data-test="sort"] remains disabled
    - expect: No product grid [data-test="inventory"] is rendered
    - expect: Zero .product-card elements exist in the DOM

#### 2.3. Drop API products that do not match the static catalog

**File:** `tests/inventory/data-loading-errors.spec.ts`

**Steps:**
  1. Intercept GET /api/products to inject an extra product payload with id 'p-999' and name 'Unknown Item' and navigate to /inventory
    - expect: Catalog renders only products present in both API response and static catalog metadata
    - expect: Unknown product 'p-999' is excluded from the product grid
    - expect: Product grid displays exactly the 6 valid known products

### 3. Catalog & Product Cards Display

**Seed:** `tests/seed.spec.ts`

#### 3.1. Render all 6 products with complete card details, USD currency format, and correct stock status badges

**File:** `tests/inventory/displays-all-products.spec.ts`

**Steps:**
  1. Log in with standard_user and navigate to /inventory
    - expect: Product grid [data-test="inventory"] is visible
    - expect: Product grid contains exactly 6 product cards (.product-card)
  2. Verify product card details for Workshop Backpack (p-001)
    - expect: Product image [data-test="product-image-p-001"] has alt text 'Workshop Backpack'
    - expect: Product name [data-test="product-name-p-001"] displays 'Workshop Backpack'
    - expect: Product description [data-test="product-description-p-001"] displays 'Carry-on backpack with padded laptop sleeve and water bottle pocket.'
    - expect: Stock badge [data-test="product-stock-p-001"] displays 'In stock' (stock = 14)
    - expect: Price [data-test="product-price-p-001"] displays '$29.99' in USD currency format
    - expect: Action button [data-test="add-p-001"] displays 'Add to cart' and is enabled
  3. Verify product card details for Mechanical Keyboard (p-002)
    - expect: Product image [data-test="product-image-p-002"] has alt text 'Mechanical Keyboard'
    - expect: Product name [data-test="product-name-p-002"] displays 'Mechanical Keyboard'
    - expect: Product description [data-test="product-description-p-002"] displays '75% layout with hot-swappable switches and per-key RGB.'
    - expect: Stock badge [data-test="product-stock-p-002"] displays 'In stock' (stock = 7)
    - expect: Price [data-test="product-price-p-002"] displays '$89.50' in USD currency format
    - expect: Action button [data-test="add-p-002"] displays 'Add to cart' and is enabled
  4. Verify product card details for Lab Notebook (p-003)
    - expect: Product image [data-test="product-image-p-003"] has alt text 'Lab Notebook'
    - expect: Product name [data-test="product-name-p-003"] displays 'Lab Notebook'
    - expect: Product description [data-test="product-description-p-003"] displays 'Dot-grid notebook with numbered pages and an index. 200 sheets.'
    - expect: Stock badge [data-test="product-stock-p-003"] displays 'In stock' (stock = 42)
    - expect: Price [data-test="product-price-p-003"] displays '$12.00' in USD currency format
    - expect: Action button [data-test="add-p-003"] displays 'Add to cart' and is enabled
  5. Verify product card details for Aeropress Go (p-004)
    - expect: Product image [data-test="product-image-p-004"] has alt text 'Aeropress Go'
    - expect: Product name [data-test="product-name-p-004"] displays 'Aeropress Go'
    - expect: Product description [data-test="product-description-p-004"] displays 'Portable coffee press for travel. Brews a single cup in under a minute.'
    - expect: Stock badge [data-test="product-stock-p-004"] displays 'Out of stock' (stock = 0)
    - expect: Price [data-test="product-price-p-004"] displays '$39.95' in USD currency format
    - expect: Action button [data-test="add-p-004"] displays 'Unavailable' and is disabled
  6. Verify product card details for Desk Lamp (p-005)
    - expect: Product image [data-test="product-image-p-005"] has alt text 'Desk Lamp'
    - expect: Product name [data-test="product-name-p-005"] displays 'Desk Lamp'
    - expect: Product description [data-test="product-description-p-005"] displays 'Warm-white LED with three brightness levels and a USB charging port.'
    - expect: Stock badge [data-test="product-stock-p-005"] displays 'Only 3 left' (stock = 3)
    - expect: Price [data-test="product-price-p-005"] displays '$45.00' in USD currency format
    - expect: Action button [data-test="add-p-005"] displays 'Add to cart' and is enabled
  7. Verify product card details for Field Recorder (p-006)
    - expect: Product image [data-test="product-image-p-006"] has alt text 'Field Recorder'
    - expect: Product name [data-test="product-name-p-006"] displays 'Field Recorder'
    - expect: Product description [data-test="product-description-p-006"] displays 'Two-channel handheld recorder with XLR inputs and a built-in stereo mic.'
    - expect: Stock badge [data-test="product-stock-p-006"] displays 'Only 1 left' (stock = 1)
    - expect: Price [data-test="product-price-p-006"] displays '$199.00' in USD currency format
    - expect: Action button [data-test="add-p-006"] displays 'Add to cart' and is enabled

### 4. Out of Stock Product Handling

**Seed:** `tests/seed.spec.ts`

#### 4.1. Out of stock product renders disabled Unavailable button and cannot be added to cart

**File:** `tests/inventory/out-of-stock.spec.ts`

**Steps:**
  1. Log in as standard_user and locate Aeropress Go (p-004) card on /inventory
    - expect: Stock status badge [data-test="product-stock-p-004"] displays 'Out of stock'
    - expect: Action button [data-test="add-p-004"] displays text 'Unavailable'
    - expect: Action button [data-test="add-p-004"] has disabled attribute (is disabled)
  2. Inspect Cart link in the header
    - expect: Cart badge [data-test="cart-badge"] does not exist in the DOM
  3. Attempt to click disabled button [data-test="add-p-004"]
    - expect: Disabled button does not dispatch cart addition
    - expect: Button text remains 'Unavailable'
    - expect: Cart badge remains not displayed

### 5. Product Sorting

**Seed:** `tests/seed.spec.ts`

#### 5.1. Sort products alphabetically by Name (A-Z) by default and after changing sort option

**File:** `tests/inventory/sort-name-asc.spec.ts`

**Steps:**
  1. Log in as standard_user and navigate to /inventory
    - expect: Sort select control [data-test="sort"] has 'name-asc' selected by default with label 'Name (A–Z)'
  2. Read all product headings (.product-card h3) in DOM order
    - expect: Product cards are rendered in exact alphabetical order: Aeropress Go, Desk Lamp, Field Recorder, Lab Notebook, Mechanical Keyboard, Workshop Backpack
  3. Select 'price-asc' and then select 'name-asc' again in [data-test="sort"]
    - expect: Products re-order instantly without full page reload back to: Aeropress Go, Desk Lamp, Field Recorder, Lab Notebook, Mechanical Keyboard, Workshop Backpack

#### 5.2. Sort products in reverse alphabetical order by Name (Z-A)

**File:** `tests/inventory/sort-name-desc.spec.ts`

**Steps:**
  1. Select 'name-desc' ('Name (Z–A)') from sort dropdown [data-test="sort"]
    - expect: Selected value of [data-test="sort"] updates to 'name-desc'
    - expect: Page re-orders items instantly without a full page reload
    - expect: Product titles match reverse alphabetical sequence: Workshop Backpack, Mechanical Keyboard, Lab Notebook, Field Recorder, Desk Lamp, Aeropress Go

#### 5.3. Sort products by Price (low-high) in ascending numerical price order

**File:** `tests/inventory/sort-price-asc.spec.ts`

**Steps:**
  1. Select 'price-asc' ('Price (low–high)') from sort dropdown [data-test="sort"]
    - expect: Selected value of [data-test="sort"] updates to 'price-asc'
    - expect: Page re-orders items instantly without a full page reload
    - expect: Product cards match ascending price sequence: Lab Notebook ($12.00), Workshop Backpack ($29.99), Aeropress Go ($39.95), Desk Lamp ($45.00), Mechanical Keyboard ($89.50), Field Recorder ($199.00)

#### 5.4. Sort products by Price (high-low) in descending numerical price order

**File:** `tests/inventory/sort-price-desc.spec.ts`

**Steps:**
  1. Select 'price-desc' ('Price (high–low)') from sort dropdown [data-test="sort"]
    - expect: Selected value of [data-test="sort"] updates to 'price-desc'
    - expect: Page re-orders items instantly without a full page reload
    - expect: Product cards match descending price sequence: Field Recorder ($199.00), Mechanical Keyboard ($89.50), Desk Lamp ($45.00), Aeropress Go ($39.95), Workshop Backpack ($29.99), Lab Notebook ($12.00)

### 6. Cart Interaction from Inventory

**Seed:** `tests/seed.spec.ts`

#### 6.1. Add single item to cart from inventory, increment badge, and toggle button to Remove

**File:** `tests/inventory/add-single-item.spec.ts`

**Steps:**
  1. Log in as standard_user with empty cart and view Workshop Backpack (p-001) on /inventory
    - expect: Cart badge [data-test="cart-badge"] is not present in header
    - expect: Workshop Backpack button [data-test="add-p-001"] displays 'Add to cart'
  2. Click 'Add to cart' button [data-test="add-p-001"]
    - expect: Button switches from 'Add to cart' to 'Remove' with test id [data-test="remove-p-001"]
    - expect: Header Cart link renders badge [data-test="cart-badge"] with text '1'
  3. Click Cart link in header to open /cart
    - expect: Navigation to /cart succeeds
    - expect: Cart item list contains 'Workshop Backpack'
    - expect: Cart badge still displays '1'

#### 6.2. Add multiple items to cart from inventory and verify cumulative badge increments

**File:** `tests/inventory/add-multiple-items.spec.ts`

**Steps:**
  1. Log in as standard_user with empty cart on /inventory
    - expect: Cart badge [data-test="cart-badge"] is not visible
  2. Click 'Add to cart' on Workshop Backpack [data-test="add-p-001"]
    - expect: Button toggles to 'Remove' [data-test="remove-p-001"]
    - expect: Cart badge [data-test="cart-badge"] displays '1'
  3. Click 'Add to cart' on Mechanical Keyboard [data-test="add-p-002"]
    - expect: Button toggles to 'Remove' [data-test="remove-p-002"]
    - expect: Cart badge [data-test="cart-badge"] increments to '2'
  4. Click 'Add to cart' on Lab Notebook [data-test="add-p-003"]
    - expect: Button toggles to 'Remove' [data-test="remove-p-003"]
    - expect: Cart badge [data-test="cart-badge"] increments to '3'
    - expect: All three added cards show 'Remove' buttons concurrently
    - expect: Remaining available items (Desk Lamp, Field Recorder) show 'Add to cart'
    - expect: Out of stock item (Aeropress Go) shows disabled 'Unavailable'

#### 6.3. Remove item directly from inventory card to decrement badge and revert button state

**File:** `tests/inventory/remove-item-from-inventory.spec.ts`

**Steps:**
  1. Log in as standard_user and add Workshop Backpack (p-001) and Lab Notebook (p-003) to cart
    - expect: Cart badge [data-test="cart-badge"] displays '2'
    - expect: Workshop Backpack button is [data-test="remove-p-001"]
    - expect: Lab Notebook button is [data-test="remove-p-003"]
  2. Click 'Remove' button [data-test="remove-p-001"] on Workshop Backpack card
    - expect: Workshop Backpack button reverts to 'Add to cart' [data-test="add-p-001"]
    - expect: Cart badge [data-test="cart-badge"] decrements to '1'
    - expect: Lab Notebook button remains 'Remove' [data-test="remove-p-003"]
  3. Click 'Remove' button [data-test="remove-p-003"] on Lab Notebook card
    - expect: Lab Notebook button reverts to 'Add to cart' [data-test="add-p-003"]
    - expect: Cart badge [data-test="cart-badge"] is removed from header (no badge rendered)

#### 6.4. Persist cart items and card button states across cross-page navigation and page reload

**File:** `tests/inventory/cart-persistence.spec.ts`

**Steps:**
  1. Log in as standard_user and add Mechanical Keyboard (p-002) and Field Recorder (p-006) to cart
    - expect: Cart badge [data-test="cart-badge"] displays '2'
    - expect: Buttons for p-002 and p-006 display 'Remove'
  2. Navigate to /cart via header Cart link
    - expect: Page navigates to /cart
    - expect: Cart badge displays '2'
    - expect: Mechanical Keyboard and Field Recorder appear in the cart list
  3. Navigate back to /inventory
    - expect: Page navigates back to /inventory
    - expect: Cart badge [data-test="cart-badge"] displays '2'
    - expect: Mechanical Keyboard card button displays 'Remove' [data-test="remove-p-002"]
    - expect: Field Recorder card button displays 'Remove' [data-test="remove-p-006"]
    - expect: Other item cards show 'Add to cart' or disabled 'Unavailable'
  4. Reload the page via browser reload
    - expect: Cart badge [data-test="cart-badge"] remains '2' after reload
    - expect: Mechanical Keyboard and Field Recorder cards continue to display 'Remove' buttons
