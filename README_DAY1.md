# Day 1 — Foundation Setup

## Goal

By the end of Day 1 you should have:

- Next.js + React + TypeScript running locally.
- Tailwind CSS working.
- Git repository created.
- AWS DynamoDB credentials stored only in `.env.local`.
- Five DynamoDB tables created.
- A clean project structure.
- A typed DynamoDB client.
- `/api/health` working.
- `/api/health/database` confirming AWS connectivity.
- A basic homepage and 404 page.

## Step 1 — Install software

Install:

1. Node.js 20.9+.
2. Visual Studio Code.
3. Git.
4. Create a GitHub account if needed.
5. Create an AWS account if needed.

Check in a terminal:

```bash
node -v
npm -v
git --version
```

## Step 2 — Create the Next.js project

From the folder where you keep projects:

```bash
npx create-next-app@latest novastore --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
cd novastore
```

If a prompt appears, keep App Router, TypeScript, Tailwind, ESLint, and the `src` directory enabled.

## Step 3 — Install Day 1 dependencies

```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb zod dotenv
```

## Step 4 — Copy this starter overlay

Copy the `src`, `scripts`, and `docs` folders from this package into the root of your new `novastore` project. Replace matching starter files when asked.

Also copy `.env.example` into the root.

## Step 5 — Create `.env.local`

Duplicate `.env.example`, rename the copy to `.env.local`, then fill in your AWS values.

Never commit `.env.local` to GitHub.

## Step 6 — AWS credentials

Create a dedicated IAM user for this project with programmatic access to DynamoDB. Do not use the AWS root account credentials.

For the fastest Day 1 setup, you can give this dedicated project user DynamoDB permissions needed to create and use the five `InternStore-*` tables. After setup, reduce the permissions to only the operations used by the application.

Put the access key, secret key, and chosen region in `.env.local`.

## Step 7 — Create DynamoDB tables

Run:

```bash
node scripts/create-dynamodb-tables.mjs
```

You should see five success messages.

## Step 8 — Run the app

```bash
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/api/health`
- `http://localhost:3000/api/health/database`

The database health endpoint should return `database: "connected"` and show your table names.

## Step 9 — Git and GitHub

```bash
git add .
git commit -m "chore: initialize Next.js ecommerce architecture"
```

Create an empty GitHub repository called `novastore`, then connect and push using the commands GitHub shows you.

Make a second commit after DynamoDB/table documentation is finalized:

```bash
git add .
git commit -m "docs: add DynamoDB schema and project architecture"
git push
```

## Day 1 proof checklist

Before stopping, make sure all of these are true:

- [ ] Homepage opens without errors.
- [ ] Tailwind styling is visible.
- [ ] `/api/health` returns JSON.
- [ ] `/api/health/database` says connected.
- [ ] AWS console shows all five tables.
- [ ] `.env.local` is NOT visible on GitHub.
- [ ] GitHub repository contains your source code.
- [ ] `docs/ARCHITECTURE.md` exists.
- [ ] `docs/DATABASE_DESIGN.md` exists.

## Do not build today

Do not spend Day 1 building product cards, cart buttons, filters, or a fancy design. First make the architecture and database foundation reliable. Those features start on Day 2.
