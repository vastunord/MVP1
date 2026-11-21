# Vastu Nord — current project handoff (living document)

**Status:** Phase 02E-1 development target and limited migration role verified; Prisma migration remains blocked by the lack of an approved, non-logging credential handoff to the local CLI. Private Blob and free Resend resources are connected to Development; email delivery and connected application flows remain untested. Exact Phase 01 visual parity remains BLOCKED.
**Last updated:** 2026-11-21
**Active phase:** Phase 02E scoped integration work; cloud account and local network blockers recorded below. No Phase 02F work.
**Working directory:** C:\Users\VN\Documents\ChatGPT\VastuNord. Branch `phase-02e-cloud-auth-integration` from `84956af2fec9f5193099ed6b88630570fb2684a0`. Origin remains https://github.com/vastunord/MVP1.git.
**Next safe task:** Provide a reviewed secret-injection path for the limited development migration credential, verify a direct connection and recovery point, then run Prisma status/deploy on the named development branch. Email, auth and Blob tests are separate later tasks. Choose a commercial-eligible Vercel plan before business use. No push or deployment.

## Verified context
- Phase 02E account isolation: Git origin is `vastunord/MVP1`; Neon organization `Vastu` and Vercel team `VastuNord` use the Vastu Nord connections. The NRide Vercel connection was not used.
- Neon app project `morning-morning-84319525` (`VNMVP1`) was already present in Frankfurt (`aws-eu-central-1`), with an empty default `production` branch. Created `development` branch `br-mute-resonance-bhea4dyx`; its `neondb` has no app tables. Connector `SELECT` and a transaction-scoped temporary-table write/read passed. No production branch mutation.
- Vercel CLI 66.5.0 is isolated through `scripts/vercel-vastunord.ps1` under `vastunord@gmail.com`/Vastu Nord. Project `vastunord-web` (`prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0`) remains linked only to `vastunord/MVP1`, with root `apps/web` and no deployment. The private, empty Frankfurt store `store_ejuJXLFGtH1tuh5b` is now connected to this project's **Development** environment with OIDC and no static token; CLI `storage status` verified scope. No Blob object was uploaded. The repository-local project link is ignored by Git; a CLI-generated local OIDC env file was removed without reading it.
- Prisma migration status via the local CLI remains blocked by restricted Neon DNS and the previously rejected privileged-password command; that command was not rerun or bypassed. A separate `vastunord_dev_migrator` role was created on the named development branch only, limited to `neondb`/`public`; it is not a `neon_superuser` member and lacks database-wide CREATE. `CREATE` on the public schema was granted for reviewed migrations. The connector verified role identity and rights without exposing its password. Both committed SQL migrations were reviewed for destructive statements; no drop/truncate/data-delete was found. The branch still has no application tables. After owner acceptance of Marketplace terms, the free Resend resource `ir_wZk3Y3lUDXamTWlV` was provisioned for `vastu.no`/EU region and connected to `vastunord-web` Development only. Domain verification is now complete, but delivery is untested. `RESEND_API_KEY` and `RESEND_EMAIL_DOMAIN` names appear only in Development. `no-reply@vastu.no` mailbox creation is owner-reported; `noreplyvastuno` was not listed in this Vercel project's environment and would not substitute for a Resend API key. No live auth or two-user persistence test was possible. See `docs/OWNER_CLOUD_SETUP.md`.
- The owner added Resend's three `vastu.no` records in Domeneshop after automatic approval review had rejected our earlier Add attempt. Read-only queries of authoritative `ns1.hyp.net` verified TXT `resend._domainkey` exactly matches Resend's 218-character DKIM value, CNAME `rsend` targets `rsend-euw1.forge.rmta.net`, and CNAME `send` targets `send.forge.rmta.net`. The signed-in Resend page marks the domain and all three records **Verified** and sending **Ready**; the Vastu Nord Vercel resource now reports **Available**. Added `AUTH_EMAIL_PROVIDER=resend` and `AUTH_EMAIL_FROM=no-reply@vastu.no` as nonsecret Config variables in `vastunord-web` Development only; `RESEND_API_KEY` remains Development-only and was never read. No email was sent, and delivery is untested. See `docs/OWNER_CLOUD_SETUP.md`.
- Phase 02E-1 read-only reconfirmation: Neon project `morning-morning-84319525` is in `aws-eu-central-1`; nondefault branch `br-mute-resonance-bhea4dyx` is ready, with `neondb` and a direct read-write compute `ep-purple-fog-bhs946ij`. Authoritative DNS for that endpoint resolved only in the approved elevated read-only check. Connector SQL as `vastunord_dev_migrator` confirmed `neondb`/`public`, schema CREATE, no database-wide CREATE or `neon_superuser`, zero public tables and no `_prisma_migrations`. The credential-bearing connection-string tool returned a pooled endpoint; no URL or password was printed or passed to a command. No approved protected handoff to Prisma is available, so no migration or synthetic persistent write was attempted. See `docs/DATABASE_ARCHITECTURE.md`.
- Hosting preference: separate Vastu Nord project on Vercel.
- Database preference: separate Neon PostgreSQL project and Prisma.
- Editorial preference: Payload CMS with AI-assisted draft and human publication approval.
- Brand PDF supplied with this kit and previously visually reviewed across all 36 pages. Both marketing references were inspected in the Codex in-app browser at desktop; see `docs/MARKETING_REFERENCE_COMPARISON.md` and `docs/REFERENCE_EVIDENCE.md`.
- User photo/video outputs must start private, with per-asset/public/social consents.

## Current implementation status
Phase 02E recovery checks on 2026-11-21: TypeScript, ESLint, Prisma schema validation, 14 local unit tests, webpack production build and 9 local browser smoke tests passed. The Blob adapter/configuration now permit Vercel's short-lived OIDC credential path; this is a local code check, not a live Blob test. A credential-free `prisma migrate status` stopped at “Connection url is empty”; live migration status, upload/retrieval/deletion, email delivery, signup/session and two-user project isolation remain NOT TESTED because the development schema and app runtime credentials are unavailable. The owner changed only the three Resend DNS records; Codex made no DNS mutation. No production branch, preview/production Vercel environment, NRide resource, push or deployment was changed.

Phase 02E-1 focused checks on 2026-11-21: Prisma schema validation, TypeScript and eight local database/auth policy tests passed. The live Neon connector confirmed an empty development schema and scoped role; it did not apply Prisma migrations or prove CLI connectivity. Migration history, schema verification after deployment and persistent synthetic read/write remain BLOCKED. No email, authentication or Blob integration tests were started.

| Area | Actual status | Evidence/URL | Next test |
|---|---|---|---|
| Marketing site | Desktop routes inspected; six linked design routes return branded 404; responsive evidence remains unverified | `docs/MARKETING_REFERENCE_COMPARISON.md` | Owner decision on broken solution links; mobile capture when tooling is available |
| Existing Studio | All 17 tool editors previously inspected at empty-photo state; four representative category editors and workspace screens inspected at desktop | `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md`, `docs/STUDIO_RESPONSIVE_AUDIT.md`, `docs/WORKSPACE_SCREEN_INVENTORY.md` | Tablet/mobile inspection and durable captures; implementation belongs to a later approved phase |
| Auth + private projects | Better Auth and personal-project routes/UI implemented locally; all cloud-backed flows unverified and closed without credentials | apps/web/src/server, apps/web/src/app/api, docs/AUTH_AND_SECURITY.md | Isolated Neon/email/session and two-user browser integration tests |
| Real image/video generation | Disabled; typed boundary only | packages/contracts | Real provider/capability tests in approved AI phase |
| Neon, Payload, storage, jobs | Dedicated Neon development branch and scoped migration role verified, but Prisma migrations remain unapplied. Git-linked Vercel web project has no deployment. Private Vastu Nord development Blob store is empty and connected to Development by OIDC; Payload and workers unimplemented | apps/web/prisma, docs/STORAGE_ARCHITECTURE.md | Secret-safe DB connection, migrations, email setup and synthetic private-media tests |
| Public gallery and social publishing | Planned | New requirement | Consent and approval workflow tests |
| Billing and wallet | Planned/unknown | Prior prompt only | Transaction test |

## Decisions
- Owner-directed v3.3 greenfield scope has been documented; no new cloud access or integrations provisioned. See `docs/DECISIONS.md`.

## Blockers / owner requests
- The host-wide GitHub credential was initially rejected. Repository-local path-scoped authentication succeeded; GitHub visibly shows the pushed Vastu Nord commits and files on the public `main` branch. No global credentials were changed.
- Current inventory covers all 17 Studio editors at empty-photo state. Four representative editor categories and workspace surfaces were inspected at about 1280×720; the browser offered no resize override for 1440px, 768px or 390px. No durable project-local screenshots were saved. Backend, wallet, billing, persistence, search results, exports and sharing remain unverified. Overall Phase 01 UI-parity gate remains BLOCKED.
- Provide open-access Google image-library URL/ID, asset rights and mapping when phase 04 begins.
- Configure new Vastu Nord cloud resources only during their corresponding phases; former developers' Git/Vercel/Neon access is not required.

## Historical Phase 00 preflight tests (superseded by current phase results)
- No application tests run; this remains a planning/reference phase.
- Required root files confirmed present: `AGENTS.md`, `MASTER_CODEX_PROMPT.md`, `docs/PROJECT_STATE.md`, and `prompts/00-SAFE_WORKSPACE_AND_REFERENCES.md`.
- `.git` and `.gitignore` are absent, as expected before bootstrap; no remote, branch, author, stage, or commit exists. A filename-only scan found no likely credential/config filenames; no file contents or secrets were inspected.
- No `.vercel` project link or Vercel CLI was found. New cloud resource IDs are planned for later phases; no cloud resource was changed.
- The 36-page PDF was visually reviewed as a contact sheet; visible sections confirm VastuNord logo treatments/use examples, six palette swatches, and Zalando Sans Expanded typography. No hex values were sampled or inferred.
- All three public reference URLs loaded in the in-app browser. Marketing content is summarized in `docs/REFERENCE_EVIDENCE.md`; the Studio remained at user-context loading, so no tool inventory is claimed.
- Local isolation documents specify separate company resources and state Postiz is not part of the active stack; live account/resource configuration was not independently checked.

## Completed phases
- Phase 00 — greenfield workspace/reference review and repository bootstrap.

## Phase 00 findings (2026-11-21, greenfield reconciliation)
- Corrected the earlier interpretation: this is a new Vastu Nord project, so former developers' Git/Vercel/Neon resources are not required. The named workspace is unambiguous and separate from NRide.
- Confirmed no likely sensitive/config filenames. Initialized local Git on `main`, configured repo-local author identity, added the verified `origin`, and created root commit `ec5c2a7`. The GitHub page showed `vastunord/MVP1` owned by Vastu Nord and already Public/empty.
- Recorded observations for all three public URLs and visually reviewed all 36 pages of the brand PDF; see `docs/REFERENCE_EVIDENCE.md`.
- The repo-scoped push completed and the public GitHub page shows the commits and files. A subsequent read-only remote check hit temporary DNS resolution failure, but the visible remote page and local push reflog confirm success. Studio screenshot/recording if loading continues; Google library link/rights later in Phase 04.
- No deployment, paid service, cloud mutation, NRide access, or production change occurred.

## Phase 00 exit criterion
- Documentation/reference review, local commit, and push to the verified public Vastu Nord `origin` are complete. Phase 00 is complete. Do not begin Phase 01 until the owner approves.

## v3.2 authorized boundary — not provisioned
Two independent business resource stacks: NRide under `nride@gmail.com` and Vastu Nord under `vastunord@gmail.com`, subject to verification in each vendor dashboard. A third Codex account is used for software development only. Payload CMS retained on Vastu Nord's own Vercel cloud project; Postiz removed from current stack. Social publication is manual through separate Vastu Nord platform accounts, with distinct gallery/channel consents, editorial review and logged URLs. No new cloud resources or services have been created by this document. `docs/TWO_COMPANY_ISOLATION.md` and `docs/CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md` are authoritative.

## Phase 01 partial progress — 2026-11-21
- Active branch: phase-01-reference-inventory. UI-parity gate BLOCKED: 17 Studio library cards and one Room Reimagination desktop editor inspected; remaining tools, mobile views, saved screenshots and marketing comparison still required. See STUDIO_INVENTORY.md and REFERENCE_EVIDENCE.md.
- Owner input if access becomes unavailable: screenshots/recording of each Studio tool, its controls and results, plus desktop/mobile marketing and Studio views. Google asset library link and reuse rights remain pending.
- No application tests, production changes, uploads or generation. Phase 02 has not started.

## Phase 01E-A — marketing reference comparison complete — 2026-11-21
- Inspected the design prototype's public marketing, auth, four linked solution, and five article routes, and the development reference's six primary marketing routes at desktop. The design `/features` is a feature overview while developer `/features` is a living-room solution page; important CTA/footer destinations also conflict. Detailed route/page comparison, shared components, recommendations and owner questions are in `docs/MARKETING_REFERENCE_COMPARISON.md`.
- The brand PDF remains the visual identity authority. Existing 36-page review confirms logo treatments, six palette swatches and Zalando Sans Expanded; exact values were not sampled in this task. Marketing visual direction appears aligned at a qualitative level only.
- The six linked design solution routes were all opened and returned the same branded custom 404; the kitchen route was retried once in a fresh tab and again returned 404. No corresponding developer routes appeared in the previously inspected navigation, so none were guessed. The fallback header, footer and Back to home link were observed; missing solution content remains NOT ACCESSIBLE.
- The in-app browser exposed no durable project-local screenshot export; mobile is reserved for Phase 01E-B. No application code, NRide resources, external service, deployment or push was touched. Overall Phase 01 UI-parity remains BLOCKED and is not marked passed.
- No application tests were run. `git diff --check`, trailing-whitespace and final-newline checks passed. Await owner approval before Phase 01E-B or Phase 02.

## Phase 01E-B — desktop Studio and workspace inspection — 2026-11-21
- Inspected the dashboard, 17-card tool library, active/archived/deleted files, projects and one project detail, shared review/download tabs, search, notifications, account, profile/security/notification/export/billing settings, an existing result/version-history/compare view, and Download/Review link/Social export tabs. Read-only actions only; no payment, AI generation, upload, download, share, profile/security change, restore/delete, or notification mutation.
- Inspected representative editors for all four categories using Room Reimagination, Virtual Home Staging, Outdoor Visualization and Resolution Enhancement. Responsive layout behavior was observable only at approximately 1280×720. The browser exposed no viewport override; 1440px, 768px, 390px and touch interactions remain NOT TESTED. No project-local screenshot export was available.
- Opening the requested Room Reimagination new-file entry created an empty “Living Room Redesign” item displaying “Saved just now”. No photo or prompt was added. The file was left untouched; whether the reference persists it is UNVERIFIED. See `docs/WORKSPACE_SCREEN_INVENTORY.md`.
- Updated the responsive audit, workspace inventory, parity matrix, reference evidence and this handoff. The overall Phase 01 UI-parity gate remains BLOCKED; Phase 01E-C and Phase 02 have not started.

## Phase 01E-C — final design handover and Phase 01 closure — 2026-11-21
- Created `docs/PHASE01_DESIGN_HANDOVER.md` and `docs/BROKEN_ROUTES_AND_RECONSTRUCTION.md`. The handover consolidates the marketing target direction, all 17 Studio configurations, observed workspace sitemap, user journeys, explicitly unverified functionality, design evidence, responsive constraints, owner decisions and a proposed Phase 02 architecture/sequence.
- Recorded all six exact branded-404 solution routes, route-name-only subject inferences, supporting evidence limits, a temporary remove/defer recommendation, priorities and owner decisions. No original page content was invented.
- Documentation closure status: PASS WITH DOCUMENTED LIMITATIONS. Overall UI-parity remains BLOCKED, not passed: 1440/768/390 responsive states and touch behavior were unavailable; durable screenshots were not exportable; six route outcomes, CTA/content/asset/legal/commercial decisions and backend behavior remain unresolved.
- No application source, cloud resources, external services, payments, media uploads, deployment, push or NRide resources were touched. No application tests were run; documentation checks are recorded in the changelog.
## Phase 01A progress — 2026-11-21
- Continued from `ccf8b06` on `phase-01-reference-inventory`; inspected the next four library tools in order: Virtual Home Staging, Outdoor Visualization, Hardscape Design, Furniture Refresh. Five of 17 tools now have editor-level observations including prior Room Reimagination.
- Updated the Studio inventory and reference evidence. No durable screenshot files; no upload, generation, destructive action, app source change, or NRide access.
- Remaining Phase 01 work: 12 tools, mobile layouts, marketing desktop/mobile comparison and durable screenshots. UI-parity gate remains blocked; Phase 02 has not started.
## Phase 01B progress — 2026-11-21
- Continued from `b488fb0` on `phase-01-reference-inventory`. Completed empty-photo editor inspections for Seasonal Styling, Visual Cleanup, Resolution Enhancement and Perspective Correction. Nine of 17 tools now have editor-level observations.
- Documented shared shell only once and added unique controls/modes, visible file requirements, empty-state actions and disabled states to `docs/STUDIO_INVENTORY.md`. Resolution Enhancement manual adjustments and Perspective Correction camera-angle choices were observed by switching local UI modes only.
- A browser screenshot of Perspective Correction was visually inspected; no durable screenshot file was available to save. No photo uploads, generation, paid actions, code changes, cloud changes, deployment, or NRide access occurred.
- Remaining Phase 01 work: eight tool editors, mobile layouts, durable screenshot captures and marketing comparison. UI-parity gate remains BLOCKED. No Phase 01C or Phase 02 work has started.


## Phase 01C progress — 2026-11-21
- Continued on `phase-01-reference-inventory` from `c317b99`. Inspected Decor Re-definition, Material Refinement, Lighting Reimagination and Garden Design entry pages and empty-photo editors. Thirteen of 17 Studio tools now have editor-level observations.
- Recorded tool-specific defaults, options, upload/reference inputs and disabled states. Garden Design’s touch-up mode was inspected by toggling the switch on, then restored to default off. No upload, generation, paid action, source-code change, deployment or NRide access occurred.
- A Garden Design browser screenshot was viewed but could not be saved as a durable project file. Four editors, mobile layouts, durable screenshot evidence and marketing comparison remain. Parity gate BLOCKED; Phase 01D and Phase 02 have not started.
## Phase 01D progress — 2026-11-21
- Continued on `phase-01-reference-inventory` from `830b014`. Inspected Spa & Pool Redesign, Sky Transformation, Seasonal Transformation and Object Placement entry pages/editors; all 17 of 17 Studio tools now have empty-photo editor observations.
- Added the final tool observations and created `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md` for all 17 tools. Dependent option states were revealed in Spa & Pool, Sky and Seasonal Transformation without uploads or generation. Two comparison/default mismatches are recorded for review.
- Screenshot views were captured in the browser but no durable screenshot file could be saved. No media upload, generation, paid action, source-code change, deployment, push or NRide access. Mobile and marketing parity evidence remain. UI-parity gate BLOCKED; Phase 01E and Phase 02 have not started.

## Phase 02A — architecture and foundation planning — 2026-11-21

- Defined two-app Next.js/Payload boundary, isolated Neon/ORM ownership, typed Studio configuration for all 17 tools, private media/auth, durable jobs/transactional credits, CMS consent and manual social workflows.
- Canonical details: docs/ARCHITECTURE.md, docs/DATABASE_ARCHITECTURE.md, docs/API_CONTRACTS.md, docs/AI_AND_WORKERS.md, docs/AUTH_AND_SECURITY.md, docs/DEPLOYMENT_PLAN.md and docs/PHASE02_IMPLEMENTATION_PLAN.md. Older combined data/API and AI operations drafts now point to their canonical replacements.
- docs/INTEGRATIONS_AND_ACCESS.md records provider/account/env/cost/permissions/tests/owner actions. Cloud identities, IDs, credentials, model availability and rates remain unverified. Better Auth, private Blob, Workflow and Stripe are proposals, not approved integrations.
- Founder decisions remain: provider choices, regions/retention/budget, CTA/locale route choices, six broken routes, legal/commercial claims, authorized assets and exact brand values. Existing isolation/privacy/manual-social requirements are accepted; no original-team access required.
- Phase 02B proposal is local workspace/shell/contracts/locale/theme scaffolding with integrations disabled; no automatic start. No dependencies, features, cloud resources, upload, payment, push, deploy or NRide changes.
- Documentation validation and commit are recorded in the changelog; no runtime tests exist or were run for this planning task.

## Phase 02B — frontend implementation — 2026-11-21

- Implemented apps/web plus packages/contracts: one Next.js App Router app, shared marketing/Studio design tokens/components, 17 tool configs, filters/routes/editor shells, local controls and disabled generation/upload/history/billing/service actions. apps/cms is documentation-only. No protected user data or working auth.
- Norwegian default at /, English /en explicitly approved; Studio /app remembers language. Dictionaries, metadata/HTML language, date/number helpers and light/dark/system cookie preference work. Original English tool names and specialist controls are retained pending translation approval.
- PDF pages 19/20 visually inspected; palette source RGB operands extracted. No licensed font or standalone logo supplied; documented system fallback and plain text identity. Diagram artwork is a labelled CSS study, not generated media.
- Dependencies: Next 16.4.6, React 19.3.1, TypeScript 5.9.3, Tailwind 4.3.5/PostCSS, ESLint 9.39.5 with matching Next config, Playwright 1.65.1 and Prettier 3.10.1; versions/lockfile committed. No backend SDKs or credentials.
- Tests passed: install/peer check, TypeScript, ESLint, production build; 6 unit tests and 8 Playwright smoke tests, including all tools and 390/768/1280/1440 layouts. Initial locale HTML bug fixed. New app screenshots saved locally under apps/web/test-results/screenshots; original reference parity still unverified.
- Known limitations and routes: docs/FRONTEND_FOUNDATION.md. Cloud providers, auth/security enforcement, persistence, real uploads/AI/credits/exports/CMS and publishing are deferred. Registry marks compatible ESLint 9 maintenance release deprecated; upgrade with compatible Next lint plugins later.
- No Phase 02C, dependency-backed service integration, cloud mutation, deployment, push, user media or NRide changes. Await next scoped approval.

## Phase 02C — cloud/data foundation — 2026-11-21

- Added local Prisma 7 schema/client, initial SQL migration and server-only database access/health contracts. Migration validation is offline; no Neon resource or database was touched. App and CMS databases remain separate by design; no auth, ledger or billing implementation was added.
- Added private-media upload/download/deletion policy, Prisma repository and Vercel private Blob driver. Uploads default off and no public endpoint exposes the driver. Synthetic tests cover ownership, type/size, file signature and channel consent. Live signed operations, authentication, retention worker, media scanning and cloud account identity remain unverified. See `docs/STORAGE_ARCHITECTURE.md`.
- Inventoried all 727 local Visuals files in `docs/VISUALS_ASSET_MANIFEST.csv`; about 4.45 GB, all rights and approval unknown, none eligible to publish. The source folder is ignored by Git and untouched. No media was uploaded.
- Prepared environment and Vercel framework templates, preview/production separation and rollout/rollback checklist. No Vercel link, DNS, Neon, Blob, Payload, paid resource, push, deployment or NRide action occurred. Phase 01 exact visual parity remains blocked.

## Phase 02D — auth, onboarding and projects — 2026-11-21

- Installed Better Auth 1.7.27 with Prisma adapter and reviewed its generated core schema; added a non-destructive migration for auth tables, personal-workspace ownership and project metadata/status. Migration remains unapplied; no live Neon or local Postgres was available (Docker engine absent).
- Implemented session-gated account/project API routes and Studio pages; Norwegian/English account, recovery, workspace and project screens; disabled-by-default Resend and Google OAuth contracts; and a recorded account-deletion request. Project creation is repeat-safe. Private asset listing/download remains owner-gated, with real storage disabled. Public gallery/social publishing remains absent.
- Local policy tests cover invalid sessions, configuration, duplicate creation and cross-user denial. Real registration/email/cookies/OAuth, database persistence and browser authorization with two accounts are IMPLEMENTED BUT UNVERIFIED / BLOCKED BY CLOUD CONFIGURATION. No customer data was collected.
- Default Turbopack production build passes with normal local process permissions; retained webpack fallback. Phase 01 exact visual parity remains blocked. No push, deploy, production cloud mutation, paid service, media upload or NRide action.
- Validation: Prisma schema valid; Phase 02D SQL matches the offline schema diff from Phase 02C; TypeScript, ESLint, 14 unit tests, 9 browser smoke tests and both Turbopack/webpack production builds passed. The local Docker daemon is unavailable, so no database-backed registration, migration or cross-user browser test was run. Documentation and Git checks are recorded in the commit handoff.

## Phase 02E — cloud development integration, partial — 2026-11-21

- Verified Vastu Nord account scope; reused its dedicated empty Frankfurt Neon app project, created isolated development branch, and proved connector read plus transaction-scoped synthetic write/read. No production database changes, app schema migration or persistent test data.
- Created private, empty Frankfurt Vercel Blob development store. The user confirmed Vercel Blob, not Google Drive. No app credentials, object upload, signed access or store/project connection.
- Vercel connector link-only creation failed with HTTP 403, but the separately authenticated Vastu Nord CLI succeeded. The Git-linked project uses a temporary `exit 0` build-ignore rule; CLI deployment listing is empty. The team is on Hobby, which Vercel restricts to noncommercial use; owner must adopt a commercial-eligible plan before business use. No deployment or push.
- Local Prisma migration status failed before applying changes because the Neon endpoint was not DNS-resolvable in the restricted environment. Automatic approval review rejected a proposed elevated command because it embedded a privileged database password in the command payload; no bypass was attempted. Email sender and auth secrets are absent. Live registration, reset, sessions, two-user project isolation and Blob authorization are **BLOCKED / NOT TESTED**, not passed.
- Local validation: TypeScript, ESLint, Prisma schema validation, offline schema SQL generation, 14 unit tests, webpack production build and 9 browser smoke tests passed. The first sandboxed build hit a generated-cache permission error; the authorized local build passed. The first browser run stalled in the sandbox; an authorized local run passed. `git diff --check` and documentation checks are recorded in the Phase 02E commit.
