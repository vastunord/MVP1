# Database architecture — Phase 02E development branch, schema not deployed

## Phase 02E Neon verification

The Vastu Nord Neon organization already had app project `VNMVP1` (`morning-morning-84319525`) in Frankfurt (`aws-eu-central-1`). Its default `production` branch was observed empty and was not changed. Created isolated `development` branch `br-mute-resonance-bhea4dyx`; its `neondb` contains no application tables. A connector `SELECT` returned PostgreSQL 18.7 and a transaction-scoped temporary-table insert/read succeeded without persistent test records. This proves branch connectivity through the connector only; it does not establish application/Prisma connectivity or runtime role isolation.

Both committed migration files were reviewed for drop/truncate/data-delete statements and none were found. The local Prisma CLI reported a schema-engine error; a network probe confirmed DNS resolution of the development endpoint fails from this computer. No migration was applied and `_prisma_migrations` was not created. The production branch remains untouched. Create separate runtime/migration roles and rerun `prisma migrate status` then `migrate deploy` on the named development branch after secure local connectivity is restored; never substitute the default branch URL.

## Phase 02D extension — prepared, not migrated

The second migration adds Better Auth user fields and the generated `Session`, `Account`, `Verification` and database rate-limit tables. It adds `Workspace.personalOwnerId` (unique), transactional owner membership, project description, idempotency key, archive and soft-delete timestamps. The migration uses non-null defaults for added user name/update time and project update time so an existing Phase 02C table with rows can be upgraded. No live migration or rollback test has occurred. All project reads and writes use the authenticated personal owner's workspace; UI-supplied user/workspace IDs are ignored. A deleted project is hidden, while linked media remains subject to separate retention and ownership rules. The full ledger, billing, CMS schema and general team workspaces remain deferred.

## Implemented foundation (2026-11-21)

`apps/web/prisma/schema.prisma` and its versioned initial SQL migration define users, workspaces and memberships, projects, private asset metadata and versions, upload intents, render job state, per-version channel consent, editorial review, gallery items and audit events. Image/video bytes stay in private object storage. Composite asset/project and version/workspace relations prevent cross-workspace attachment at the database level; actor/membership checks still belong in every server operation. Prisma Client uses `@prisma/adapter-pg` with a server-only pooled `DATABASE_URL`; migration configuration uses `DIRECT_DATABASE_URL`. `createDatabase` fails closed without a URL. `/api/health` returns 503 when unconfigured or when its read-only `SELECT 1` fails, and 200 only after a successful query; storage remains separately marked unverified.

The migration was generated and validated offline. It has not run against Neon, and role separation, transactions, connection pooling, backups and restore remain unverified. Auth identities/sessions, full credit ledger, billing, outbox, job retries and CMS are later work. Schema constraints alone do not prove authorization. No production data or credentials were used.

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
