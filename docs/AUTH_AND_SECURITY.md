# Authentication and security — proposed

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
