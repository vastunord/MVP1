# Deployment and operations plan — not provisioned

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
