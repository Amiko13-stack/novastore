# AWS hosting

The dashboard can run as a standard Next.js standalone server on AWS Lambda
using the official AWS Lambda Web Adapter. This deployment does not use Sites
branding or a chatgpt.site address.

## Build

1. Run `npm ci` and `npm run build:next`.
2. Run `python scripts/package-lambda.py`.
3. Upload `.sites-runtime/novastore-lambda.zip` to the `novastore-admin` Lambda
   function in `eu-central-1`.

The archive contains the standalone Next.js server, static assets, and an
executable Linux startup script. It excludes environment files and build caches.

## Runtime configuration

- Runtime: Node.js 22.x; architecture: x86_64.
- Handler: run.sh; memory: 1024 MB; timeout: 30 seconds.
- Lambda Web Adapter layer: arn:aws:lambda:eu-central-1:753240598075:layer:LambdaAdapterLayerX86:30.
- AWS_LAMBDA_EXEC_WRAPPER=/opt/bootstrap, PORT=8000, HOSTNAME=0.0.0.0.
- AWS_LWA_READINESS_CHECK_PATH=/api/health.
- ADMIN_ONLY_MODE=true and the five DYNAMODB_*_TABLE settings from .env.example.
- Store ADMIN_ACCESS_KEY in private Lambda environment settings.
- AWS_REGION is supplied by Lambda. Never configure static AWS access keys.

The execution role uses the existing table-scoped DynamoDB policy plus
permissions to write only to /aws/lambda/novastore-admin logs. Logs are retained
for seven days. The public URL serves sample mode; live administration remains
protected by the administrator key. No provisioned capacity is configured.
AWS hosting is usage billed according to the account's applicable rates.

## Verification

Set ADMIN_TEST_BASE_URL to the deployed origin and run both browser suites.
Verify /admin renders, sample CRUD works, mobile layout is usable, unauthorized
API requests are rejected, and Connect store loads the actual DynamoDB data.
Do not include private administrator instructions in submission archives.

References:
- https://github.com/awslabs/aws-lambda-web-adapter/tree/main/examples/nextjs-zip
- https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html
