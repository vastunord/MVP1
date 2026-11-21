# API contracts — planned v1

Canonical API boundary; no endpoint implemented. JSON DTOs, opaque IDs, ISO UTC timestamps, integer credits. Errors: {code,messageKey,requestId,fieldErrors?}. Derive workspace identity from authenticated membership. Bound list sizes and use cursors. Mutation endpoints require origin/CSRF checks and server validation.

Use 401 unauthenticated, 404 inaccessible object, 409 state/idempotency conflict, 422 invalid input, 429 quota/rate limit, 503 unavailable integration. Never return storage credentials or private provider payloads.

| Method / path | Request → response | Required rule |
|---|---|---|
| POST /api/projects | name/description → private project | member; no client-set owner/public state |
| GET /api/projects/:id/assets | cursor → scoped assets | membership; DTO filtering |
| POST /api/assets/uploads | projectId,type,bytes,name → intentId,expiring upload grant | member; assigned random key and quota |
| POST /api/assets/uploads/:id/complete | checksum → pending-validation asset | intent owner; validate actual bytes before use |
| GET /api/assets/:id/download | version → expiring grant or authorized stream | current ownership/share permission |
| POST /api/jobs/quote | tool/configVersion,assets,options → quoteId,credits,expiry | server capability and price; unsupported returns blocked |
| POST /api/jobs | quoteId,prompt,assets,options + Idempotency-Key → 202 job/statusUrl | snapshot matches quote; reserve+job+outbox transaction |
| GET /api/jobs/:id | → actual state,output IDs,safe error | authorized scope; no fabricated progress |
| POST /api/jobs/:id/cancel | → cancellation state | authorized edit; uncertain provider cost reconciled |
| GET /api/files/:id/versions | cursor → immutable versions | scoped viewer |
| POST /api/files/:id/exports | versions,format/options → export job | permissions; quote/reservation if paid |
| POST /api/review-links | versions,permissions,recipient mode,expiry → share token | member; hashed token/revocation; no gallery consent implied |
| POST /api/assets/:id/publication-request | version,channel grants,rights → review request | asset owner; voluntary per-channel consent |
| POST /api/publications/:id/revoke | → revoked/takedown task state | consent owner; invalidate app delivery |
| GET /api/gallery | cursor → approved derivatives | active consent + editorial approval only |
| POST /api/billing/checkout | server plan/pack ID → checkout URL | workspace owner; server pricing/idempotency |
| POST /api/webhooks/billing | signed event → acknowledgement | verify raw-body signature; durable deduplicated inbox |
| POST /api/prana | tab,message,optional projectId → citations/tips/film | authenticated; scope-filtered retrieval and limits |

Auth routes belong to the selected auth library. Internal CMS approval/revalidation and AI completion endpoints require scoped service credentials or provider signatures, replay protection and authoritative record lookup. No browser-held service secrets. Lists expose no cross-workspace counts.

Tests later: two-user isolation on every object endpoint, bad payloads, stale quotes, repeated keys with different bodies, duplicate webhooks, invalid origin, expired grants, insufficient concurrent credits, consent withdrawal during publish and failed export. Disabled integration must never return fake success.
