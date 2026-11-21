# Data and API contract draft

**Core entities (scope, do not migrate until designed and approved):** `User`, `AuthIdentity`, `Session`, `Workspace`, `Membership`, `Project`, `Room`, `SourceAsset`, `GeneratedAsset`, `AssetVersion`, `RenderJob`, `PromptVersion`, `CreditWallet`, `CreditGrant`, `CreditReservation`, `LedgerEntry`, `PaymentEvent`, `Subscription`, `UsageRecord`, `ConsentGrant`, `PublicationRequest`, `ModerationDecision`, `PublicGalleryItem`, `PinterestPost`, `YouTubePublication`, `KnowledgeArticle`, `KnowledgeSource`, `EditorialReview`, `AuditEvent`.

**Required audit fields:** unique ID; owner/workspace ID; created/updated timestamp; visibility; source and provenance; model/provider ID where AI-generated; consent snapshot; content version; publish and rollback IDs; job/correlation IDs.

**Key APIs** (make typed contracts before implementation):
- `POST /api/projects` — create private project;
- `POST /api/assets/uploads` — issue scoped upload URL, validate file type/size;
- `POST /api/jobs/quote` — deterministic credit quote;
- `POST /api/jobs` — idempotent credit reservation + job;
- `GET /api/jobs/:id` — authorized status/result;
- `GET /api/projects/:id/assets` — scoped library;
- `POST /api/assets/:id/publication-request` — separate channel consents;
- `POST /api/publications/:id/revoke` — stop public display, request takedown;
- `GET /api/gallery` — only approved public assets;
- `POST /api/billing/checkout` + signed webhook — controlled payments;
- `POST /api/prana` — authenticated, scoped 3-tab assistant retrieval.

Use database transactions for credit reserve/consume/release. Tests must enforce two users cannot view each other's original images or create publications on another user's behalf. External idempotent jobs need partner request/response IDs and retry histories.
