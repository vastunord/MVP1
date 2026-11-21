# VASTU NORD v3.3 — Greenfield Cloud Production Build

**MASTER SPECIFICATION for the owner's NEW GitHub and Vercel accounts.** Read once in the first Codex session. Detailed work is split into `prompts/00-...md` through `14-...md`, with durable Markdown handoff after each phase. The existing `docs/PROJECT_STATE.md` and `docs/CHANGELOG.md` MUST be preserved and updated in place.

## 0. Fundamental change in delivery assumptions

The owner received **ONLY** these three public URLs and has NO access to the former designers'/developers' repository, code, Vercel account, source exports, infrastructure or backend:
- Designer marketing page (primary UX reference): https://vastu-nord-design-prototype.vercel.app/
- Developer marketing page (secondary displayed content/reference): https://vastunord.vercel.app/
- Designer Studio (primary Studio design/tool reference): https://vastu-nord-design-prototype.vercel.app/app

**You are building a new source codebase from scratch in a PRIVATE GitHub repository under the Vastu Nord-controlled business account. The original deployments remain read-only visual references.** Do not ask the owner for old Git or Vercel credentials. Do not claim the references give code or hidden backend functionality. If browser access fails, ask for targeted screenshots or recordings; never fabricate tool inventories or visual details. No extraction of protected app source, private APIs, secrets or user data. Confirm rights for reusable designs and images when needed.

## 1. Business and operator boundaries

Business: Vastu Nord, Norwegian-first AI-powered virtual staging and spatial-decision platform. Tagline: **Where Possibilities Take Shape**. Operator email: `vastunord@gmail.com` (owner stated; verify actual vendor principal). Different business: NRide (`nride@gmail.com`), strictly out of scope. Codex development subscription uses a third account. One Codex account may work across distinct projects, but code, cloud resources and company data are not shared.

Accounts/resource boundaries: Vastu Nord PRIVATE GitHub repo; Vastu Nord-only Vercel web and CMS projects; Vastu Nord-only Neon application and Payload databases; private object storage; authorized AI/payment/OAuth and Vastu Nord-specific social accounts. No global Git/Vercel auth switch or use of NRide credentials, accounts, repos, buckets, social channels, quota, analytics or customer data. Verify all identities before writes. For strict local secret separation use distinct OS users or scoped environments when necessary; project folders alone aren't a security barrier.

## 2. Role, priorities, permission

Act as product-focused technical architect, senior UX engineer, AI platform engineer, data/security specialist and reliable release manager. Priorities: (1) preserve the brand and observable approved UX, (2) create a complete real customer journey, (3) architecture and privacy, (4) manageable AI cost and billing, (5) reliable Payload editorial workflow, (6) efficient repo documentation, (7) progressive release. Architecture first, but validate it with small working technical slices, not months of speculative diagrams.

The owner must authorize: remote Git push if not already allowed; creating paid cloud resources; enabling live model API costs, payment collection, publishing any user content, destructive migrations, mapping production domains, and production deployment. Routine isolated local code/tests may proceed after phase prerequisites. No external Codex plugins/MCP tool installations. Native tools and official runtime APIs after owner approval are allowed. No local server is required for production; temporary development/testing is allowed.

## 3. Source of truth and design reconstruction

Read `docs/GREENFIELD_OVERRIDE.md`, `docs/REFERENCE_CAPTURE.md`, brand PDF `assets/brand/Brand Guidelines Document.pdf` (36 pages), and `docs/SOURCE_REGISTER.md`. The brand PDF controls approved logo variants, exact color tokens, typefaces/licensing, spacing, iconography and visual voice. Verify every value from the PDF; do not invent it or distribute font files. Visually review the PDF, not only text extraction.

Marketing: primary design-team URL governs public marketing UI/UX unless inconsistent with the brand; developer-team URL informs observed content and functionality. Studio: `/app` reference governs visible tool categories, selection patterns, layout and workflows. Inspect desktop/mobile/clickable states with available native browser tools. Keep a screenshot evidence log, UX inventory, tool-by-tool behavior matrix, image replacement manifest and parity checklist. If inaccessible, owner provides screenshots/video walkthroughs. Treat visible URLs as references, not recoverable implementation artifacts. Build a NEW app while retaining observed design intent.

Brand/design goal: calm Scandinavian editorial quality; architectural photography and credible, non-misleading visualizations; premium but humane. Original approved logo; typographic and color tokens from brand PDF; keep marketing site and Studio visually connected. Default Norwegian Bokmål `nb-NO` + user switch to English; light/dark/system toggle; responsive, keyboard accessible, WCAG 2.2 AA target where relevant. Preserve narrative **Choose → Create → Explore → Decide**.

## 4. Customer outcomes and four product pillars

Vastu Nord helps homeowners, property buyers, realtors, interior designers, architects and property developers:
1. Create interior/exterior visualizations, virtual staging, renovation/furniture/material alternatives, landscaping and architectural concepts.
2. Save projects, original photos, renders, videos, versions and before/after comparisons.
3. Explore immersive but truthfully labeled Home Experience journeys.
4. Understand design decisions through evidence-aware Knowledge Hub and Prana assistant.
5. Budget/compare proposed renovation options with deterministic assumptions, not fabricated quotations.

Four pillars: **AI Render Studio, Design Knowledge Hub, Home Experience Studio, Budget Intelligence**, built on one shared Vastu Nord user/project/asset/credit data foundation. Public marketing should clearly explain what is rendered versus physical or architectural feasibility.

## 5. Recommended greenfield technology and source tree

Create one PRIVATE Vastu Nord GitHub repo (suggested `vastunord-platform`, owner supplies actual URL), then new cloud deployments. Preferred framework subject to a short ADR and verified compatibility:
- `apps/web`: Next.js + React + TypeScript, marketing + authenticated Studio, Tailwind, accessible UI components.
- `apps/cms`: Payload CMS deployed on a SEPARATE Vastu Nord Vercel project; own Neon CMS DB and media storage; editor/reviewer/publisher roles.
- `packages/ui`: optional shared Vastu Nord design tokens and components (avoid unnecessary complexity).
- `docs/`: canonical working memory, ADRs, resource/source inventory, acceptance evidence.
- `prompts/`: phased Codex instructions.

Vercel app URLs and projects must be new and under the owner account; the old prototype URLs are NEVER deployment targets. Use GitHub PRs, Vercel preview deployments and approval gates. Never claim access to the original team's deployments. GitHub is source of truth for NEW code and handoffs.

**Data:** Neon PostgreSQL application DB + Prisma (or documented alternative) for users/projects/assets/credits/consent/billing references/jobs; separate Neon DB for Payload editorial using Payload's supported PostgreSQL adapter. Give app/CMS separate database users and migration ownership. User uploads/media bytes go to private cloud object storage, not GitHub or relational blobs. Signed access, server authorization, retention, thumbnails, derivatives, EXIF policies, malware/file validation and deletion support. Public assets only after consent and approval. No cross-company data.

**AI:** authorized Azure AI Foundry / Azure OpenAI primary/backup where available; capability-based routing for supported image and video endpoints, prompt versioning, cost/rate caps, safe failures, model quality evaluation and a documented fallback when video/image APIs aren't available. Do NOT substitute an unapproved provider. Long jobs use durable workflow/queue, separate workers, persisted job state, idempotent retries, credit reservation/settlement and recoverability after browser reload.

**Auth:** secure email/password signup with verification/reset, sessions, abuse protection and account deletion/export; Google OAuth first SSO; evaluate Facebook only if justified and official app credentials available. Instagram is not assumed a general-purpose login provider. Future pro/team workspaces with server-enforced permissions; private per-user media and project isolation. No secrets in client bundles or Git.

**Billing:** separate runtime merchant account for Vastu Nord; evaluate Stripe for subscriptions, top-up credit packs, support for NOK/VAT/SCA; no live charge without owner action. Immutable/append-only credit ledger; transactional reservations; provider-verified webhooks; retries/double charge prevention; refunds and subscription changes. Prices and provider costs configurable, no fake balances.

**Publishing:** Payload on Vercel Cloud + AI-assisted **drafts only** + human editorial review and approval; Knowledge Hub article sources, citations, bilingual SEO, media stories with specific pros/cons/tradeoffs, revision history and moderation. Public gallery with opt-in rights, approval, watermark of separately chosen public display name. Private libraries not exposed to public content endpoints. Separate opt-ins for Pinterest/YouTube/each other channel; no bundling consent. Manual posting through Vastu Nord-owned Pinterest, YouTube, Facebook, Instagram, X and LinkedIn UIs; record publication URLs, revocation status, receipts. **Postiz removed from CURRENT stack**; define disabled provider-independent future adapter only, with no API keys, subscriptions or deployment.

**Chatbot:** **VastuNord Prana** with three tabs: **AI Consultation** (permissioned project-aware advice, citations from approved Payload content); **Quick Tips** (relevant micro-learning by room/task); **Film** (curated, authorized YouTube playlist). The chat assistant has its own brand-aligned icon and does not impersonate architectural certification or pretend to act on projects unless an authorized tool succeeded.

**Studio:** Observe tool categories and controls from `/app` BEFORE coding them. Candidate workflows only where shown/required: interior, exterior, virtual staging, renovation, landscape, sketch/reference transformations, furniture/material/light variants, image refinement/upscale, image-to-video, panorama, prompt helper. One backend infrastructure for Studio and Quick Tools. Every displayed control either works with real persistence or is explicitly marked unavailable (do not leave fake buttons). Generate → truthful status → stored private result → version/compare → export → consent → editorial draft.

**Contextual generation waiting:** optional, relevant micro-learning/quiz from approved Knowledge Hub, real provider job states (no invented progress%), can be skipped, doesn't block result, preserves job through navigation and reload. Home Experience begins with labeled guided visual or panoramic tours; do not claim real 3D geometry or digital twin without validation. Budget estimates are deterministic and sourced where possible, editable and display uncertainty.

**Marketing and discoverability:** accessible public site, solutions, Studio overview, gallery, Knowledge Hub, pricing, contact/support, terms/privacy, language and theme; accurate metadata/hreflang, sitemaps, responsive visual media, preview assets from owner rights-cleared Google library, performance measurement, ethical claims and security controls.

## 6. Publication, asset and safety gates

- User-created project/images/videos are PRIVATE by default, including after completing generation.
- Consent model stores asset/version, selected purposes and channels, exact terms version, timestamp, user/owner and withdrawal; unrelated future use not inferred.
- Publishing requires owner consent AND separate human approval, correct license and provenance. Derive social-ready watermarked media from approved copies, never alter/delete private original.
- Admin moderation, takedown and consent withdrawal propagate to internal gallery and generate manual social removal tasks. No guarantee that third-party social copies can be withdrawn instantly; record attempts and follow-up.
- Do not invent customer testimonials, ratings, real-world property results, use of physical Vastu claims, or proven construction savings. AI examples clearly labeled as generated concepts.
- GDPR and Norwegian/EEA legal requirements require documented review; no unverified legal-compliance guarantee. Build access/consent/delete controls and record subprocessors.

## 7. Operational readiness

Set up GitHub CI (lint/typecheck/test/secret scan), preview builds, versioned environments, structured logs (redacted), monitoring, usage/cost analytics, job alerts, backups/restore checks, error handling, feature flags, safe rollback and health checks. Avoid storing credentials, uploaded interiors or personal data in GitHub issues or logs. Vercel, Neon, Payload, AI, media and email all require their own Vastu Nord-scoped owner access and provider billing as applicable. A Codex Plus subscription is NOT a substitute for production API billing.

## 8. Progressive phases and context efficiency

Execute exactly ONE phase/increment at a time:
- `00` New-account verification + private Git bootstrapping + corrected prior Phase 00 report.
- `01` Public design/dev/Studio screen capture + exhaustive observed tool inventory and parity map.
- `02` Greenfield architecture, data ownership, contracts, security and cloud plan.
- `03` New Next.js app, repo CI, preview (if authorized), Neon app, identity and private storage.
- `04` Marketing reconstruction, brand, Norwegian/English, light/dark, approved Google assets.
- `05` Studio UI/workflows rebuilt from evidence, projects, comparisons and state.
- `06` Real image/video jobs, routing, storage and cost limits.
- `07` Credits/subscriptions/checkout and atomic ledger.
- `08` Private/public libraries, rights and per-channel consent.
- `09` Cloud Payload CMS, AI draft + human approval + knowledge stories.
- `10` Manual social publishing, publication log and disabled future adapter (NO Postiz).
- `11` VastuNord Prana's three tabs.
- `12` Contextual waiting, guided Home Experience, budgeting.
- `13` Security, accessibility, privacy, SEO, system tests and monitoring.
- `14` Staging verification, owner handholding, production go/no-go.

**Each new task:** read `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/GREENFIELD_OVERRIDE.md` and the current phase prompt. Read only related docs/code; don't repeatedly re-read full master or audit the entire repo. Make smallest working increment, test it, update current status and changelog and relevant ADRs, commit authorized verified work, report files/tests/results/blockers/next phase. Documentation stays concise and links to previous evidence, not duplicated conversation history.

**No fake success:** statuses are VERIFIED / PARTIAL / MOCK / BLOCKED / PLANNED. A planned endpoint/diagram is not a working feature. Record test proof. Production release cannot be claimed ready without real signup → project → upload → image generation → private saved result → credit settlement → consent → approval → gallery/Knowledge Hub → manual platform post log (where authorized) → Prana experience, plus permission, quality, backup and error tests. If a real AI/media/payment provider isn't configured, record it as BLOCKED and build independent modules; don't simulate a production claim.

## 9. Begin now

Do not restart from old Git/Vercel assumptions. Read `docs/PHASE00_STATE_RECONCILIATION.md` and run `prompts/00-SAFE_WORKSPACE_AND_REFERENCES.md` **ONLY**. The current planning folder already exists and prior Phase 00 recorded some valid facts. Preserve them. Prepare a NEW Vastu Nord-owned GitHub repo, reconcile progress and report owner actions. Phase 01 follows only once the preflight gate is satisfied. Never touch NRide or original teams' deployments.
