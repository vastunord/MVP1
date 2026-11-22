# Environment variable inventory

The assigned [Vastu Nord site](https://vastunord-web.vercel.app) serves the noncommercial demonstration. Its Production sign-in origin is configured. Account creation, private uploads, provider spending, newsletter enrollment and search indexing each require separate verification and activation.

Updated 22 November 2026. Vastu Nord owns the configurations below. Status refers to the named environment.

| Name / configuration | Purpose | Development | Preview (optional) | Production |
|---|---|---|---|---|
| DATABASE_URL | Neon pooled application connection | VERIFIED development endpoint; temporary development owner role | CONFIGURED, owner confirmed branch/role; runtime UNVERIFIED | UNVERIFIED existing secret; replace with restricted Production runtime connection before use |
| DIRECT_DATABASE_URL | Migration connection; protected context only | Separate protected development helper | OPTIONAL-DEFERRED | MISSING protected Production migration handoff |
| BETTER_AUTH_SECRET | Session signing | CONFIGURED; live Development tested | CONFIGURED, distinct; not deployed | CONFIGURED, distinct strong secret; runtime UNVERIFIED |
| BETTER_AUTH_URL | Canonical auth origin | CONFIGURED for local testing | Derived from validated VERCEL_URL | CONFIGURED for the assigned HTTPS site. Live sign-in remains closed. |
| AUTH_ENABLED | Production authentication gate | Not required | Not required | CONFIGURED false |
| AUTH_EMAIL_PROVIDER, AUTH_EMAIL_FROM, RESEND_API_KEY | Transactional email | CONFIGURED; controlled live signup passed | CONFIGURED; delivery UNVERIFIED | CONFIGURED approved sender and domain-scoped key; delivery UNVERIFIED |
| NEWSLETTER_ENABLED, NEWSLETTER_TOKEN_SECRET | Double opt-in and signed withdrawal links. Uses the approved Resend sender and canonical origin. | Off. Dedicated signing key, reviewed newsletter migration and controlled delivery pending. | Disabled | Off. Enrollment also requires commercial approval. Withdrawal can continue when enrollment is paused. |
| BLOB_STORE_ID, VERCEL_OIDC_TOKEN | Private Blob and server identity | VERIFIED private store and synthetic tests | CONFIGURED separate private store; live use UNVERIFIED | CONFIGURED separate private store and association; live use UNVERIFIED |
| BLOB_READ_WRITE_TOKEN | Alternative static Blob credential | OPTIONAL-DEFERRED; OIDC used | OPTIONAL-DEFERRED | OPTIONAL-DEFERRED; OIDC used |
| MEDIA_UPLOADS_ENABLED | Private uploads | CONFIGURED true; tested | CONFIGURED; live use UNVERIFIED | CONFIGURED false |
| MEDIA_RECONCILIATION_ENABLED, MEDIA_RECONCILIATION_SECRET | Protected cleanup | CONFIGURED; no schedule | CONFIGURED; no schedule | CONFIGURED false; no secret or schedule |
| APP_ENV, VERCEL_ENV, VERCEL_URL | Environment and deployment origin | Configured | Configured. Preview deployment optional. | Configured on assigned Vercel site |
| GOOGLE_OAUTH_ENABLED, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Optional Google OAuth | OPTIONAL-DEFERRED | OPTIONAL-DEFERRED | DISABLED; credentials OPTIONAL-DEFERRED |
| VASTUNORD_DEV_MIGRATOR_PASSWORD | Development-only migration secret | Protected local migration context; absent from app runtime | REMOVED from Vercel | REMOVED from Vercel |
| OPENAI_API_KEY, PRANA_ENABLED, PRANA_DAILY_QUERY_LIMIT | Server-side Prana questions, activation and global UTC daily allowance | Provider key requested. Requires approved positive cap and controlled verification. | Disabled | Off |
| PRANA_FILM_VIDEO_ID | Opt-in playback of an editorially approved public YouTube film | Optional. No approved film supplied. | Optional | Unconfigured |
| MNML_API_KEY, MNML_RENDERING_ENABLED, MNML_DAILY_JOB_LIMIT | Private MNML v2 rendering and shared daily job cap | Provider key and approved limit requested. RenderJob schema change and a private synthetic provider test required. | Disabled | Disabled |
| MNML_DAILY_VIDEO_JOB_LIMIT | Separate video allowance within the render job cap | Zero by default. Requires separate cost approval. | Disabled | Disabled |
| COMMERCIAL_LAUNCH_APPROVED, PUBLIC_INDEXING_ENABLED | Gate business-only features and bilingual indexing | Off | Off | Off on Hobby |
| VASTUNORD_CMS_DATABASE_URL, VASTUNORD_CMS_DATABASE_HOST, VASTUNORD_CMS_SECRET | Dedicated Payload database, host check and server signing key | Isolated local tests. Real credentials belong to a separate CMS service. | Unconfigured | Separate CMS project and restricted database pending |
| VASTUNORD_CMS_MIGRATION_DATABASE_URL | Dedicated CMS migration role | Migration runner only | Outside app | Outside app |
| VASTUNORD_CMS_BOOTSTRAP_EMAIL, VASTUNORD_CMS_BOOTSTRAP_PASSWORD | First CMS administrator | One-time protected operator session | Outside app | Outside app |
| VASTUNORD_CMS_PUBLIC_ORIGIN | Web app's read-only published journal origin | Optional. Cloud CMS unavailable | Unconfigured | Unconfigured. Keep absent until dedicated CMS is verified |
| Payments and social publishing | Separate founder decisions | Deferred | Deferred | Disabled |

Production application schema is absent. The separate Production role passed a provider-backed read-only identity check; the Vercel runtime mapping and application authorization remain unverified. Resend domain verification and Blob association do not prove delivery or object access. See [owner setup](OWNER_CLOUD_SETUP.md) and [deployment plan](DEPLOYMENT_PLAN.md).
