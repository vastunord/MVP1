# Founder setup guide — Phase 02E status

## Phase 02E-2A final activation decision

Owner accepted the documented PostgreSQL PUBLIC CONNECT and TEMPORARY defaults. Subsequent read-only catalog checks on the Vastu Nord development branch discovered PUBLIC SELECT on `postgres.public.pg_stat_statements` and `postgres.public.pg_stat_statements_info`, reachable by the runtime role through the accepted database CONNECT and schema USAGE. No view contents were read. The owner instructed stopping on other unexpected privileges, so `vastunord_dev_runtime` remains NOLOGIN. Select an acceptable isolation approach or explicitly resolve this additional view access before role activation. Do not modify shared PUBLIC permissions or system databases without separate authorization. After resolution, establish a strong runtime password through a protected method, enable LOGIN and configure pooled `DATABASE_URL` in `vastunord-web` Development. No runtime password or URL exists yet.

## Phase 02E-2A completion status

The migration password was transferred into a Windows current-user DPAPI-protected, Git-ignored file at `credentials/vastunord-dev-migrator.dpapi`. The preserved helper via `scripts/run-development-migration.ps1 -VerifyOnly` successfully used it for read-only development identity and Prisma status before and after the Vercel Development variable was removed. `scripts/store-development-migration-credential.ps1` is a one-time importer that refuses overwrites. The file is bound to this Windows user profile. A lost profile requires an approved recovery process. The existing deploy helper retains its original initial-migration guards and requires review for future migrations. No migration ran.

The owner directed preservation of PUBLIC grants and stopping if effective permissions are broader than needed. Catalog checks found inherited CONNECT to `postgres` and `template1`, and TEMPORARY on `neondb`. The runtime role remains NOLOGIN and `DATABASE_URL` is absent. Review an isolation method that preserves PUBLIC or obtain a revised owner decision before enabling LOGIN, assigning a password and configuring the pooled URL. Better Auth secret, local origin and Resend configuration are present in Development.

## Phase 02E-2A current owner decisions

A development runtime role and table-specific grants now exist, but the role is `NOLOGIN` because default PUBLIC CONNECT applies to `postgres` and `template1` within the development branch. The owner was asked to pause the runtime password and `DATABASE_URL` setup. Work with Neon to establish an acceptable isolation method before enabling the role. Revoking PUBLIC on shared system databases may affect other roles and requires a separately reviewed plan and owner approval.

The owner chose to keep `VASTUNORD_DEV_MIGRATOR_PASSWORD` in the web project's Development environment for now. Any `vercel env run` app process inherits it, so application startup with real credentials remains blocked. Approve a restricted migration-only secret context and later removal/rotation if desired. The existing helper is preserved. `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` are now present only in Vercel Development. Resend settings are present, but no message has been sent.

## Phase 02E-2 owner setup needed

Neon development migrations are current, but `vastunord_dev_migrator` and the owner role are the only listed roles. Establish a separate limited development runtime login and grants for the auth and project tables. Grant no database or schema CREATE and no role administration. Add its pooled URL as `DATABASE_URL` in the Vastu Nord project's Development-only server-side configuration. Add a unique `BETTER_AUTH_SECRET` of at least 32 characters and `BETTER_AUTH_URL` for the exact local test origin. Never put secret values in chat or Git. Keep Google OAuth disabled.

The Vercel Development project currently provides `VASTUNORD_DEV_MIGRATOR_PASSWORD` to any process started with `vercel env run` for that project. Remove it from normal application runtime after securing a separate restricted migration-only handoff. Verify the runtime role, pooled endpoint and auth settings before real account testing. The owner provided controlled inboxes for later verification and recovery tests. No test messages were sent.

## Development migration completed

The two authorized migrations were applied to development using the Vastu Nord Vercel Development credential variable. History checksums match the tested files, Prisma status is up to date and the supported schema diff is empty. A synthetic test record was removed in the same transaction. A recovery clone was previously verified; full restore is still untested. Authentication, email and private media integration remain separate work.

## Development migration credential injection

The owner selected the Vercel Development variable `VASTUNORD_DEV_MIGRATOR_PASSWORD` in `vastu-nord/vastunord-web`. The isolated CLI can inject it into the pinned development migration helper without writing an environment file. A read-only preflight passed. The variable remains server-side and its value is not documented.

## Development migration prompt retry

The owner reported the first local prompt was not visible. A reopened window exited with code `-1073741510` without reporting success. A later read-only query still found zero public relations and no Prisma history. The development migration is blocked until a reliably visible masked prompt is available. Do not put the password in chat.

## Phase 02E-1G execution paused

The owner authorized the two development migrations. The masked local deployment prompt was opened, but remained unattended and was closed to avoid a later unexpected start. Development still has no public relations or Prisma history according to the subsequent read-only check. The next session needs the owner to enter the role password in the masked prompt. Recheck target, recovery availability, exact hashes, pending status and limited privileges immediately before the single deployment attempt. The previous authorization is for the two named development migrations.

## Phase 02E-1F development readiness

The masked direct Prisma connection and pending-migration status check passed on development. The migration checksums match the isolated test. The recovery clone test passed; full restore is untested. Authorize the two development migrations separately only when ready. A safe development-only deploy procedure must still be prepared and verified immediately before execution.

## Phase 02E-1E owner actions

Development is empty and the tested migration hashes match. Approve creation of a single disposable recovery-drill branch named `recovery-drill-phase02e1e`, parent `br-red-sunset-bhm6pga7`, with a small Free-plan read-write compute for read-only content verification. This verifies cloning only. A separate development direct-credential check and explicit development migration approval remain necessary. No branch may be reset or replaced as part of this drill.

## Isolated migration test completed

Both migrations passed on disposable test branch `br-lively-wildflower-bhwpjl4q`, with matching history checksums and no Prisma schema diff. One synthetic user was created and removed in a single transaction. The development migration and recovery restore remain separate actions requiring authorization. Retain the test and recovery branches until the owner decides otherwise.

## Test connection check

From the repository root run `pwsh -NoProfile -File scripts/prisma-test-connection.ps1` in a local terminal. In the Vastu Neon console select `migration-test-phase02e1d`, database `neondb` and role `vastunord_dev_migrator`. Enter only its password at the masked prompt. The helper pins the verified direct test endpoint and returns exit code 0 only if Prisma verifies the branch, endpoint, role, database and empty baseline. An empty password cancels. See the [test endpoint verification](DATABASE_ARCHITECTURE.md#test-endpoint-verification).

The local test completed successfully. Next, the owner may authorize applying the reviewed initial and auth/project migrations to `br-lively-wildflower-bhwpjl4q` only. The connection check contains only its fixed read-only query.

### Phase 02E-1D setup before compute provisioning

The owner approved test branch creation during this task. `migration-test-phase02e1d` now exists as `br-lively-wildflower-bhwpjl4q`, copied from recovery `br-red-sunset-bhm6pga7` at LSN `0/1B49CE0`. Fixed compute settings were rejected by the connector, so the created branch has no compute. Before testing, establish an authorized test compute with verified limits, and a direct test-specific credential handoff. The existing helper is pinned to development and is limited to status. It must not be used to deploy to the disposable branch. Local hidden credential entry remains required and has not happened. Obtain explicit migration execution and disposable recovery-test approval after connectivity is verified. No deletion is authorized.

### Phase 02E-1C immediate owner actions

The owner confirmed universal nonapplication, enabling the committed minimal SQL correction. A development recovery child `br-red-sunset-bhm6pga7` is ready without compute, preserving the source at LSN `0/1B49CE0`. Creation followed the owner's closing authorization checklist. Approve compute-backed content/restore verification and a separate disposable migration test branch before relying on recovery or claiming SQL composition passed. Preserve the recovery copy itself.

The interactive helper `scripts/prisma-development-status.ps1` accepts the limited role password through a hidden prompt, uses the fixed direct development endpoint and passes it in the child environment. Its syntax is validated, but the actual secret handoff and live connection remain untested. The owner must enter the credential locally in an appropriate interactive session. No secret should enter chat or tool arguments. Migration execution, any recovery replacement and any additional resource creation require separate approval. These current actions supersede the older checksum-confirmation and privilege-escalation proposals below.

### Phase 02E-1B owner decisions

Confirm whether any other environment has applied the original initial migration before editing its checksum. Authorize a development-only snapshot or backup branch and a restore verification when ready. Arrange a protected process-level handoff of the direct development migration URL without chat, command arguments or logs. The migration and any recovery replacement require their own explicit authorization. Database CREATE is not the default proposal.

### Development migration decision

Execution is blocked. To preserve both SQL files exactly, the owner must decide whether to authorize temporary database-level CREATE on development `neondb` for `vastunord_dev_migrator`, with revocation and verification on success or failure. This permits creation of additional schemas during the grant. Alternatively review a separate change to the unapplied initial SQL. Supply the direct limited-role URL through a protected migration process and establish a recoverable development point. Once these conditions are verified, request separate approval for Prisma to apply only `20261121_phase02c_initial` and `20261121_phase02d_auth_projects` in order.

The Vastu Nord Neon development branch, Git-linked Vercel web project and private development Blob store exist. Blob uses short-lived OIDC in Development; the verified Resend domain and API key are also connected to Development. A limited development migration role exists, but application runtime database/auth credentials are not configured. Complete remaining steps under **Vastu Nord's own vendor login**, not NRide or the Codex development account. Never paste secret values into Git, chat or command arguments.

## Phase 02E verified setup and immediate actions

| Resource | Verified state | Owner action |
|---|---|---|
| GitHub | `vastunord/MVP1`; local `origin` points there | None for this phase; do not push yet. |
| Neon app | Existing Vastu project `VNMVP1` (`morning-morning-84319525`) in `aws-eu-central-1`; isolated, nondefault `development` branch `br-mute-resonance-bhea4dyx` still has zero app tables and no Prisma history. Direct compute `ep-purple-fog-bhs946ij` has a resolvable address under an approved elevated read-only DNS check. Role `vastunord_dev_migrator` was rechecked as `neondb`/`public` with schema CREATE, no `neon_superuser` membership or database-wide CREATE. | Arrange an approved, non-logging secret handoff of the **development-only** credential to Prisma and verify direct (non-pooler) CLI connectivity. The connector's password-bearing URL was pooled and was not printed or used. Confirm a recovery point before `prisma migrate status` and `migrate deploy`. Create a separate runtime role/URL later; keep production untouched. |
| Vercel web | Team `team_XXq1MkmBmNipFuTqB7Ozv6GV`; project `vastunord-web` (`prj_LyZA1xMnM4efg5U8SIAfGD4GIDc0`) linked to `vastunord/MVP1`, root `apps/web`, Next.js, production branch `main`. Temporary build-ignore `exit 0`; deployment list empty. The connector returned 403, but the isolated Vastu Nord CLI succeeded. | Keep build-ignore in place until a separately approved preview/deployment and complete environment checks. |
| Private media | `vastunord-development-media` (`store_ejuJXLFGtH1tuh5b`), private, `fra1`, zero objects; CLI `storage status` confirms connection to `vastunord-web` **Development only** using OIDC, with `BLOB_STORE_ID` and `BLOB_WEBHOOK_PUBLIC_KEY` only in Development. No static Blob token exists. | Leave uploads disabled until database, auth and synthetic ownership/deletion tests pass. Add separate Preview/Production connections only in their approved phases. Google Drive is excluded. |
| Email | Owner approved Resend and accepted Marketplace terms. Free resource `resend-email-celeste-clock` (`ir_wZk3Y3lUDXamTWlV`) is connected to `vastunord-web` **Development only**. The owner added the records below at Domeneshop; authoritative DNS matched Resend, its domain/records show **Verified**, and the Vercel resource shows **Available**. Development has `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN`, `AUTH_EMAIL_PROVIDER=resend` and `AUTH_EMAIL_FROM=no-reply@vastu.no`; the API key was never read. | Provide controlled test inboxes and complete the separate development database/auth prerequisites before testing verification and recovery email. No delivery has been tested. The mailbox password under `noreplyvastuno` was not listed in this project and is not a Resend API key. |

### Resend sender DNS verification

The owner added these records at Domeneshop on 2026-11-21. Domeneshop's hostname field appends `.vastu.no`. Read-only queries to authoritative `ns1.hyp.net` returned the exact CNAME targets and a 218-character DKIM value identical to Resend's full Copy value. Resend marked all three records and the domain Verified, with sending Ready; the Vercel Marketplace resource reports Available. This confirms DNS ownership and provider readiness, not email delivery.

| Type | Domeneshop host field | Full DNS name | Value |
|---|---|---|---|
| TXT | `resend._domainkey` | `resend._domainkey.vastu.no` | Resend's 218-character `p=` DKIM public key |
| CNAME | `rsend` | `rsend.vastu.no` | `rsend-euw1.forge.rmta.net` |
| CNAME | `send` | `send.vastu.no` | `send.forge.rmta.net` |

The existing apex SPF TXT, `_dmarc` TXT, Domeneshop mail records, A records and nameservers were not edited by Codex. The earlier attempted Add action was rejected by automatic approval review; the owner subsequently entered the three records. Sender verification passed; actual delivery and account-link behavior remain untested.

The Vastu Nord Vercel team currently uses Hobby. [Vercel's Hobby terms](https://vercel.com/docs/plans/hobby) restrict it to personal, noncommercial use; the owner requested project setup there for now and plans to subscribe later. Move to a commercial-eligible plan **before business use**, not after go-live. No plan change or deployment was made here.

**Separate CLI:** Run `pwsh -NoProfile -File scripts/vercel-vastunord.ps1` from the repository to verify the current Vastu Nord identity, or append a read-only CLI command such as `project inspect vastunord-web`. The script pins the official CLI version, uses `.vercel-vastunord-cli/` (ignored by Git), explicitly scopes `vastu-nord`, rejects any other account/team and clears inherited Vercel token/project variables for its child commands. It does not alter an existing NRide CLI login. Never commit or share `.vercel-vastunord-cli/auth.json`. The CLI displayed a 2FA setup notice; the owner should enable account 2FA before production access.

**Database credential boundary:** The local network could not resolve the Neon endpoint in the restricted environment. Automatic approval review rejected a prior elevated migration-status command because it contained the privileged owner password in its command payload. It was not run or bypassed. The new scoped role was created through the Vastu Nord Neon connection; its password stayed out of tool output and the CLI. Do not run Prisma with the privileged owner URL. A supported secret handoff to the development process and verified DNS route remain prerequisites; do not paste a URL into chat or command arguments.

1. **Account and project identity.** The GitHub and Vercel account identities above are confirmed; the dedicated web project is linked. Keep Payload as a separate future project. Do not remove the temporary build-ignore rule or enable production auto-deployment without separate approval.
2. **Neon app database.** Reuse the dedicated Frankfurt app project and isolated development branch above. Keep the future Payload CMS database separate. The migration role exists; create a distinct runtime role. Supply pooled runtime `DATABASE_URL` and direct migration `DIRECT_DATABASE_URL` only to the matching Development environment through an approved secret-safe mechanism; never give the web app the CMS URL. Neither variable exists in local Process/User/Machine scope. A protected handoff to Prisma is still needed; do not paste the URL into a command or chat. The reviewed Prisma migrations are still unapplied.
3. **Vercel environment.** Set `APP_ENV` to `development`, `preview` or `production` matching Vercel's environment. Generate a unique random `BETTER_AUTH_SECRET` of at least 32 characters per environment. Set `BETTER_AUTH_URL` to the exact HTTPS production origin in Production; use the local origin for development, and verify preview callback/origin handling before enabling previews. Never prefix secrets with `NEXT_PUBLIC_`. Keep `MEDIA_UPLOADS_ENABLED=false` until private storage has passed its tests.
4. **Email delivery.** The free Resend integration is installed with a Development-only API key in Vercel; do not pull or print it. `vastu.no` is Verified in Resend. `AUTH_EMAIL_PROVIDER=resend` and `AUTH_EMAIL_FROM=no-reply@vastu.no` were added to Development only. A mailbox password under `noreplyvastuno` does not meet the API requirement. Send verification and reset messages to controlled inboxes after the development schema, runtime URL and signing secret exist; check link expiry, one-time use, failed delivery and password-reset session revocation. Auth remains closed until those dependencies and actual delivery pass. Production privacy/terms and retention text need approval before customer registration.
5. **Optional Google sign-in.** In a Vastu Nord-owned Google Cloud project, configure the OAuth consent screen and a web client. Register exact authorized origins and callbacks such as `<origin>/api/auth/callback/google` for each approved environment. Supply `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` together, server-side, only after consent-screen and account identity review. Keep `GOOGLE_OAUTH_ENABLED=false` until callback, verified-email, denied-consent and same-email account-link tests pass; then explicitly set it to `true` in the approved environment. Without the flag and both values, the Google button stays hidden.
6. **Private media.** The private Frankfurt Blob store is connected to Development with OIDC. The Blob SDK can use its short-lived `VERCEL_OIDC_TOKEN` and `BLOB_STORE_ID`; no static `BLOB_READ_WRITE_TOKEN` was created. Test signed upload/download/expiry/ownership with synthetic images after auth and migrations, and wire the missing upload route before enabling `MEDIA_UPLOADS_ENABLED=true`. The 727 Visuals files are unapproved and must not be uploaded or published.
7. **Acceptance checks.** With synthetic accounts on isolated resources, run signup → verification → sign-in → workspace → project create/rename/archive/restore/delete → sign-out/recovery; repeat with a second account and prove cross-user project/asset denial. Check DB role separation, audit events, rate limits, CSRF/origin protection, secret redaction and rollback. Only after these checks can authentication/persistence be called working in a connected environment.
