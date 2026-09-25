# Submission checklist

## Submit these three items
- GitHub repository: https://github.com/Amiko13-stack/novastore
- Website: https://novastore-admin-amiko.amovardo2007.chatgpt.site/admin
- Screenshots: docs/screenshots (clearly labelled sample data)

## Completed verification — 25 September 2026
- [x] Latest application changes pushed to GitHub main.
- [x] Production website published with private runtime secrets.
- [x] Desktop and mobile screenshots prepared.
- [x] Build, lint, administrator authorization, and isolated CRUD tests passed.
- [x] Actual hosted API reads all five existing AWS DynamoDB tables.
- [x] Hosted API rejects anonymous admin requests and shared demo-customer access.
- [x] Dedicated hosting identity is restricted to the five tables and product index.

The public dashboard opens in sample mode. Sample changes reset on reload and
are never saved to AWS. The owner can select Connect store and enter their
private administrator key to manage real AWS records.

Do not submit .env.local, AWS credentials, private administrator instructions,
or screenshots of secrets. The public demonstration needs no administrator key.
