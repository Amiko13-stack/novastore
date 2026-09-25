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
The authenticated database-health route reads only these configured tables.
Existing tables must be inspected before creating or seeding anything.

The public sample dashboard remains usable when live AWS is not configured.

## Deployed identity

The Sites deployment uses the dedicated IAM user novastore-sites-dashboard.
Its table-scoped policy is in aws/sites-dynamodb-policy.json. The baseline was
generated with IAM Policy Autopilot, then restricted to the existing five tables
and product index; unused replication/KMS permissions were removed.
AWS keys and the administrator key belong only in Sites secret settings.
The website never uses the AWS account root login.

ADMIN_ONLY_MODE=true disables the original shared demo-customer session and
redirects storefront pages to /admin. Public product/category catalog reads
remain available; customer and administration records require protected access.

The external host uses a dedicated access key. Rotate it in IAM and replace
the corresponding Sites secrets, then redeploy. Revoke the old key after
verifying the replacement. Delete the identity when the deployment is retired.
See https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html.
