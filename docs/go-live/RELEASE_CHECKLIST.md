# Commercial launch checklist

## Local remediation candidate — not approved for release

Local integration checkpoint: `a1d7c16dd73d8ce86899fb580181f4cbbaa187ed` on `feat/v7-brand-photo-entry` (record a new full SHA if source changes). An isolated Git archive of that commit installed the locked dependencies from cache with `--offline --frozen-lockfile` and passed the Webpack build; this is archive reproducibility, not proof that a remote checkout exists. The protected Preview remains the older `a048c9d` diagnostic deployment; none of the later local fixes is represented as deployed. An authorized remote publication and target-specific deployment decision remain required. No migration or paid generation was introduced by the current local UI/test increments; verify configuration and migration history again for the selected target before release.

Local evidence at this checkpoint includes 61 unit tests, TypeScript, ESLint, Prisma schema validation, a Webpack build, 83 smoke tests, isolated database tests and controlled browser fixtures. These do not establish live saved-render attachment or Google account linking. Commercial hosting eligibility, production database/authentication/private-media verification, matching approved hero and Figma evidence, asset rights, legal review and the exact artifact access checks remain open. Billing stays deferred. See the criterion-level [remediation tracker](../AUDIT_REMEDIATION_TRACKER.md) and [owner actions](../BLOCKERS_AND_OWNER_ACTIONS.md).

When a specific target and release are authorized, record the tested full SHA and environment, verify its closed feature gates, deploy that exact artifact, and smoke-test it. If verification fails, restore the previously verified deployment using the platform's deployment rollback for that same Vastu Nord project; do not reset databases or switch to Development credentials. Do not promote this draft to a commercial release while the listed gates are open.

The existing Vercel site is a noncommercial demonstration. Development has passed signup, email verification, sign-in with the original password, project persistence, two-user isolation and private Blob tests. All 17 Studio editors are available for demonstration. The steps below cover the work between that baseline and a commercial release. Record the release commit and dated evidence for each enabled feature in the [release state](GO_LIVE_STATE.md).

The [five-item owner checklist](../OWNER_ACTIONS_ONE_LIST.md) records the current external dependencies.

## Current launch decisions and engineering evidence

| Area | Current position | What closes it |
|---|---|---|
| Business hosting | Owner intends to open registration and payments later. Vercel restricts Hobby to personal, noncommercial use, including before charging users. | Owner selects commercial-eligible hosting and a spending limit before business use. [Vercel terms](https://vercel.com/legal/terms#4-hobby-plan) |
| Visitor experience | The photo changes at the divider edge. The Possibility links to Studio, the four subsequent numbered sections have been removed and 12 bilingual FAQs have individual photographs. Galleries hand off the selected photo to any of the 17 editors. | Final visual sign-off and commercial-use clearance for the chosen media and fonts. |
| Knowledge Hub | Five existing guides plus 500 illustrated bilingual studies, each tied to a different Vastu Nord Visuals photograph. A separate Payload service supports staff roles, reviewed publication and withdrawal. | Commercial editorial clearance and a dedicated CMS database, host and administrator. [Study source register](../KNOWLEDGE_STUDY_IMAGES.csv) |
| Search discovery | Both languages have canonical links and alternates. The protected test site renders a bilingual sitemap and blocks indexing. The Production demo keeps its sitemap closed. | Verify translations, images and editorial approval on the public alias, then enable indexing on an eligible commercial release. |
| Prana | Groq handles short, scoped consultation and room-brief suggestions. The official YouTube channel feed supplies Prana Film. | English consultation, Norwegian prompt improvement and polite redirects passed on protected Preview. Publish an embeddable first film. |
| Studio provider | Private MNML rendering uses provider-managed limits, scoped project authorization and an idempotent job. | Verify the two reviewed migrations, role grants and one complete provider job on the isolated target. |
| Customer operations | Production sign-in origin configured. Development account, email and private storage journeys previously passed. Newsletter opt-in and withdrawal exercised against isolated PostgreSQL. | Protected Production migration and restore rehearsal, synthetic account/media/email tests, approved lead collection and operational monitoring. |
| Public gallery, social and payments | The visitor gallery is live on the protected test site. Publishing customer images requires version-specific consent, rights and editorial review. Payments remain deferred by the founder. | Verify consent withdrawal, human moderation and external removals before any social distribution. Reserve checkout for its separately approved phase. |

All activation and procurement decisions are collected in [owner actions](../OWNER_ACTIONS_ONE_LIST.md).

## Before the first commercial page goes live

- [ ] **Founder — choose the first release.** Identify which pages and customer journeys will open, the business contact responsible for them, and the maximum hosting/provider spend. The assigned Vercel address can remain the canonical address. A custom domain requires separate DNS approval.
- [ ] **Founder and release lead — change hosting eligibility.** Move the Vastu Nord team to a commercial-eligible plan before business promotion or customer acquisition, enable spend alerts and confirm the existing project still belongs to that team. Keep future customer billing separate from the hosting purchase. [Vercel commercial-use policy](https://vercel.com/docs/limits/fair-use-guidelines#commercial-usage)
- [ ] **Design and editorial — clear what visitors will see.** Compare the released Norwegian and English routes with approved full-size Figma exports at desktop, tablet and phone widths. Close broken destinations or remove their links, verify each CTA end to end, and secure commercial-use rights for the actual photos, before/after pairs, typefaces and films used. Remove unsupported prices, testimonials and product claims. [Figma route matrix](../FIGMA_TO_ROUTE_MATRIX.md)
- [ ] **Business and privacy owner — approve public information and data handling.** Publish accurate operator/contact, privacy and applicable service terms in both languages. Review processors, transfers, retention, erasure requests and incident contacts for each feature collecting data. Test that optional tracking waits for consent and visitors can refuse or withdraw it using the cookie control. [Datatilsynet cookie guidance](https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/)
- [ ] **Engineering and release lead — qualify the release.** Run the checks below against the release candidate. Verify keyboard, screen reader, reduced motion, theme contrast, mobile performance, canonical URLs, language alternates, sitemap and crawl rules. Probe disabled endpoints anonymously. Assign monitoring and support owners, test uptime and error alerts, check redacted logs, and rehearse restoring the previous compatible deployment. Record the approved feature flags and verify them again on the public alias.

## Before opening accounts, projects or private photos

1. **Database and operations.** Replace the temporary Development owner connection with a restricted runtime account. Supply the separate restricted Production runtime connection to Vercel, verify its database, branch and role from the actual runtime, and keep migration secrets outside the app. Establish a protected Production migration runner, agree backup retention and recovery targets, and demonstrate recovery to an isolated database. The earlier development clone proves cloning only. Obtain approval for reviewed Production migrations, verify their history and schema, and test scoped access. Preview is optional and requires a verified separate mapping if used. [Environment inventory](../ENVIRONMENT_VARIABLE_INVENTORY.md)
2. **Accounts and projects.** Set Better Auth's canonical HTTPS origin. With controlled inboxes and separately authorized Production credentials, verify signup, actual Resend delivery in both languages, verification, sign-in, logout, recovery, token expiry and session invalidation. Demonstrate project creation, rename, archive, restore and deletion. Prove anonymous and cross-user requests cannot list or change another customer's records. Open registration only after these checks pass. [Auth and security](../AUTH_AND_SECURITY.md)
3. **Private media.** Verify Production Blob identity and server access, scoped upload, file type/size validation, private retrieval after sign-in, two-user denial and deletion with synthetic images. Configure protected reconciliation, test partial upload failures and orphan cleanup, and verify retention and retrieval after recovery. Enable uploads only after the database and account gates pass. [Owner setup](../OWNER_CLOUD_SETUP.md)

## Before advertising each additional capability

| Capability | Remaining work and acceptance evidence |
|---|---|
| Real Studio rendering | Approve provider, models, data-processing terms and spend limits. Start with one image tool, then qualify each advertised tool against representative inputs. Verify private inputs/outputs, durable jobs, quotas, timeout, retry, cancellation, duplicate requests and cost alerts. Verify supported video workflows separately. [AI and workers](../AI_AND_WORKERS.md) |
| Newsletter | Validate the reviewed newsletter migration, signing secret and delivery to controlled Development inboxes. Add and verify authorized Production support, including consent records, confirmation, rate limits, unsubscribe and suppression. Enable collection after the hosting and privacy gates pass. [Newsletter records](../COOKIE_NEWSLETTER_INTERACTION.md) |
| Editorial content, public gallery and social | Implement Payload editorial roles, drafts and publishing for the Knowledge Hub where included. Verify per-asset commercial rights, opt-in, editorial approval and withdrawal. Require independent consent for each social destination and test the manual process before featuring it publicly. [Content and consent](../CONTENT_AND_CONSENT.md) |
| Prana | Review Quick Tips and secure rights to the selected films. Before opening consultation, verify the approved model, budget, privacy handling and failure states. Publish only the tabs with approved, working content. |
| Payments | Deferred to a separate owner-approved phase. Before charging, approve prices, taxes, customer terms and refunds, then test payment, authenticated webhooks, idempotency, cancellation, receipts and reconciliation. A free commercial release can precede checkout. |

## Routine demo and release checks

1. Confirm the checkout, Git remote, Vastu Nord Vercel scope and linked `vastunord-web` project. Stage tracked application sources from the tested commit.
2. Check wordmark proportions, palette, upright/italic font delivery, English/Norwegian controls, both themes, keyboard navigation and Prana entry.
3. Check the homepage and editor handoff at 390, 768, 1280 and 1440 px. Inspect image decode, page overflow, the comparison slider, selected sample and localised navigation.
4. Run TypeScript, lint, unit tests, the release build, browser tests and documentation checks. Verify file signatures, rights and manifest counts when images change.
5. On the public alias, confirm the release identity and recheck the guest journey, all editor routes, closed private endpoints and actual rendered fonts. Record the differences from the previous release.
6. Keep uploads, registration, generation, commercial lead collection, payments and external publishing closed until their individual public-release gates pass. A full commercial launch needs an eligible plan and verified Production dependencies.

[Release state](GO_LIVE_STATE.md) · [Current visual evidence](../evidence/v7-windowed-studio/README.md) · [Environment inventory](../ENVIRONMENT_VARIABLE_INVENTORY.md)
