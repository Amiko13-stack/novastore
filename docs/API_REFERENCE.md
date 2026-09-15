# API Reference

All APIs return JSON. Exact response bodies can evolve, but the core routes are below.

## Health

### `GET /api/health`
Checks that the Next.js API is running.

### `GET /api/health/database`
Checks access to the configured DynamoDB tables.

## Products

### `GET /api/products`
Lists/searches products.

Supported query parameters:
- `q`
- `categoryId`
- `minPrice`
- `maxPrice`
- `sort`

Sort values:
- `newest`
- `price-asc`
- `price-desc`
- `name-asc`

Examples:

```text
/api/products?q=chair
/api/products?categoryId=cat-fashion
/api/products?maxPrice=100
/api/products?q=street&categoryId=cat-fashion&sort=price-desc
```

### `POST /api/products`
Creates a product after validation.

### `GET /api/products/:productId`
Returns one product.

### `PATCH /api/products/:productId`
Updates one product.

### `DELETE /api/products/:productId`
Deletes one product.

## Categories

### `GET /api/categories`
Returns available categories.

### `POST /api/categories`
Creates a category after validation.

## Cart

### `GET /api/cart`
Returns the current user's hydrated cart, item count, and subtotal.

### `POST /api/cart`
Adds a product or increases its existing quantity.

Conceptual request body:

```json
{
  "productId": "prod-headphones",
  "quantity": 1
}
```

### `PATCH /api/cart/:productId`
Sets quantity for one cart item after stock validation.

Conceptual request body:

```json
{
  "quantity": 2
}
```

### `DELETE /api/cart/:productId`
Removes one product from the current user's cart.

## Wishlist

### `GET /api/wishlist`
Returns the current user's hydrated wishlist.

### `POST /api/wishlist`
Saves a product.

Conceptual request body:

```json
{
  "productId": "prod-headphones"
}
```

### `DELETE /api/wishlist/:productId`
Removes a saved product.

## Current User

### `GET /api/users/me`
Returns the current demo user, creating it when necessary according to service logic.

### `PATCH /api/users/me`
Updates the current user's profile.

Conceptual request body:

```json
{
  "name": "Amiko",
  "email": "amiko@example.com"
}
```

## Error behavior

Important request payloads and catalog query parameters are validated. API errors use meaningful HTTP status codes for situations such as:
- invalid input
- missing product
- missing cart/wishlist item
- stock conflict
- server/database failure
