# Vastu Nord frontend foundation

Phase 02B local development only. No cloud integration, credentials or paid services are required.

## Run

Prerequisites: Node.js 24 LTS and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://127.0.0.1:3000. Norwegian public routes use /; English uses /en. Studio uses /app and remembers the selected locale. Authentication is unavailable; workspace screens are clearly marked public local previews containing no customer data.

## Check

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm test:smoke
```

Browser tests start a local production server on port 3100 and use installed Microsoft Edge. Install Edge or adapt the Playwright browser channel explicitly on other machines. Build before smoke tests. Screenshots are saved in apps/web/test-results/screenshots (ignored by Git).

Use the formatter with pnpm exec prettier --write --ignore-path .gitignore followed by the intended source paths.

## Structure

- apps/web: one Next.js App Router application, public layouts and Studio.
- packages/contracts: tool configuration and typed future service boundaries.
- apps/cms: documentation-only reservation for the later Payload deployment.
- docs/FRONTEND_FOUNDATION.md: implemented scope, evidence and limitations.

No upload, generation, billing, authentication, database or CMS SDK is installed. No API credentials belong in this repository.
