# Authentication and security — Phase 02E verification status

## Phase 02E-2 runtime and authentication test status

Neon connector SQL on Vastu project `morning-morning-84319525`, development branch `br-mute-resonance-bhea4dyx`, confirmed two completed migrations. Prisma migrate status using the isolated migration credential reported up to date. The Neon role list showed `neondb_owner` and `vastunord_dev_migrator`; no separate runtime role was found. Vercel `vastunord-web` Development has no `DATABASE_URL`, `BETTER_AUTH_SECRET` or `BETTER_AUTH_URL` listed. A child-process readiness check confirmed `AUTH_EMAIL_PROVIDER` is Resend, `AUTH_EMAIL_FROM` is `no-reply@vastu.no`, a Resend key is present, Google OAuth is disabled and no valid auth secret/runtime database URL was injected. Values were not printed.

Security issue: `VASTUNORD_DEV_MIGRATOR_PASSWORD` is present in the same Vercel Development environment. A normal process started with `vercel env run` inherits it. Keep migration credentials out of normal app processes, move the credential to a separate restricted migration context or remove the project variable after arranging a safe migration-only alternative. No credential was removed during this task. No frontend source references to secret-prefixed public variables were found in the focused search; this is not a complete secret audit.

The owner provided two controlled test inboxes. Actual email delivery, signup verification, password reset, expired/invalid links, real sessions, project persistence and two-user isolation remain BLOCKED / NOT TESTED because the separate runtime database role/URL and auth secret are absent. The email sender implementation uses English subject/text strings for both cases; Norwegian email localization is not implemented in the inspected code. No message or test account was created. Local tests use isolated policy fixtures and cannot establish cloud persistence or real authentication.

Setup required: create a dedicated development runtime role with LOGIN and only schema USAGE and the table/sequence privileges required by auth and project operations, excluding schema/database CREATE and role administration. Configure a pooled development-only `DATABASE_URL` for that role and a unique development-only `BETTER_AUTH_SECRET` of at least 32 characters via protected server-side variables. Set `BETTER_AUTH_URL` to the exact local test origin and keep Google OAuth disabled. Verify target identity and grants, isolate the migration credential, then run controlled inbox and two-user tests. Grant scope must be reviewed against actual auth/project tables and exercised before use.

## Earlier Phase 02E connected verification (historical)

The dedicated Vastu Nord Neon development branch responds to connector SQL through a limited development migration role, but its Prisma auth tables have not been migrated: the local Prisma CLI still lacks a safe credential handoff and resolvable Neon endpoint. The owner approved Resend and added its three DNS records. Authoritative DNS matches Resend's values; Resend marks `vastu.no` Verified and sending Ready, and the free resource is connected to `vastunord-web` Development with a server-side API key. Nonsecret `AUTH_EMAIL_PROVIDER=resend` and `AUTH_EMAIL_FROM=no-reply@vastu.no` settings are also Development-only. No email delivery, signing secret or application runtime URL is verified. The owner reports creating the mailbox; its password is not a Resend API key, and the named `noreplyvastuno` variable was not listed in this project. Therefore registration, verification, sign-in, reset, logout/session expiry, protected-route behavior with a real session, and two-user project isolation are **NOT TESTED against cloud resources**. The unconfigured browser smoke test confirms the auth forms/private APIs remain closed; this is not a successful signup test. No test account or customer account was created. Google OAuth remains disabled.

The private Vercel Blob development store is empty and connected to `vastunord-web` Development with OIDC and no static token. No upload/download/ownership test occurred, and `MEDIA_UPLOADS_ENABLED` remains false. Current security gate: keep customer registration and media upload closed until migration, sender, scoped credentials, two-user authorization and retention tests pass.

## Current implementation and verification status

Better Auth 1.7.27 with its Prisma adapter is installed against Next.js 16.4.6 and Prisma 7.10.1. The generated Better Auth core models were reviewed and merged into the app schema: `User`, `Session`, `Account`, `Verification`, `RateLimit`. A versioned SQL migration is prepared but has not run. The `/api/auth/[...all]` handler fails closed with 503 until the app database, a signing secret of at least 32 characters and an approved email delivery configuration are present. No real account, session or email has been created in this task.

Configured behavior: password signup (minimum 12 characters), required email verification before email/password sign-in, sign-out, password reset with session revocation, short-lived verification/reset tokens managed by Better Auth, database-backed rate limiting, and same-origin request checks for project/account mutations. Google OAuth is present only when an explicit enable flag and a full Vastu Nord-owned client ID/secret pair are configured; implicit account linking is disabled and Google must report a verified email. OAuth callbacks, consent screen and emails are **unverified**. An optional Resend HTTP sender sends verification/reset links only when configured; presence of credentials is not proof of delivery. No secrets or tokens are logged by application code.

The web app checks a verified session and personal workspace on every Studio page before exposing account-backed content. Project/account API handlers check the session again, take the user ID only from the server session, restrict queries to the user's personal workspace, reject cross-origin writes and return 401/403/404/503 without private record details. The personal workspace model creates one owner membership transactionally. Project creation uses a per-workspace idempotency key; rename, description, archive, restore and confirmed soft deletion are implemented. Private asset listing is restricted to the owner and project; signed download still requires the owner and a configured private store. Public/gallery/social mutation routes remain absent. Isolated policy tests pass; real database transactions, session cookies, email links, OAuth and cross-user browser flows await an isolated live database and provider tests.

Account deletion is a **request**, not immediate erasure: the server records one timestamp and audit event, leaving media/retention review to a later approved workflow. Passwords are hashed by Better Auth; do not claim a particular hash was verified in this environment. A privacy notice appears in both languages, but production privacy terms and retention policy require founder/legal review before collecting customer data.

Owner setup and verification steps: [OWNER_CLOUD_SETUP.md](OWNER_CLOUD_SETUP.md).

Recommend Better Auth with Prisma adapter and DB sessions inside web, initially verified email/password. Founder approval and email provider setup needed. [Official adapter documentation source](https://github.com/better-auth/better-auth/blob/main/docs/content/docs/adapters/prisma.mdx) establishes the integration option, not installed compatibility or working login. Optional Google OAuth is deferred pending a Vastu Nord-owned client/consent screen/callbacks; no implicit linking by unverified email.

Payload staff identities are separate from customers; editor/reviewer/admin access, strong authentication and MFA-capable staff access must be implemented and verified before launch.

Every server query/mutation checks session and membership; middleware alone is insufficient. Proposed roles: owner (membership/billing), member (project edits), viewer (authorized reads). No role implies publication consent. Workers use fixed authorized job records; CMS gets scoped derivative grants, never unrestricted originals.

Use secure HTTP-only SameSite cookies, rotation/expiry, library password hashing and single-use recovery tokens, rate limits and origin/CSRF validation. Allowlist redirect destinations. Log out/revoke sessions server-side.

## Private media and publication

Recommend Vercel private Blob through an adapter. Issue short-lived exact-path upload grants after authorization; verify actual content/size/checksum and quarantine until decoder/magic-byte checks and appropriate scanning. Do not trust file extensions. Enforce quotas, allowlisted provider download hosts and bounded responses to prevent SSRF.

Downloads require permission then short-lived scoped access or authenticated streaming. Verify SDK grant/expiry capability during integration; do not assume S3 semantics. Never expose store-wide tokens. [Private Blob documentation](https://vercel.com/docs/vercel-blob/private-storage) is the reference.

Originals remain private. Publish only sanitized derivatives with active per-version gallery consent plus editorial approval; social requires separate destination consent. Recheck at delivery and invalidate caches on withdrawal. Existing expiring URLs may remain valid until TTL; choose a short bound and disclose it. External posts require manual takedown tracking.

## Acceptance requirements

Secrets never enter Git, logs or NEXT_PUBLIC_* variables. Credentials separate per environment/resource. Redact prompts, media, signed URLs and tokens. Apply CSP, sanitization, upload defenses and dependency/secret scanning.

Test cross-user reads/writes/downloads, role escalation, CSRF, session/logout/recovery replay, OAuth linking if enabled, share expiry/revocation, malicious files, SSRF, prompt injection, consent races and log redaction. Founder must approve privacy terms, data retention, subprocessors and region before real personal-data collection. No legal-compliance certification is claimed.
