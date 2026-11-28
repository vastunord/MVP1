# Environment variable inventory

## 28 November 2026 · Actual Production runtime evidence

Staged Vercel server logs confirmed presence of `DATABASE_URL`, the auth secret, the correct release origin, sender configuration, MNML configuration and Blob store configuration. The database URL failed its pinned configuration check before any connection. Production account login, email delivery and Blob operations remain unverified. A direct migration runner is a separate operator dependency. The promoted demo fixes `AUTH_ENABLED`, `MEDIA_UPLOADS_ENABLED`, `MEDIA_RECONCILIATION_ENABLED`, `MNML_RENDERING_ENABLED`, `MNML_SUBMISSION_ENABLED`, `NEWSLETTER_ENABLED` and `PRANA_ENABLED` to false in both build and runtime. The staged-only diagnostic flag was omitted from the release. See [release evidence](GO_LIVE_EXECUTION.md).

The assigned [Vastu Nord site](https://vastunord-web.vercel.app) serves the noncommercial demonstration. Its Production sign-in origin is configured. Account creation, private uploads, provider spending, newsletter enrollment and search indexing each require separate verification and activation.

Updated 22 November 2026. Vastu Nord owns the configurations below. Preview runs with Vercel Authentication for development testing. The two AI credential names are case-sensitive. The application reads them only on the server.

| Name / configuration | Purpose | Development | Preview (optional) | Production |
|---|---|---|---|---|
| DATABASE_URL | Neon pooled application connection | VERIFIED development endpoint; temporary development owner role | VERIFIED by the protected build against the exact Preview branch, pool, restricted role and database | BLOCKED. The actual Production build failed the expected pool/database/role/TLS check and skipped connecting. Current target undisclosed. |
| DIRECT_DATABASE_URL | Migration connection; protected context only | Protected development helper; current credential rejected (28P01) | Protected Preview migration credential missing | MISSING protected Production migration handoff |
| BETTER_AUTH_SECRET | Session signing | CONFIGURED; live Development tested | CONFIGURED and available to the protected build | CONFIGURED, distinct strong secret; runtime UNVERIFIED |
| BETTER_AUTH_URL | Canonical auth origin | CONFIGURED for local testing | Derived from validated VERCEL_URL | CONFIGURED for the assigned HTTPS site. Live sign-in remains closed. |
| AUTH_ENABLED | Production authentication gate | Not required | Not required | CONFIGURED false |
| AUTH_EMAIL_PROVIDER, AUTH_EMAIL_FROM, RESEND_API_KEY | Transactional email | CONFIGURED; controlled live signup passed | Verified Preview email-delivered signup flow and first sign-in | CONFIGURED approved sender and domain-scoped key; delivery UNVERIFIED |
| NEWSLETTER_ENABLED, NEWSLETTER_TOKEN_SECRET | Double opt-in and signed withdrawal links with Resend. | Isolated signing secret configured. Enrollment awaits migration and delivery test. | Separate secret configured. Enrollment awaits migration and limited role grants. | Off. Enrollment requires commercial approval. |
| BLOB_STORE_ID, VERCEL_OIDC_TOKEN | Private Blob and server identity | VERIFIED private store and synthetic tests | VERIFIED separate store and authenticated upload, retrieval and deletion | CONFIGURED separate private store and association; live use UNVERIFIED |
| BLOB_READ_WRITE_TOKEN | Alternative static Blob credential | OPTIONAL-DEFERRED; OIDC used | OPTIONAL-DEFERRED | OPTIONAL-DEFERRED; OIDC used |
| MEDIA_UPLOADS_ENABLED | Private uploads | CONFIGURED true; tested | CONFIGURED true; synthetic private media journey passed | CONFIGURED false |
| MEDIA_RECONCILIATION_ENABLED, MEDIA_RECONCILIATION_SECRET | Protected cleanup | CONFIGURED; no schedule | CONFIGURED; no schedule | CONFIGURED false; no secret or schedule |
| APP_ENV, VERCEL_ENV, VERCEL_URL | Environment and deployment origin | Configured | Configured. Preview deployment optional. | Configured on assigned Vercel site |
| GOOGLE_OAUTH_ENABLED, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET; GITHUB_OAUTH_ENABLED, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET; APPLE_OAUTH_ENABLED, APPLE_CLIENT_ID, APPLE_CLIENT_SECRET | Independently configured consumer login options. Apple requires a Service ID and expiring signed client secret. | Provider credentials missing | Provider credentials missing | Disabled |
| VASTUNORD_DEV_MIGRATOR_PASSWORD | Development-only migration secret | Protected local migration context; absent from app runtime | REMOVED from Vercel | REMOVED from Vercel |
| GroqAPI | Shared server credential for bilingual Prana and Studio brief improvement. Spending controls live in Groq. | Server-side secret present | Live consultation and brief improvement verified | Present, commercial activation gated |
| PRANA_FILM_VIDEO_ID | Optional approved film override. Otherwise Prana looks up the latest public upload from the verified Vastu Nord channel. | Optional | Optional | Optional |
| MNMLAPI | Private Studio rendering through MNML v2. The five Prana V1 quality choices map to provider models. Provider-account limits apply. | Hidden variable present | Replacement secret verified against MNML account and engines. One synthetic render succeeded. The required schema and narrow runtime grants are installed. | Present, adapter disabled |
| MNML_SUBMISSION_ENABLED | Explicit gate for new paid renders. Existing render history remains readable. | Unset | Unset, so new submissions are disabled | Unset |
| COMMERCIAL_LAUNCH_APPROVED, PUBLIC_INDEXING_ENABLED | Gate business-only features and bilingual indexing | Off | Off | Off on Hobby |
| VASTUNORD_CMS_DATABASE_URL, VASTUNORD_CMS_DATABASE_HOST, VASTUNORD_CMS_SECRET | Dedicated Payload database, host check and server signing key | Isolated local tests. Real credentials belong to a separate CMS service. | Unconfigured | Separate CMS project and restricted database pending |
| VASTUNORD_CMS_MIGRATION_DATABASE_URL | Dedicated CMS migration role | Migration runner only | Outside app | Outside app |
| VASTUNORD_CMS_BOOTSTRAP_EMAIL, VASTUNORD_CMS_BOOTSTRAP_PASSWORD | First CMS administrator | One-time protected operator session | Outside app | Outside app |
| VASTUNORD_CMS_PUBLIC_ORIGIN | Web app's read-only published journal origin | Optional. Cloud CMS unavailable | Unconfigured | Unconfigured. Keep absent until dedicated CMS is verified |
| Payments and social publishing | Separate founder decisions | Deferred | Deferred | Disabled |

Neon identifies the Frankfurt Production branch as `br-wild-unit-bhin6sli`, direct endpoint `ep-shiny-block-bhmlplzm`, database `neondb` and restricted role `vastunord_prod_runtime`. On 22 November the protected Vercel build for `0a99e002adc9` rejected the existing Production connection configuration before opening a socket. The previous provider inspection found no application schema. Replace only the Production secret with the restricted role's pooled TLS URL, then verify the protected build check and separately qualify account and media operations. [Owner setup](OWNER_CLOUD_SETUP.md) · [Deployment plan](DEPLOYMENT_PLAN.md)
