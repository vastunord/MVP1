# Vastu Nord architectural decisions

Record only significant decisions. One entry: ID, date, status (`proposed/accepted/rejected/superseded`), evidence, alternatives, impact, dependencies and test/approval. For large decisions use a file under `docs/adr/`.

| ID | Date | Decision | Status | Rationale / link |
|---|---|---|---|---|
| D-001 | 2026-11-21 | Architecture-first, separate Vastu Nord resources from existing Codex business | Proposed pending setup | Owner instruction; resource isolation |
| D-002 | 2026-11-21 | Every user-generated asset private until independent explicit publication consent | Proposed pending legal/product approval | Privacy and consent protection |

## Phase 02A decisions — 2026-11-21

Owner-directed policies below supersede tentative D-001/D-002 wording: company isolation and private-by-default outputs are accepted requirements; legal copy and retention still need approval. No decision below is a provisioning authorization.

| ID | Decision / status | Rationale, alternative and impact | Dependency / verification |
|---|---|---|---|
| D-003 | Dedicated Vastu Nord repo/Vercel/Neon, independent cloud Payload, private media and API credentials — ACCEPTED OWNER REQUIREMENT | Separate resources protect NRide; no shared global credential configuration | Verify each vendor identity before writes; isolation tests |
| D-004 | Two-app workspace, shared contracts, web API/modules and workflow steps — PROPOSED | Simpler than separate API/worker microservices; CMS remains independently deployable as required | Founder acceptance; compatible version/build tests |
| D-005 | Prisma app + separate Payload Postgres migrations — EXISTING PREFERENCE / PROPOSED DETAIL | Prevent ORM collisions; reject shared-schema ownership | Separate roles/projects; migration/restore tests |
| D-006 | Better Auth, private Blob, Vercel Workflow, Stripe Checkout — PROPOSED | Minimize operated infrastructure; alternatives include managed auth, other private object stores/workflow/payment providers | Founder choice; plan/region/capability/cost and sandbox tests; no accounts assumed |
| D-007 | App owns atomic credit reservation/job outbox and consent gate — PROPOSED MECHANISM; privacy policy ACCEPTED | Prevent double charge/lost jobs and CMS bypass; reject browser-owned balances or CMS-only consent | Race/replay/uncertain-provider/revocation tests |
| D-008 | Manual channel publishing; future SocialPublisherAdapter disabled — ACCEPTED OWNER REQUIREMENT | Avoid initial Postiz integration/cost; later provider remains optional | Per-channel consent/review; no live adapter until authorized |
| D-009 | Preserve observed routes, suppress six broken links, signup/app CTAs, unprefixed nb + /en — PROPOSED | Avoid invented missing pages and conflicting reference targets; redirects need explicit semantic target | Founder approves CTA/locale/route briefs; route tests |
| D-010 | RPO ≤24h, RTO ≤8h, no extra search/monitoring service initially — PROPOSED | Small initial operational footprint; add infrastructure only when measured need appears | Founder budget/retention approval and restore drill |

Detailed boundaries and consequences: `docs/ARCHITECTURE.md`, `docs/DATABASE_ARCHITECTURE.md`, `docs/AI_AND_WORKERS.md`, `docs/INTEGRATIONS_AND_ACCESS.md`. All runtime integration state remains PLANNED/UNVERIFIED.

## Historical ADR v3.1 — SUPERSEDED (not to execute)

**Decision:** Keep Payload, hosted as an independent Vercel app with isolated Neon CMS DB and object storage; adopt Postiz Cloud (not self-hosted) for authorized Pinterest and YouTube distribution. **Reason:** no locally hosted production systems, fewer operations dependencies, human-gated editorial publishing and maintained separation from the other business. **Consequence:** one additional Vercel project, one paid Postiz cloud subscription, vendor API dependency and separate consent/approval gates. **Alternative rejected now:** direct Pinterest/YouTube integration as the initial launch requirement. Status: SUPERSEDED BY v3.2; do not implement, subscribe, or create this service.


### ADR v3.2 — Independent ownership and deferred Postiz (supersedes v3.1)
**Decision:** Two independent vendor accounts and all resources for NRide and Vastu Nord; one unrelated Codex developer account for both codebases. Vastu Nord Payload stays cloud-hosted on its own Vercel/Neon. Postiz is NOT active; manually post via brand-owned native social services after separate consent/editorial approval. Future `SocialPublisherAdapter` remains disabled until authorized. **Reason:** hard operational isolation, avoid extra subscription now, preserve option to automate later. **Status:** APPROVED TARGET DESIGN, NOT IMPLEMENTED. Earlier v3.1 Postiz decision is superseded.

## Phase 02B owner direction — 2026-11-21

- D-011 ACCEPTED: owner explicitly confirmed Norwegian public URLs at / and English at /en; Studio retains /app and saved language preference. This resolves the locale part of D-009 only.
- D-012 ACCEPTED TASK SCOPE: local Next.js/React/TypeScript/Tailwind frontend, real localization/theme, all 17 shared configuration-driven editors, explicit disabled integrations and tests. No paid/cloud setup or backend/provider approval is implied.
- D-013 IMPLEMENTATION LIMIT: use source PDF RGB fill operands for palette; system-font fallback and plain text identity until licensed font/approved logo assets are supplied. Spacing and layouts remain provisional; exact reference parity is not claimed.
