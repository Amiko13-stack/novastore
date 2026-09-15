# NovaStore — Day 7 + Day 8 Finalization

This final stage is intentionally not another feature sprint. The objective is to prove the existing application is reliable, documented, deployable, secure enough for submission, and easy for a reviewer to understand.

## Day 7 — QA, documentation, production readiness

1. Save Day 6 in Git.
2. Merge this finalization package into the project root.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Run the app and `node scripts/final-smoke-test.mjs`.
6. Complete the manual checklist in `docs/TESTING.md`.
7. Inspect responsive layouts at 390 / 768 / 1024 / 1440px.
8. Check the browser console for application errors.
9. Verify `.env.local` is ignored and no credentials are tracked.
10. Review the final README and documentation.

## Day 8 — Deploy + evidence + submission

1. Push final QA/documentation changes to GitHub.
2. Import GitHub repo to Vercel.
3. Add production environment variables.
4. Deploy.
5. Run the smoke test against the production URL.
6. Manually test cart/wishlist/profile persistence in production.
7. Put the live URL into README.
8. Capture final screenshots.
9. Complete `SUBMISSION_CHECKLIST.md`.
10. Submit GitHub link, live link, README, and screenshots in the Internship Dashboard.
