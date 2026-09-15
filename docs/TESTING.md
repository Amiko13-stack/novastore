# Final Testing Guide

Run this checklist before deployment and again against the production URL.

## Automated checks

```bash
npm run lint
npm run build
```

Then start the app:

```bash
npm run dev
```

In a second terminal:

```bash
node scripts/final-smoke-test.mjs
```

Set a different target URL when testing production:

PowerShell:

```powershell
$env:BASE_URL="https://your-project.vercel.app"
node scripts/final-smoke-test.mjs
```

## Storefront

- [ ] Homepage loads without console errors caused by application code
- [ ] Header/navigation works
- [ ] Hero, categories, featured products, editorial sections render correctly
- [ ] `/products` loads all products
- [ ] Individual product page loads
- [ ] Related products open at the top of the next product page
- [ ] Invalid product shows the custom 404 state

## Search / Filter / Sort

- [ ] Search for `chair`
- [ ] Search for `headphones`
- [ ] Category filter works
- [ ] `maxPrice=100` works
- [ ] custom min/max works
- [ ] price ascending works
- [ ] price descending works
- [ ] name A-Z works
- [ ] multiple filters work together
- [ ] clear-all resets filters
- [ ] no-results state renders properly
- [ ] URL reflects active filters

Useful URLs:

```text
/products?q=chair
/products?categoryId=cat-fashion
/products?maxPrice=100
/products?minPrice=100&maxPrice=200
/products?sort=price-asc
/products?q=street&categoryId=cat-fashion&maxPrice=100
```

## Cart

- [ ] Add to Bag works from a product page
- [ ] Header bag count updates
- [ ] `/cart` shows the product
- [ ] `+` increases quantity
- [ ] `-` decreases quantity
- [ ] quantity does not fall below 1
- [ ] quantity cannot exceed stock
- [ ] subtotal updates correctly
- [ ] adding the same product again increases quantity instead of duplicating a row
- [ ] refreshing the page preserves the cart
- [ ] Remove deletes the product
- [ ] DynamoDB `InternStore-Cart` contains expected records

## Wishlist

- [ ] Heart button saves a product
- [ ] Header wishlist count updates
- [ ] `/wishlist` displays saved products
- [ ] refresh preserves saved products
- [ ] repeated save does not create duplicate records
- [ ] heart/remove action removes the product
- [ ] DynamoDB `InternStore-Wishlist` contains expected records

## User profile

- [ ] `/account` loads
- [ ] demo user is created when needed
- [ ] name/email update succeeds
- [ ] refresh preserves edited data
- [ ] `/api/users/me` returns current user
- [ ] DynamoDB `InternStore-Users` contains the user

## API

- [ ] `/api/health`
- [ ] `/api/health/database`
- [ ] `/api/categories`
- [ ] `/api/products`
- [ ] `/api/products?q=chair`
- [ ] `/api/cart`
- [ ] `/api/wishlist`
- [ ] `/api/users/me`

## Responsive QA

Test approximately:

- [ ] 390px mobile
- [ ] 768px tablet
- [ ] 1024px laptop
- [ ] 1440px desktop

Check:
- [ ] no horizontal scrolling
- [ ] mobile menu opens/closes
- [ ] buttons are large enough to use
- [ ] product cards do not overflow
- [ ] filter controls fit correctly
- [ ] product-detail CTA layout remains usable
- [ ] cart summary is readable
- [ ] account form is readable

## Browser QA

At minimum test current Chrome/Edge desktop. Also inspect DevTools Console while navigating key flows. A browser extension can cause React hydration warnings by modifying HTML; verify suspicious warnings in an Incognito window with extensions disabled before treating them as application bugs.
