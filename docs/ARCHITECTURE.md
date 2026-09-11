# Application Architecture

```text
User / Browser
      ↓
Next.js App Router
      ↓
Pages + React Components
      ↓
Route Handlers / Server Logic
      ↓
Business Logic / Validation
      ↓
Repository / Database Functions
      ↓
AWS SDK v3
      ↓
Amazon DynamoDB
```

## Separation of concerns

- `src/app`: pages, route handlers, loading/error/not-found UI.
- `src/components`: reusable presentation components.
- `src/lib/db`: DynamoDB client and later repository functions.
- `src/lib/config`: environment configuration.
- `src/lib/auth`: current-user abstraction.
- `src/types`: TypeScript entity contracts.
- `src/lib/validation` (Day 2+): Zod input validation schemas.
- `src/services` (Day 3+): business logic such as cart totals and duplicate handling.

The UI must never access AWS credentials or DynamoDB directly. All database access runs on the server.
