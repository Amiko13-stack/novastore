# NovaStore

NovaStore is a production-style full-stack e-commerce application built with Next.js, React, TypeScript, Tailwind CSS, and AWS DynamoDB. It demonstrates the complete software-engineering workflow required for the internship task: requirements analysis, architecture, database design, server/API logic, validation, business rules, responsive UI, testing, documentation, and deployment readiness.

> Live project: add your Vercel URL here after deployment.

## Features

### Storefront
- Premium responsive homepage
- Product categories and category browsing
- Product listing and product detail pages
- Product images and product information
- Related products
- Search by product name, description, and slug
- Category and price filtering
- Sorting by newest, price, and name
- Shareable URL-based catalog filters
- Loading, empty, error, and custom 404 states

### Shopping cart
- Add products to cart
- Persistent DynamoDB-backed cart
- Increase/decrease quantity
- Remove items
- Server-calculated line totals and subtotal
- Stock validation
- Duplicate prevention using `(userId, productId)` as the DynamoDB key
- Header cart item count

### Wishlist
- Add/remove products from wishlist
- Persistent DynamoDB-backed wishlist
- Duplicate prevention using `(userId, productId)`
- Wishlist count in navigation
- Wishlist page using real product data

### User data
- Demo-user abstraction through `getCurrentUserId()`
- User profile creation and updates
- Persistent user data in DynamoDB
- API endpoint for current-user data

### Engineering quality
- Next.js App Router
- Server Components for server-side reads
- Route Handlers for APIs
- Repository layer for DynamoDB access
- Service layer for business logic
- Zod validation for important inputs
- Structured API errors
- TypeScript entity contracts
- Environment-based configuration
- No AWS credentials exposed to browser code
- Git/GitHub workflow with meaningful commits

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Server/API | Next.js Route Handlers / Server Components |
| Database | AWS DynamoDB |
| Validation | Zod |
| AWS integration | AWS SDK for JavaScript v3 |
| Version control | Git + GitHub |
| Deployment | Vercel-ready |

## Architecture

```text
User / Browser
      ↓
Next.js Application
      ↓
Pages + React Components
      ↓
Server Components / Route Handlers
      ↓
Validation + Service Layer
      ↓
Repository Layer
      ↓
AWS SDK v3
      ↓
Amazon DynamoDB
```

UI components never access AWS credentials or DynamoDB directly. Server-side code owns validation, business rules, totals, persistence, and database access.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a detailed explanation.

## DynamoDB Design

NovaStore uses five tables:

| Table | Partition key | Sort key | Purpose |
|---|---|---|---|
| `InternStore-Users` | `userId` | — | User profiles |
| `InternStore-Products` | `productId` | — | Product catalog |
| `InternStore-Categories` | `categoryId` | — | Product categories |
| `InternStore-Cart` | `userId` | `productId` | Persistent shopping cart |
| `InternStore-Wishlist` | `userId` | `productId` | Persistent wishlist |

Products also use the `categoryId-createdAt-index` Global Secondary Index:

- Partition key: `categoryId`
- Sort key: `createdAt`
- Purpose: efficient category product queries

See [`docs/DATABASE_DESIGN.md`](docs/DATABASE_DESIGN.md) for entity shapes, access patterns, and business rules.

## Project Structure

```text
novastore/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── DATABASE_DESIGN.md
│   ├── DEPLOYMENT.md
│   └── TESTING.md
├── scripts/
│   ├── create-dynamodb-tables.mjs
│   ├── seed-database.mjs
│   └── final-smoke-test.mjs
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── account/
│   │   ├── cart/
│   │   ├── products/
│   │   └── wishlist/
│   ├── components/
│   ├── lib/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── db/
│   │   ├── http/
│   │   └── validation/
│   ├── repositories/
│   ├── services/
│   ├── types/
│   └── utils/
├── .env.example
├── package.json
└── README.md
```

## Environment Variables

Create `.env.local` in the project root for local development:

```env
AWS_REGION=eu-central-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

DYNAMODB_USERS_TABLE=InternStore-Users
DYNAMODB_PRODUCTS_TABLE=InternStore-Products
DYNAMODB_CATEGORIES_TABLE=InternStore-Categories
DYNAMODB_CART_TABLE=InternStore-Cart
DYNAMODB_WISHLIST_TABLE=InternStore-Wishlist

DEMO_USER_ID=demo-user-1
```

Never commit `.env.local` or real AWS credentials. `.env.example` is safe to commit because it contains placeholders only.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Amiko13-stack/novastore.git
cd novastore
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and provide your own AWS values.

### 4. Create the DynamoDB tables

```bash
node scripts/create-dynamodb-tables.mjs
```

### 5. Seed the demo catalog

```bash
node scripts/seed-database.mjs
```

### 6. Start development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Quality Checks

```bash
npm run lint
npm run build
```

With the development server running, the optional final smoke test can be run with:

```bash
node scripts/final-smoke-test.mjs
```

See [`docs/TESTING.md`](docs/TESTING.md) for the complete manual test matrix.

## Main API Routes

```text
GET/POST                /api/products
GET/PATCH/DELETE        /api/products/:productId
GET/POST                /api/categories
GET/POST                /api/cart
PATCH/DELETE            /api/cart/:productId
GET/POST                /api/wishlist
DELETE                   /api/wishlist/:productId
GET/PATCH                /api/users/me
GET                      /api/health
GET                      /api/health/database
```

Search/filter/sort parameters supported by `GET /api/products` include:

```text
q
categoryId
minPrice
maxPrice
sort
```

See [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) for details.

## Deployment

The application is prepared for Vercel deployment. Production needs the same server-side AWS and DynamoDB environment variables configured in the Vercel project settings.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the final deployment procedure.

## Submission Checklist

Before internship submission, confirm:

- GitHub repository is up to date
- Production build passes
- Live project opens successfully (if deployed)
- DynamoDB-backed cart and wishlist persist after refresh
- Responsive layouts work on mobile/tablet/desktop
- README and documentation are committed
- Final screenshots are captured
- No `.env.local` or AWS credentials are in GitHub

See [`SUBMISSION_CHECKLIST.md`](SUBMISSION_CHECKLIST.md) for the full checklist.

## Scope Note

Authentication and payment processing were intentionally not added because they are outside the stated internship requirements. User-dependent features are isolated behind a current-user abstraction, allowing real authentication to replace the demo user later without rewriting the cart or wishlist architecture.
