# Submission checklist

## Files to submit
- GitHub repository: https://github.com/Amiko13-stack/novastore
- Dashboard screenshots: docs/screenshots (sample data, clearly labelled)
- Website URL: use the confirmed deployment URL supplied with the handoff

## Before final submission
- [ ] Confirm the latest dashboard commit is visible in the GitHub repository.
- [ ] Confirm the deployed website link has been supplied.
- [ ] Attach overview, products, categories, users, carts, and wishlist screenshots.
- [ ] Verify the actual AWS connection if the assignment requires a live DynamoDB demonstration.
- [ ] Describe sample mode honestly; it resets on reload and is not cloud persistence.

## Automated verification
Build, lint, access-control checks, sample browser flows, and an isolated local
DynamoDB-compatible integration suite are included. A local integration test is
not proof that the actual AWS account is configured.

Never submit .env.local, AWS credential files, administrator keys, or a screenshot
of secret settings. Do not give reviewers write access to real customer data.
