# Environment variable inventory

**Phase 02F live demo:** One noncommercial Hobby deployment is running at https://vastunord-web.vercel.app. Production auth, upload and reconciliation flags remain off; live disabled endpoints were verified. DATABASE_URL remains unverified and application schema absent. BETTER_AUTH_URL has not been configured for the deployed site and authentication remains disabled. Preview is optional. No secret values were inspected or added during deployment.

Checked 2026-11-21. Owner: Vastu Nord. Names and statuses only; never record values or complete connection strings. Configuration is distinct from verified end-to-end behavior.

| Name / configuration | Purpose | Development | Preview (optional) | Production |
|---|---|---|---|---|
| DATABASE_URL | Neon pooled application connection | VERIFIED development endpoint; temporary development owner role | CONFIGURED, owner confirmed branch/role; runtime UNVERIFIED | UNVERIFIED existing secret; replace with restricted Production runtime connection before use |
| DIRECT_DATABASE_URL | Migration connection; protected context only | Separate protected development helper | OPTIONAL-DEFERRED | MISSING protected Production migration handoff |
| BETTER_AUTH_SECRET | Session signing | CONFIGURED; live Development tested | CONFIGURED, distinct; not deployed | CONFIGURED, distinct strong secret; runtime UNVERIFIED |
| BETTER_AUTH_URL | Canonical auth origin | CONFIGURED for local testing | Derived from validated VERCEL_URL | MISSING until actual assigned HTTPS deployment origin exists |
| AUTH_ENABLED | Production authentication gate | Not required | Not required | CONFIGURED false |
| AUTH_EMAIL_PROVIDER, AUTH_EMAIL_FROM, RESEND_API_KEY | Transactional email | CONFIGURED; controlled live signup passed | CONFIGURED; delivery UNVERIFIED | CONFIGURED approved sender and domain-scoped key; delivery UNVERIFIED |
| BLOB_STORE_ID, VERCEL_OIDC_TOKEN | Private Blob and server identity | VERIFIED private store and synthetic tests | CONFIGURED separate private store; live use UNVERIFIED | CONFIGURED separate private store and association; live use UNVERIFIED |
| BLOB_READ_WRITE_TOKEN | Alternative static Blob credential | OPTIONAL-DEFERRED; OIDC used | OPTIONAL-DEFERRED | OPTIONAL-DEFERRED; OIDC used |
| MEDIA_UPLOADS_ENABLED | Private uploads | CONFIGURED true; tested | CONFIGURED; live use UNVERIFIED | CONFIGURED false |
| MEDIA_RECONCILIATION_ENABLED, MEDIA_RECONCILIATION_SECRET | Protected cleanup | CONFIGURED; no schedule | CONFIGURED; no schedule | CONFIGURED false; no secret or schedule |
| APP_ENV, VERCEL_ENV, VERCEL_URL | Environment and preview origin | CONFIGURED | CONFIGURED; deployment origin UNVERIFIED | APP_ENV CONFIGURED; Vercel injection not yet deployed |
| GOOGLE_OAUTH_ENABLED, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Optional Google OAuth | OPTIONAL-DEFERRED | OPTIONAL-DEFERRED | DISABLED; credentials OPTIONAL-DEFERRED |
| VASTUNORD_DEV_MIGRATOR_PASSWORD | Development-only migration secret | Protected local migration context; absent from app runtime | REMOVED from Vercel | REMOVED from Vercel |
| AI image/video, Stripe, Payload, social | Future integrations | OPTIONAL-DEFERRED | OPTIONAL-DEFERRED | OPTIONAL-DEFERRED; no guessed names, activation or Postiz |

Production application schema is absent. The separate Production role passed a provider-backed read-only identity check; the Vercel runtime mapping and application authorization remain unverified. Resend domain verification and Blob association do not prove delivery or object access. See [owner setup](OWNER_CLOUD_SETUP.md) and [deployment plan](DEPLOYMENT_PLAN.md).
