# PHASE 10 — Manual social publishing & future integration boundary (NO POSTIZ)

> **v3.3 GREENFIELD RULE:** Original developer source and hosting are unavailable. This task operates ONLY on the NEW Vastu Nord-owned repository and cloud environments. The three old URLs are design references, not implementation sources. See `docs/GREENFIELD_OVERRIDE.md`. Do not inspect or require old-team Git/Vercel credentials. Preserve recorded PROJECT_STATE; never touch NRide.

Read `AGENTS.md`, `docs/PROJECT_STATE.md`, `docs/CONTENT_AND_CONSENT.md`, `docs/TWO_COMPANY_ISOLATION.md` and `docs/CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md`.

## Preconditions
Payload editorial workflow demonstrated on Vastu Nord's cloud. Media consent and publication roles tested. Vastu Nord controls its own Pinterest, YouTube, Facebook, Instagram, X and LinkedIn accounts as available.

## Implement/document
1. Provide a cloud-first editorial/publishing calendar and platform-specific drafts in Payload CMS: company-owned materials and user content are clearly separated.
2. Build social post metadata schemas for `platform,assetId,assetVersion,consentId,approvalId,status,plannedAt,publishedAt,externalPostUrl,externalPostId,error,withdrawalStatus` and a reviewer checklist.
3. Human uploads/schedules directly in each platform's official web interface (no Postiz; no social automatic publisher). Record external link/ID/status manually in Payload/backoffice.
4. Restrict social eligible media to approved public derivatives with rights/consent for that exact platform, stripped EXIF and user-selected public watermark where required. Never send a private original, user's email or property address.
5. On withdrawal, unpublish internal gallery, flag social removals for human action, record attempted takedown and explain limitations.
6. Define but do not activate a type-safe `SocialPublisherAdapter` (`createDraft`, `schedule`, `publish`, `getStatus`, `remove`) and channel-policy hooks for later official APIs or Postiz. No credentials, plugins, paid subscriptions or real API calls for this adapter now.
7. Add a manual social runbook and test with an approved company-owned sample if owner explicitly authorizes publication. Otherwise perform only draft/preview/approval tests.

## Required documentation
`docs/CONTENT_AND_CONSENT.md`, `docs/CLOUD_PAYLOAD_AND_MANUAL_SOCIAL.md`, `docs/INTEGRATIONS_AND_ACCESS.md`, `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md`.

## Exit
Demonstrate draft → reviewer approval → prepared media/caption → manual publication logging (with simulated external ID only in a clearly marked test fixture); rejected/revoked content cannot be queued for any external channel. Never claim auto-posting is live.
