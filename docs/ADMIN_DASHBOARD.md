# Admin dashboard

All requested management interfaces are implemented in /admin. The default
sample workspace is safe to share with reviewers and does not persist changes.

For live usage, set the AWS region, five DynamoDB table names, and a random
ADMIN_ACCESS_KEY in the server environment. Use a standard AWS credential
provider. See AWS_CONNECTION.md.

The entire snapshot and every administrative mutation require server-side
authorization. The administrator key is retained in browser memory only and is
not stored in localStorage or cookies.

Available operations: dashboard totals/activity, product CRUD and stock updates,
category CRUD, user details/update/delete, cart and wishlist relationship
inspection/removal, search/filtering/pagination, confirmation dialogs, validation,
loading feedback, and responsive layouts.

Deletion is blocked when a product, category, or user still has dependent data.
These checks are not a cross-table locking protocol; see the README limits.

Verification includes standard Next.js and Sites builds, lint, access-control
tests, browser flow tests, and real AWS SDK calls against an isolated
DynamoDB-compatible local database. Cloud AWS verification is a separate step.
