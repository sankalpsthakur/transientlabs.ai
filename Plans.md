# Plans

## Field Architecture social-cover hosting

1. Add the three hash-addressed PNGs under the public brand media tree.
2. Verify their hashes, dimensions, colour profile, and the existing brand-asset contract.
3. Run the production build.
4. Commit and fast-forward `main` only if the diff contains the intended assets and project documentation.
5. Verify the deployed commit and require all three public URLs to return `HTTP 200` with `image/png` before downstream use.

## Acceptance checks

- No existing file is changed or overwritten.
- `node scripts/ci/check-brand-assets.mjs` passes.
- `npm run build` passes.
- Each direct URL serves the expected SHA-256 bytes.
