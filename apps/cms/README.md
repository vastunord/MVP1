# Vastu Nord editorial CMS

This separate Next.js application hosts Payload 3.94.1 at `/admin`. Staff draft both Norwegian and English editions, including the cover description and an editorial source and rights note. A publisher submits a recorded rights check before publishing a reviewed draft. Withdrawing a published article removes it from the public reader. Staff identities and version history stay in the CMS.

## Local verification

From the repository root, run `pnpm install --frozen-lockfile`, then `pnpm --filter @vastunord/cms typecheck`, `pnpm --filter @vastunord/cms test` and `pnpm --filter @vastunord/cms test:editorial`. The editorial test applies the initial CMS migration to disposable embedded PostgreSQL, creates synthetic staff and verifies the bilingual publication and withdrawal lifecycle. It uses a loopback socket and discards its database on completion.

## Dedicated environment

Set these server-side variables in the separate Vastu Nord CMS project before building or serving it.

| Variable | Purpose |
| --- | --- |
| `VASTUNORD_CMS_DATABASE_URL` | TLS connection to the dedicated `vastunord_cms` database as `vastunord_cms_runtime`. |
| `VASTUNORD_CMS_DATABASE_HOST` | Exact Neon endpoint hostname for this CMS environment. The migration helper derives its direct hostname from a pooled endpoint. |
| `VASTUNORD_CMS_SECRET` | Unique random Payload signing secret of at least 32 bytes. |

Provision and verify a CMS database, least-privileged runtime role and protected independent deployment before enabling this in an environment. Give the runtime its required table/sequence DML and schema usage. Grant migration-only DDL to a separate role. Keep web application and CMS identities, credentials and databases separate.

Use the migration runner in a restricted operator process. Supply `VASTUNORD_CMS_MIGRATION_DATABASE_URL` for the direct endpoint as `vastunord_cms_migrator`, alongside the CMS secret and expected hostname. Inspect `src/migrations`, establish a recovery point and run `pnpm --filter @vastunord/cms cms:migrations migrate:status` before a separately authorized `cms:migrations migrate`. The adapter disables schema push and automatic database creation. Development, test and production migrations need their own targets and approval.

Bootstrap the first administrator once in a single protected operator session. Supply the normal CMS runtime configuration and temporary `VASTUNORD_CMS_BOOTSTRAP_EMAIL` and `VASTUNORD_CMS_BOOTSTRAP_PASSWORD` (at least 20 characters) through the operator's secret store and run `pnpm --filter @vastunord/cms cms:first-admin`. Remove those bootstrap variables from the operator session afterward. Further staff accounts require an authenticated administrator. Staff recovery email needs a separately verified sender.

## Publication

The public index at `GET /published?locale=nb&page=1` lists published summaries in pages of 24. The public reader serves `GET /published/{slug}?locale=nb` and `?locale=en`. Only its published projection includes the title, summary, body and cover with localized alternative text. The general articles, staff and version REST routes require authenticated editorial access. Linking a deployed CMS to the Knowledge Hub requires a verified CMS origin and live publication and withdrawal checks.
