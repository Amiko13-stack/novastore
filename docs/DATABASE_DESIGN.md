# DynamoDB Database Design

NovaStore uses five DynamoDB tables. The design prioritizes clear entity ownership, explainable access patterns, and correct cart/wishlist behavior.

## Tables

| Logical entity | Default table name | Partition key | Sort key |
|---|---|---|---|
| Users | `InternStore-Users` | `userId` | — |
| Products | `InternStore-Products` | `productId` | — |
| Categories | `InternStore-Categories` | `categoryId` | — |
| Cart | `InternStore-Cart` | `userId` | `productId` |
| Wishlist | `InternStore-Wishlist` | `userId` | `productId` |

Table names are environment-configurable.

## Users

Example:

```json
{
  "userId": "demo-user-1",
  "name": "Nova Guest",
  "email": "demo@novastore.local",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

Access patterns:
- read one user by `userId`
- create user if missing
- update profile name/email

Commands:
- `GetCommand`
- `PutCommand`
- `UpdateCommand`

## Categories

Example:

```json
{
  "categoryId": "cat-electronics",
  "name": "Electronics",
  "slug": "electronics",
  "description": "...",
  "imageUrl": "...",
  "createdAt": "ISO timestamp"
}
```

Access patterns:
- list categories
- read one category
- create category

## Products

Example:

```json
{
  "productId": "prod-headphones",
  "categoryId": "cat-electronics",
  "name": "Nova Wireless Headphones",
  "slug": "nova-wireless-headphones",
  "description": "...",
  "price": 129.99,
  "imageUrl": "...",
  "stock": 24,
  "featured": true,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

### Product GSI

Index name: `categoryId-createdAt-index`

- partition key: `categoryId`
- sort key: `createdAt`

Used to query products in a category without scanning the full table.

Access patterns:
- list catalog
- query by category
- retrieve product detail
- create/update/delete product
- search/filter/sort the demo catalog

## Cart

Example:

```json
{
  "userId": "demo-user-1",
  "productId": "prod-headphones",
  "quantity": 2,
  "addedAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

The complete key is `(userId, productId)`.

Benefits:
- one cart row per user/product pair
- duplicate rows are naturally prevented
- adding the same product updates quantity instead of inserting a second row
- querying by `userId` returns the user's cart

Business rules:
- quantity must be positive
- quantity cannot exceed product stock
- product existence is verified server-side
- subtotal is computed from current database prices, not client-supplied prices

## Wishlist

Example:

```json
{
  "userId": "demo-user-1",
  "productId": "prod-headphones",
  "addedAt": "ISO timestamp"
}
```

The complete key is `(userId, productId)`, which prevents duplicate saved products for one user.

Access patterns:
- query all saved products for a user
- check if one product is saved
- save one product
- remove one product

## CRUD / Operations Summary

### Users
- Create: `PutCommand`
- Read: `GetCommand`
- Update: `UpdateCommand`

### Products
- Create: `PutCommand`
- Read detail: `GetCommand`
- List/search small demo catalog: `ScanCommand`
- Category list: `QueryCommand` on GSI
- Update: `UpdateCommand`
- Delete: `DeleteCommand`

### Categories
- Create: `PutCommand`
- List: `ScanCommand`
- Read: `GetCommand`

### Cart
- List user's items: `QueryCommand`
- Read one item: `GetCommand`
- Add: `PutCommand`
- Quantity update: `UpdateCommand`
- Remove: `DeleteCommand`

### Wishlist
- List user's items: `QueryCommand`
- Read one item: `GetCommand`
- Add: `PutCommand`
- Remove: `DeleteCommand`

## Production considerations

The current design is appropriate for the project scale. For a much larger production system, likely extensions include:
- dedicated full-text search infrastructure
- more DynamoDB secondary indexes for new access patterns
- short-lived AWS credentials / workload identities instead of long-lived development keys
- real authentication replacing the demo-user resolver
