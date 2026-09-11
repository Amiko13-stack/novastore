# DynamoDB Design

This project intentionally uses five tables because the assignment has five clear entities and the eight-day deadline favors a simple, explainable architecture.

| Table | Partition key | Sort key | Purpose |
|---|---|---|---|
| Users | `userId` | — | User profile data |
| Categories | `categoryId` | — | Product categories |
| Products | `productId` | — | Product catalog |
| Cart | `userId` | `productId` | One item per product in a user's cart |
| Wishlist | `userId` | `productId` | One item per product in a user's wishlist |

## Product GSI

`categoryId-createdAt-index`

- Partition key: `categoryId`
- Sort key: `createdAt`
- Used to list products in a category efficiently.

## Duplicate prevention

Cart and wishlist use the pair `(userId, productId)` as their complete primary key. A user therefore cannot have two independent records for the same product. Cart quantity is updated on the existing record instead.

## Planned CRUD

### Users
- Create: `PutCommand`
- Read: `GetCommand`
- Update: `UpdateCommand`

### Products
- Create: `PutCommand`
- List/search: `ScanCommand` for the small demo catalog
- Category listing: `QueryCommand` on the GSI
- Detail: `GetCommand`
- Update/delete: `UpdateCommand` / `DeleteCommand`

### Categories
- Create/list/read: `PutCommand`, `ScanCommand`, `GetCommand`

### Cart
- Read user cart: `QueryCommand`
- Add: `PutCommand` or `UpdateCommand`
- Change quantity: `UpdateCommand`
- Remove: `DeleteCommand`

### Wishlist
- Read: `QueryCommand`
- Add: `PutCommand`
- Remove: `DeleteCommand`

For a small internship dataset, scanning products for text search is acceptable and easy to explain. For a large production catalog, full-text search should move to a search service rather than relying on DynamoDB scans.
