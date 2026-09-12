# NovaStore — Day 2

Day 2 adds the real product/category backend.

## New folders/files

- `src/repositories/category.repository.ts`
- `src/repositories/product.repository.ts`
- `src/services/category.service.ts`
- `src/services/product.service.ts`
- `src/lib/http/api-error.ts`
- `src/lib/validation/category.schema.ts`
- `src/lib/validation/product.schema.ts`
- `src/utils/slugify.ts`
- `src/app/api/categories/route.ts`
- `src/app/api/products/route.ts`
- `src/app/api/products/[productId]/route.ts`
- `scripts/seed-database.mjs`

## Run

From the project root:

```powershell
npm run dev
```

In a second terminal, from the project root:

```powershell
node scripts/seed-database.mjs
```

## Test URLs

- `http://localhost:3000/api/categories`
- `http://localhost:3000/api/products`
- `http://localhost:3000/api/products?categoryId=cat-electronics`
- `http://localhost:3000/api/products/prod-headphones`

## Final checks

```powershell
npm run lint
npm run build
```

Then commit:

```powershell
git add .
git commit -m "feat: add product and category data layer"
git push
```
