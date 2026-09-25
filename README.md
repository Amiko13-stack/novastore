# NovaStore — E-commerce Admin Dashboard

NovaStore combines a Next.js storefront with a responsive admin dashboard built
with React, TypeScript, Tailwind CSS, and AWS DynamoDB.

## Submission links

- Repository: https://github.com/Amiko13-stack/novastore
- Hosted dashboard: https://novastore-admin-amiko.amovardo2007.chatgpt.site/admin
- Screenshots: docs/screenshots
- The hosted default view is explicitly labelled sample mode.

## Dashboard

- Overview: total users, products, categories, cart quantities, wishlist entries,
  inventory by category, low-stock indicators, and recently updated products.
- Products: create, view, edit, delete, stock updates, search, category/stock
  filters, pagination, featured products, and validated details.
- Categories: create, view, edit, delete, search, and pagination.
- Users: list, inspect details and relationships, update, delete, search, and pagination.
- Carts and wishlists: inspect user/product relationships and remove entries.
- Confirmation dialogs, loading feedback, empty states, error messages, and
  responsive layouts including mobile product cards.
- Server-side administrator authorization on administrative data and mutations.

The default /admin workspace contains clearly labelled sample data. Changes in
sample mode are held in memory and reset on reload; sample data is never written
to AWS. Connect store switches to the actual database when server configuration
and an administrator key are available.

## Architecture

Browser → Next.js route handlers → validation/services → repositories → DynamoDB.

The standard Next.js build remains available. A separate Vinext/Vite adapter
produces the Cloudflare Worker artifact used by Sites hosting.

## Local setup

Requires Node.js 22.12 or later for both the Next.js and Sites builds.

1. Clone this repository and run npm ci.
2. Run npm run dev.
3. Open http://localhost:3000/admin to explore the sample dashboard.

Live data requires an ignored .env.local file with the variables documented in
.env.example. AWS credentials must be supplied through the server environment or
the standard AWS credential provider chain. For local development, AWS CLI
sign-in can supply short-lived credentials. Do not commit credentials.

ADMIN_ACCESS_KEY must contain at least 32 random characters. Enter this key in
Connect store. It stays in browser memory only; reload/disconnect ends the
session. Use HTTPS outside local development.

## Existing DynamoDB tables

| Table | Partition key | Sort key |
| --- | --- | --- |
| InternStore-Users | userId | — |
| InternStore-Products | productId | — |
| InternStore-Categories | categoryId | — |
| InternStore-Cart | userId | productId |
| InternStore-Wishlist | userId | productId |

Products use categoryId-createdAt-index for category queries. Table names are
configurable. Setup and seed scripts exist for a **new development database**;
do not run them against an existing store without checking the data first.

## Verification

- npm run lint
- npm run build — Next.js and Sites production builds
- npm run build:next — standard Next.js production build
- npm run build:site — Sites/Cloudflare Worker build
- npm run test:admin-auth — missing, invalid, and valid administrator credentials
- npm run test:admin-db — isolated DynamoDB-compatible integration suite
- node scripts/admin-preview-test.mjs — product browser flows
- node scripts/admin-records-test.mjs — category/user/cart/wishlist browser flows

Browser tests require a running local server and Playwright. Set
PLAYWRIGHT_MODULE to an installed Playwright module path if it is not available
in the project. Tests use installed Microsoft Edge by default. Database tests
use an ephemeral local Dynalite instance and never access the AWS account.

## Administrative API

All endpoints below require Authorization: Bearer <ADMIN_ACCESS_KEY>.

| Endpoint | Purpose |
| --- | --- |
| GET /api/health/database | Authenticated connection status and record counts |
| GET /api/admin | Read all five datasets; follows DynamoDB pagination |
| POST /api/admin/manage | Category CRUD, user update/delete, cart/wishlist removal |
| POST /api/products | Create product |
| PATCH /api/products/:productId | Edit product, including stock |
| DELETE /api/products/:productId | Delete unreferenced product |
| POST /api/categories | Create category |

Public storefront product/category reads remain public. Invalid input returns
400, unauthorized requests 401, missing admin configuration 503, missing records
404, and records still in use 409.

## Deletion rules and limits

Products cannot be deleted while referenced by carts or wishlists. Categories
cannot be deleted while containing products. Users cannot be deleted while
they have cart or wishlist items. Remove/reassign related data explicitly first.

Relationship checks use consistent scans followed by a conditional or keyed
write, not a cross-table serializable transaction. Concurrent storefront writes
can race with those checks. The snapshot-based admin reads and client-side
search/pagination are intended for an internship-sized dataset. A production
store with concurrent writers or large datasets needs coordinated relation
locking/tombstones, indexed queries, and server-side pagination.

The administrator key is a shared secret, not a per-user role-based login system.
The storefront retains its existing demo-user abstraction for local development.
The public admin deployment sets ADMIN_ONLY_MODE=true: storefront pages redirect
to /admin and shared demo-customer API requests are rejected with 403.

## Submission

See [submission checklist](SUBMISSION_CHECKLIST.md) and [AWS connection guide](docs/AWS_CONNECTION.md).
Dashboard screenshots are in [docs/screenshots](docs/screenshots).
