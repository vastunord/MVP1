# Database architecture — proposed, not migrated

Dedicated Neon app and CMS projects under Vastu Nord; Prisma owns app migrations, Payload PostgreSQL adapter owns CMS migrations. Separate runtime/migration roles; neither deployment has the other's DB credentials. Nonproduction uses synthetic data.

| Aggregate | Records / invariant |
|---|---|
| Identity | User, AuthIdentity, Session, Workspace, Membership; unique workspace/user membership |
| Project | Project, optional Room, File; mandatory workspace and same-workspace parent constraints |
| Media | Asset, AssetVersion, UploadIntent; private default, random storage key, MIME/bytes/checksum, validation state, rights/provenance and retention |
| Generation | RenderJob, ProviderAttempt, PromptVersion, ToolConfigVersion; immutable input/options/provider snapshot |
| Credits | Wallet, Grant, Reservation, LedgerEntry, UsageRecord; integer credits, nonnegative spendable balance, unique settlement per job |
| Billing | Customer, Subscription, PaymentEvent; unique provider event; money in minor units + currency, separate from credits |
| Publication | ConsentGrant per version/channel, PublicationRequest, ReviewDecision, PublicationRecord, Revocation |
| Operations | OutboxEvent, InboxEvent, AuditEvent; correlation IDs, unique external event IDs and retry history |

Every scoped query enforces membership; composite workspace/parent constraints prevent cross-workspace attachments. Index workspace+updatedAt, project assets, job state+nextAttemptAt and pending outbox. Use bounded cursor pagination. Never trust client ownership fields.

## Wallet and consistency

Transaction locks wallet, validates available credits/quote, creates job+reservation+outbox. Available = funded minus consumed minus active reservations. Hold is not a debit. Success adds exactly one ledger debit and closes reservation; definitive failure releases once. Unique workspace/idempotency key returns original response; changed body conflicts. Refunds use compensating entries. Reversed payments revoke unused grants and flag debt if credits were spent; never erase history. Founder must approve expiry, subscription and refund policies.

CMS references app asset/version/publication IDs; app remains authoritative for consent and access. Outbox sync is retryable/idempotent. Withdrawal disables app delivery, invalidates cache and creates manual channel takedown tasks. Third-party downloaded copies cannot be promised deleted.

## Migration and backup

Version-control separate Prisma and Payload migrations. Apply reviewed changes serially with backup checks; no production schema push. Prefer expand/backfill/contract; roll back application code only while schema remains compatible. Use pooled runtime and scoped migration connection as supported by the pinned versions. [Neon's Prisma guide](https://github.com/neondatabase/website/blob/main/content/docs/guides/prisma.md) documents runtime/CLI connection patterns. Payload supplies its own [PostgreSQL adapter](https://payloadcms.com/docs/database/postgres) and [migration controls](https://payloadcms.com/docs/database/migrations).

Propose RPO ≤24h/RTO ≤8h, subject to founder approval and purchased retention. Back up DB plus media bytes/manifests; restore into isolated nonproduction before launch, reconcile external billing/provider state before enabling jobs. Test clean and upgrade migrations, role isolation, concurrent credit holds, duplicate events, revocation and restore. No migration or backup configured here.
