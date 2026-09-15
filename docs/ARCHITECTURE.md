# NovaStore Architecture

## High-level architecture

```text
User / Browser
      ↓
Next.js App Router
      ↓
┌───────────────────────────────────────┐
│ Pages / Server Components            │
│ Client Components                    │
│ Route Handlers                       │
└───────────────────────────────────────┘
      ↓
Validation + Business Services
      ↓
Repository Layer
      ↓
AWS SDK for JavaScript v3
      ↓
Amazon DynamoDB
```

## Separation of concerns

### `src/app`
Owns routing and page composition.

Includes:
- storefront pages
- product routes
- cart/wishlist/account pages
- Route Handlers under `src/app/api`
- loading, error, and not-found UI

### `src/components`
Reusable presentation and interaction components.

Examples:
- header and mobile navigation
- hero and editorial homepage sections
- product cards and grids
- catalog controls
- cart controls
- wishlist buttons
- account form

Client Components are used only where browser interaction/state is required.

### `src/services`
Owns business rules and orchestration.

Examples:
- validating stock before cart updates
- calculating hydrated cart lines and subtotal
- resolving product data for wishlist entries
- creating/updating the demo user
- catalog search/filter/sort logic

Pages and APIs use services rather than embedding business logic in UI code.

### `src/repositories`
Owns direct DynamoDB operations.

Examples:
- `GetCommand`
- `PutCommand`
- `QueryCommand`
- `ScanCommand`
- `UpdateCommand`
- `DeleteCommand`

Repository functions do not render UI and do not own presentation concerns.

### `src/lib/validation`
Zod schemas validate important request data and query parameters before business logic runs.

### `src/lib/db`
Creates the DynamoDB client and centralizes table names.

### `src/lib/auth`
Contains the current-user abstraction. The internship task does not require authentication, so the implementation resolves `DEMO_USER_ID`. Cart, wishlist, and user services depend on this abstraction instead of hardcoding a user ID.

### `src/types`
Contains shared TypeScript entity and feature contracts.

## Server-side data access

Server Components read server data through services/repositories directly when possible:

```text
Server Component
      ↓
Service
      ↓
Repository
      ↓
DynamoDB
```

This avoids making an unnecessary HTTP request from the Next.js server back to its own API.

Client interactions use Route Handlers:

```text
Client Component
      ↓
/api/* Route Handler
      ↓
Zod validation
      ↓
Service
      ↓
Repository
      ↓
DynamoDB
```

## Security boundaries

- AWS access keys stay server-side.
- Secrets live in environment variables, never browser code.
- No AWS secret uses a `NEXT_PUBLIC_` prefix.
- `.env.local` must remain Git-ignored.
- Product prices used for cart totals are read from the database on the server rather than trusted from client requests.
- Stock rules are enforced in the service layer, not only in UI controls.

## Error handling

API routes use structured application errors and HTTP status codes for invalid input, missing resources, stock conflicts, and server failures.

UI includes:
- route loading states
- empty states
- custom 404 state
- application error boundary
- button-level interaction feedback

## Scalability notes

The project intentionally uses a clear multi-table DynamoDB design because it is easy to reason about for the internship scope. Category browsing uses a GSI. Search for the demo-size catalog can use a scan/service-layer filter; a production catalog with large-scale full-text search would normally add dedicated search infrastructure or additional access patterns.
