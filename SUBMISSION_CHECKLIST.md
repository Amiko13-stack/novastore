# NovaStore Internship Submission Checklist

## Repository
- [ ] GitHub repository opens publicly or with the access required by the internship dashboard
- [ ] latest Day 6 + final documentation changes are pushed
- [ ] default branch is `main`
- [ ] `.env.local` is not tracked
- [ ] no AWS secret key appears anywhere in the repository
- [ ] commit history has meaningful messages

## Required functionality
- [ ] responsive homepage
- [ ] categories
- [ ] product listing
- [ ] product detail page
- [ ] search
- [ ] filtering
- [ ] product information/images
- [ ] related products
- [ ] user data management
- [ ] DynamoDB products/categories/users/cart/wishlist
- [ ] add/update/remove cart items
- [ ] cart subtotal
- [ ] wishlist add/remove
- [ ] duplicate prevention
- [ ] loading states
- [ ] empty states
- [ ] error handling
- [ ] validation
- [ ] custom 404

## Engineering checks
- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] `node scripts/final-smoke-test.mjs` passes against local app
- [ ] DynamoDB tables are in expected AWS region
- [ ] production environment variables are configured
- [ ] server/API/business/database layers remain separated

## Deployment
- [ ] Vercel production deployment succeeds
- [ ] `/api/health` works in production
- [ ] `/api/health/database` works in production
- [ ] cart persists in production
- [ ] wishlist persists in production
- [ ] account updates persist in production
- [ ] production URL added to README

## Screenshots to capture
Capture clean screenshots with browser DevTools closed:

1. [ ] Homepage hero + navbar
2. [ ] Homepage categories / featured products
3. [ ] Product listing with filters/search visible
4. [ ] Product detail page
5. [ ] Cart with multiple items and subtotal
6. [ ] Wishlist with saved products
7. [ ] Account/profile page
8. [ ] Mobile homepage or product listing
9. [ ] Optional AWS DynamoDB table screenshot (do not expose credentials)

Recommended screenshot width for desktop: around 1440px.

## Internship Dashboard submission
- [ ] GitHub Repository Link
- [ ] Live Project Link (if deployed)
- [ ] README.md complete
- [ ] Screenshots ready
- [ ] final repository push completed

## Final demo flow
Practice this 2–3 minute sequence before presenting:

```text
Homepage
→ Shop
→ Search/filter
→ Product detail
→ Add to bag
→ Change quantity
→ Wishlist a product
→ Show wishlist
→ Show account/profile persistence
→ Briefly explain architecture and DynamoDB tables
```
