# Phase 02 implementation plan

## Phase 02C completion — 2026-11-21

The owner separately authorized local Neon/PostgreSQL, private storage and deployment foundations. The app now has an offline-validated Prisma schema/migration, database health contract, disabled-by-default private Blob adapter, project/owner authorization policy, version-level gallery consent model and a metadata-only inventory of 727 Visuals files. No cloud resource was connected, provisioned, changed or tested. See `DATABASE_ARCHITECTURE.md`, `STORAGE_ARCHITECTURE.md`, `DEPLOYMENT_PLAN.md` and `ASSET_MANIFEST.md`. The earlier Phase 02B next-step sentence below is historical and superseded by this task.

Next scoped increment needs founder approval: verify the intended Vastu Nord vendor accounts and choose development/preview resources and region/budget; implement session-backed identity and server routes before any real media upload, then test the schema and signed operations with synthetic fixtures against isolated resources. Do not enable production, gallery publication, billing or paid generation as part of that step without separate authorization.

Phase 02A planning and Phase 02B local frontend are complete. Exact reference visual-parity gate remains BLOCKED. See the Phase 02B completion section below.

Already directed: independent Vastu Nord ownership, Next.js/React/TypeScript direction, dedicated Vercel/Neon and cloud Payload, private media, manual social/disabled adapter, Bokmål/English and light/dark/system. Prisma is the existing app preference. Proposed providers and product decisions remain subject to founder approval; see [DECISIONS.md](DECISIONS.md).

## Original Phase 02B proposal — superseded by owner scope below

1. Create local TypeScript workspace, apps/web Next.js shell and packages/contracts; pin compatible supported versions and lockfile. Reserve CMS boundary in docs, no CMS deployment/database.
2. Add validated configuration and secret-free environment example; all external integrations disabled by default; lint/build without production credentials.
3. Add basic marketing/workspace layout boundaries and explicit unconfigured screens, nb/en message scaffolding and light/dark/system preference. No fake auth or protected customer records.
4. Define ToolDefinition schema and 17 identifiers/routes/categories from the canonical matrix; shared editor boundaries only, not all editor features.
5. Run focused schema/config/locale/theme/route checks, lint/typecheck/build and local shell checks at 390/768/1280/1440.
6. Update memory, commit locally and stop.

Exclude cloud provisioning, migrations, real auth/uploads, AI/jobs, ledger/payments, CMS setup, publishing, Prana runtime and broad marketing reconstruction. Local sample content must be labelled and never represent real generation/balances.

## Later increments and risks

Preserve phases: identity/projects/storage (03), marketing/brand (04), Studio UX (05), real AI/jobs (06), credits/billing (07), consent/libraries (08), CMS/editorial (09), manual social (10), Prana (11), other pillar/release phases (12–14). No automatic expansion of 02B.

Before integrations: approve provider choices, regions, retention/budget, identity options and cloud access. Main risks: model capability mismatch, ambiguous billable retries, cross-workspace leakage, consent/publication races, unverified prices/claims/assets/legal content, missing brand metrics and mobile screenshots. Old developer source/credentials are not dependencies.

Phase 02A checks are documentation references, whitespace/final newline and git diff only. Runtime/security/integration/restore tests belong to later implemented increments.

## Phase 02B completion — 2026-11-21

The owner's Phase 02B request superseded the earlier limited shell proposal: implemented the single web app, all 17 configuration-driven tool editors, filtering/routing, explicit disabled integration states, reusable controls, public placeholders, responsive navigation and real locale/theme foundations. No cloud resources, SDK integration, database or production features.

Validation passed: dependency installation with no peer conflicts, TypeScript, ESLint, production build, six unit tests and eight Playwright smoke tests. Browser checks covered all tools, public placeholder routes in both languages, mobile menus, language/document attributes, theme persistence/system response and page-level overflow at 390/768/1280/1440. Initial language-attribute defect was fixed; a restricted build-worker launch required rerunning the local build with process permission. Implementation details and limitations: docs/FRONTEND_FOUNDATION.md.

Next exact step: founder review of the local frontend and approval of a scoped Phase 02C task. Recommended scope is the remaining frontend acceptance decisions (licensed font/logo assets, approved specialist translations, reference-control gaps and responsive visual review) before connecting services in Phase 03. No Phase 02C, cloud setup or deployment automatically follows.
