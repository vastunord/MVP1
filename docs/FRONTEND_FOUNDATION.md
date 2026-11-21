# Frontend foundation — Phase 02B

Local application only. No authentication or customer data: workspace pages are explicitly labelled previews. Phase 01 exact visual-parity gate remains BLOCKED.

## Implemented boundaries

apps/web is the single Next.js App Router/React/TypeScript frontend. Public and workspace route handlers compose shared Header, navigation, controls, StudioShell and Editor. Tailwind CSS 4 processes a common semantic token stylesheet. Buttons, inputs, cards and native modal dialog are reusable components; dialog uses native focus trapping/Escape. The mobile menu uses keyboard-operable native details/summary.

packages/contracts contains all 17 stable tool IDs/routes/categories and configuration-driven fields, prompts, conditional panels, action labels and example comparison labels. One editor renders every tool; primary actions, uploads, asset selection, Improve, history and export remain disabled. Prompt/settings interactions are local unsaved state. There is no generated output, actual wallet balance or stored file.

Matrix options not exhaustively recorded remain explicitly unknown/disabled instead of guessed. Percentage controls use percent bounds; sliders with unrecorded bounds use provisional numeric fields with a visible note. Source-specific names/options remain English pending approved specialist translations; navigation, common controls, empty states and marketing foundation are translated. Garden tidy mode, pool/spa choices and winter snow controls reflect documented conditional behavior. Sample imagery is absent; CSS diagrams are labelled studies, never original art or AI results.

Typed interfaces cover auth, project/database repository, media, AI, jobs, wallet, billing and CMS. No service implementation or SDK is provided. No production credentials required. Postiz absent.

## Routes

- / and /en: local marketing foundation.
- /features, /about, /pricing, /resources, /contact, /login, /signup, /forgot-password and their /en equivalents: explicitly unavailable-content/service placeholders.
- /app: workspace overview; /app/library: searchable category-filtered 17-tool library.
- /app/tools/[verified-tool-id]: shared configurable editor; unknown tools return 404.
- /app/files, /app/projects, /app/shared, /app/search, /app/settings and observed settings children: unavailable-service empty states.
- /app/editor/[fileId] and /app/projects/[id]: unavailable persistence placeholders, never a fetched or authorized record.
- Six broken solution routes remain unlinked and 404, governed by docs/BROKEN_ROUTES_AND_RECONSTRUCTION.md.

Founder confirmed unprefixed Norwegian and /en public URLs in this session. Studio preserves /app routes with a locale cookie. No region/domain or live SEO canonical origin is invented. Localized metadata and document language are implemented; robots stays noindex. A future protected data implementation must add real server authorization before using these preview routes for customer records.

## Brand source and provisional choices

Visually inspected PDF pages 19 (palette) and 20 (type). Extracted page 19 vector fill operands via pypdf, rather than sampling rendered pixels. CSS uses those exact fractional RGB percentages:

| Semantic source | PDF RGB fractions |
|---|---|
| Ink | 0.051, 0.055, 0.055 |
| Paper | 0.969, 0.949, 0.925 |
| Navy | 0.004, 0.235, 0.333 |
| Sage | 0.737, 0.800, 0.788 |
| Sand | 0.918, 0.816, 0.714 |
| Orange | 0.984, 0.376, 0.169 |

These are source-artwork values; the PDF does not print authoritative named HEX specifications. Type remains Zalando Sans Expanded in the configured stack, with Arial/Helvetica/system fallback because no licensed font files were supplied. No font downloaded or extracted. No standalone approved logo files exist; plain text “Vastu Nord” identifies the preview, not a replacement logo. Owner must supply approved logo variants/font rights.

Spacing, radii, font sizes, schematic diagrams and breakpoints are provisional implementation choices, not asserted brand measurements. Light/dark/system share one palette; theme uses a persisted cookie and CSS system media query without requiring a client hydration guess.

## Validation and limitations

Commands/results are recorded in docs/PROJECT_STATE.md and docs/CHANGELOG.md. Smoke tests exercise all 17 routes, disabled generation, category filters, conditional controls, locale persistence/document language, theme persistence/system response, dialog/Escape, keyboard skip link, mobile navigation, public placeholders and page-level overflow at 390/768/1280/1440.

Local implementation screenshots are under apps/web/test-results/screenshots, not reference screenshots. Desktop home and mobile editor were visually reviewed. These tests do not establish pixel parity, full screen-reader compliance, every control interaction or backend security.

Dependencies: Next.js 16.4.6, React/React DOM 19.3.1, TypeScript 5.9.3, Tailwind/PostCSS, ESLint with matching Next config, Playwright and development formatter; exact versions in manifests/lockfile. ESLint 9.39.5 is the registry maintenance tag compatible with Next's plugins; registry marks the 9.x release deprecated. ESLint 10 was rejected because three installed Next lint plugins exclude it. Revisit together with upstream plugin compatibility, not by forcing incompatible peers.

No Payload, Prisma, auth provider, billing or AI SDK dependencies. No cloud provisioning, database migrations, user photo uploads, payments, deployment or push.

Next step: founder reviews this frontend and approves a separately scoped follow-up. Remaining inputs: approved logo/font files, image library/rights, specialist translations, exact visual/mobile reference evidence, marketing/legal/commercial content and provider/region/budget decisions. No Phase 02C starts automatically.
