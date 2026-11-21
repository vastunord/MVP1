# PHASE 09 — Payload CMS on Vercel Cloud (no local hosting)

> **v3.3 GREENFIELD RULE:** Original developer source and hosting are unavailable. This task operates ONLY on the NEW Vastu Nord-owned repository and cloud environments. The three old URLs are design references, not implementation sources. See `docs/GREENFIELD_OVERRIDE.md`. Do not inspect or require old-team Git/Vercel credentials. Preserve recorded PROJECT_STATE; never touch NRide.

Read `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md`, `docs/CONTENT_AND_CONSENT.md`, and this phase only.

## Preconditions
Phases 00–08: repository isolation, Vastu Nord database, auth and per-asset gallery consent verified; owner authorized CMS project and services.

## Scope
1. Use the **separately owned Vastu Nord repo and Vercel account**, never NRide. Create a separate cloud deployment `vastunord-cms` with the Vastu Nord-owned isolated Neon CMS database and separate private role. Do not overwrite the website or unrelated projects. Evaluate official Payload Vercel starter as a basis, not a mandatory replacement.
2. Configure `PAYLOAD_SECRET`, database connection, cloud media storage and any appropriate cron/preview secrets **only in Vercel environment variables**; protect admin access. No local production host, VPS, Docker server or self-managed Payload worker.
3. Configure content types for Knowledge Hub articles, categories, approved gallery features, tips, media metadata, reviewer approvals and social-draft candidates; support `nb-NO` and `en`.
4. Implement `AI research/draft → automated checks → human editorial review → human publish`. Never publish any private user image or unapproved article. All sources, image rights and consents must be verified.
5. Test Payload Admin on the Vercel preview deployment, published-only site API, cache invalidation and data/role isolation.

## Documentation
Update `docs/PROJECT_STATE.md`, `docs/SETUP_WALKTHROUGH.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT_AND_CONSENT.md`, `docs/INTEGRATIONS_AND_ACCESS.md`, and the changelog. Do not duplicate entire master prompt.

## Exit
Demonstrate one Norwegian/English **approved draft → publish** workflow running in the cloud, without exposing private assets or modifying other businesses. If owner credentials are unavailable, complete safe configuration/interfaces and mark the live gate BLOCKED.
