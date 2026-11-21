# PHASE 02 — NEW application architecture and cloud contracts

**Effort: MEDIUM; escalate to HIGH only for an unresolved architectural/security problem.** Use evidence from Phase 01 and existing product scope, not imaginary old APIs/source.

Read `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/GREENFIELD_OVERRIDE.md`, `docs/ARCHITECTURE.md`, `docs/RESOURCE_ISOLATION.md`, `docs/INTEGRATIONS_AND_ACCESS.md`, `docs/DATA_AND_API_CONTRACTS.md`, `docs/GITHUB_VERCEL_BOOTSTRAP.md` and this phase.

1. Design new Vastu Nord-owned source tree; recommend lightweight monorepo `apps/web` (Next.js) + `apps/cms` (Payload Vercel) + optional shared UI package, or justify a simpler layout. NONE of these is sourced from original developer repo.
2. Define Vercel cloud project ownership/config for web and CMS, separate Neon app and CMS databases/users, Prisma for app, Payload-supported Postgres adapter for CMS; secure object storage, user auth, AI provider router, durable job queue, transactional wallet/credit ledger, billing and human approved publishing. Guard brand account isolation from NRide.
3. Map complete journey from marketing → signup → project → private upload → AI job → real result → version/compare → credits → consent → editorial review → public gallery/Knowledge Hub → manual native social posting → Prana.
4. Draw system Mermaid diagram, inventory API/data contracts and service account boundaries, ADRs for repo/deployment, database separation, storage/AI jobs, and publishing permissions. Explicitly mark credential/provisioning owner actions; no live cloud writes.
5. Identify screenshot gaps inherited from Phase 01; do not treat inaccessible former source as technical dependency. Cost estimates must distinguish free templates from actual usage.

Update `docs/ARCHITECTURE.md`, `docs/DATA_AND_API_CONTRACTS.md`, `docs/DECISIONS.md`, `docs/RESOURCE_ISOLATION.md`, `docs/INTEGRATIONS_AND_ACCESS.md`, `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md`.

**Exit:** architecture and contracts testable; branch/commit recorded, no new live resources without approval. Project plan ready for first code scaffolding.
