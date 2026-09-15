# Deployment Guide — Vercel

NovaStore is a Next.js application and can be deployed from its GitHub repository to Vercel.

## 1. Pre-deployment checks

From the project root:

```bash
npm run lint
npm run build
```

Both must pass before deployment.

Make sure the latest code is on GitHub:

```bash
git status
git add .
git commit -m "docs: finalize NovaStore documentation"
git push
```

Skip the commit command if the working tree is already clean.

## 2. Import the GitHub repository

In Vercel:

1. Sign in with GitHub.
2. Choose **Add New → Project**.
3. Import the `novastore` GitHub repository.
4. Leave the framework preset as **Next.js**.
5. Leave the root directory as the repository root.
6. Use the detected build/install settings.

## 3. Add environment variables

Before the final deployment, add the same server-side configuration used locally under the Vercel project's **Settings → Environment Variables**.

Required values:

```text
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DYNAMODB_USERS_TABLE
DYNAMODB_PRODUCTS_TABLE
DYNAMODB_CATEGORIES_TABLE
DYNAMODB_CART_TABLE
DYNAMODB_WISHLIST_TABLE
DEMO_USER_ID
```

Example non-secret values:

```text
AWS_REGION=eu-central-1
DYNAMODB_USERS_TABLE=InternStore-Users
DYNAMODB_PRODUCTS_TABLE=InternStore-Products
DYNAMODB_CATEGORIES_TABLE=InternStore-Categories
DYNAMODB_CART_TABLE=InternStore-Cart
DYNAMODB_WISHLIST_TABLE=InternStore-Wishlist
DEMO_USER_ID=demo-user-1
```

Use your real AWS credential values only inside Vercel's protected environment-variable UI. Never paste them into GitHub or README files.

After adding/changing environment variables, redeploy so the deployment receives the new configuration.

## 4. Deploy

Click **Deploy** and wait for the production build to finish.

If deployment fails:
- open the build logs
- locate the first real error
- reproduce locally with `npm run build`
- fix locally
- commit and push

## 5. Production smoke test

Open your Vercel URL and test:

```text
/
/products
/products?q=chair
/products/prod-headphones
/cart
/wishlist
/account
/api/health
/api/health/database
/api/products?q=chair
/api/cart
/api/wishlist
/api/users/me
```

You can also run:

```powershell
$env:BASE_URL="https://your-project.vercel.app"
node scripts/final-smoke-test.mjs
```

## 6. Security check

Before submission:

```bash
git status --ignored
git ls-files .env.local
```

`git ls-files .env.local` should print nothing.

Also inspect the GitHub repository and confirm no real access keys are present.

If an AWS key was ever committed publicly, rotate/revoke that key in AWS rather than only deleting the file from the latest commit.

## 7. Final README update

After deployment, replace the README line:

```text
Live project: add your Vercel URL here after deployment.
```

with your real live URL. Commit and push that final README change.
