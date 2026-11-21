# Deployment and operations plan — Phase 02E resource status

The Vastu Nord Neon development branch and private Frankfurt Blob development store are provisioned, but the Vercel web project is not. A link-only create request for `vastunord-web` under Vastu Nord team `team_XXq1MkmBmNipFuTqB7Ozv6GV`, GitHub `vastunord/MVP1`, root `apps/web`, `deploy:false` returned HTTP 403 (permission denied). No local Vercel CLI fallback is installed. The private store is not connected and no environment variables were set remotely. No preview or production deployment, DNS change or push occurred.

The team currently has a Hobby plan. The owner requested setup there and plans a paid subscription after go-live; [Vercel's Hobby policy](https://vercel.com/docs/plans/hobby) restricts commercial use, so a business launch requires a commercial-eligible plan **before** go-live. Project-create permission and plan decision are owner actions. The local webpack production build and unconfigured browser smoke tests pass; they do not establish preview readiness with live auth/storage.

## Phase 02C readiness checklist

`apps/web/vercel.json` declares the Next.js framework. `apps/web/.env.example` documents `APP_ENV`, pooled `DATABASE_URL`, migration-only `DIRECT_DATABASE_URL`, private Blob store ID and server-only token, with `MEDIA_UPLOADS_ENABLED=false`. Configuration rejects a Vercel environment mismatch and refuses uploads until all required dedicated resources are present. Use separate Vastu Nord Vercel preview/production projects or environment scopes, separate Neon branches/roles and separate private Blob stores; never copy production credentials into previews. Verify the signed-in vendor account belongs to Vastu Nord before provisioning or linking. No Vercel project link, Neon instance or Blob store was created in this phase.

Before any authorized deployment: verify account/project IDs and region; confirm private store access; provide scoped server secrets in the matching Vercel environment; run reviewed migration against an isolated development/preview database first; run the complete CI checks; verify ownership and signed URL expiry with synthetic media; test migration rollback compatibility and an isolated restore; review cost/retention limits; only then enable uploads. Production deployment, DNS and auto-deploy linkage require separate owner approval. Roll back application to the previous compatible deployment if needed; do not destructively roll back the schema, and use a forward migration for data repair.

Propose vastunord-web and vastunord-cms Vercel projects for apps/web and apps/cms. Names are proposals; IDs/accounts/regions unknown. Dedicated Vastu Nord Neon app/CMS projects and roles, isolated private stores and API credentials; never NRide or existing reference deployments. No global credential changes.

Separate production/nonproduction settings and data. Preview builds must not inherit production customer data, live billing or paid AI. Region chosen after residency/capability review. Owner must authorize Git auto-deploy linkage, previews and production independently of this planning task.

Later CI: locked dependency install, lint/typecheck, focused tests, secret scan and build. Serialize reviewed migrations after backup checks; deploy compatible code, smoke-test and keep rollback artifact. Prefer forward DB repair over destructive resets.

## Resource and cost readiness

[INTEGRATIONS_AND_ACCESS.md](INTEGRATIONS_AND_ACCESS.md) is the canonical provider/account/env/cost/permission/test/owner matrix. No new services are configured. Eventual resources: two Vercel projects, two Neon projects, private app and separate CMS media, approved Azure AI endpoints, email sender, billing sandbox. No Postiz, separate vector DB, Redis or worker fleet.

Monthly cost model (not a quote): hosting seats/base + compute/workflow usage + app/CMS DB compute/storage/retention + media GB-month/egress + image attempts × model rate + video seconds × model rate + chat tokens + emails + payment processing + backup/log retention. Failed/retried provider attempts may cost money even if credits are released. Codex subscription does not pay runtime API bills.

Founder inputs: active users, jobs/user, video seconds, output size/versions, retention, delivery traffic, staff seats and monthly budget. Obtain current rates for selected plans and calculate low/expected/high cases with an explicit contingency before activation; set alerts and application spend limits. No prototype prices or free-tier promise adopted.

## Monitoring, backups and incidents

Start with Vercel platform logs/metrics and structured redacted application audit events; no extra monitoring SaaS initially. Correlate request/job/provider IDs. Alert on job age, failed dispatch, provider costs, webhook backlog, wallet mismatch and delayed revocation. Avoid private content/URLs in logs.

Proposed RPO ≤24h/RTO ≤8h requires founder approval, appropriate Neon retention and encrypted media/manifests backups. Verify isolated restore of app/CMS records and bytes, ownership and balances before launch; reconcile external state before restarting jobs. Define rotation, incident owner, alert recipient and retention during setup. No backup or alert is yet working.
