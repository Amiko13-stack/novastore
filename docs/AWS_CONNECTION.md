# AWS connection

The application uses the normal AWS SDK credential provider chain. Browser
sign-in alone does not give credentials to the application.

## Local development
1. Install AWS CLI 2.32.0 or newer.
2. Use aws login and approve the browser sign-in.
3. Verify the identity with aws sts get-caller-identity.
4. Configure AWS_REGION and the five DYNAMODB_*_TABLE values in .env.local.
5. Configure a random ADMIN_ACCESS_KEY (at least 32 characters).
6. Run npm run dev, open /admin, and connect with the administrator key.

Do not paste credentials in chat. Do not commit .env.local. AWS CLI login
credentials are temporary and are not a durable hosted-server configuration.

## Hosted runtime
The server requires a least-privilege AWS identity that can read/write the
configured DynamoDB tables. Runtime credentials belong in the hosting provider's
secret settings, never NEXT_PUBLIC_* variables or source files. Temporary local
login credentials must not be used as the final hosted credential solution.

Required data operations are GetItem, PutItem, UpdateItem, DeleteItem, Scan, and
Query on the five configured tables and the product category index.
The optional database-health route additionally uses ListTables.
Existing tables must be inspected before creating or seeding anything.

The public sample dashboard remains usable when live AWS is not configured.
