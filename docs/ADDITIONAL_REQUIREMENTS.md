# Additional requirements identified beyond the latest user request

These are recommendations extracted from the original master and engineering/security concerns, not claims that the website has these capabilities today.

| Area | Additional requirement | Reason / priority |
|---|---|---|
| Onboarding | Email verification, password reset, abuse protection and admin MFA | Account security — critical |
| Personal data | Export, deletion, retention policy, separate data processors, consent logs | GDPR readiness — critical |
| Image uploads | Signed URLs, file validation, thumbnail variants, EXIF stripping, moderation | Private home-photo security — critical |
| Studio UX | Job cancellation/recovery, version history, robust mobile before/after, resume after refresh | Trust and reliability — high |
| AI job control | Durable queue, retries, timeouts, provider failover, cost limits, audit | Operational viability — critical |
| Model capabilities | Verify exact image/video APIs, licensing, cost, available regions | No fake production functionality — critical |
| Credits/billing | Atomic reservations, duplicate webhook defense, refunds, chargebacks, invoices and pricing consistency | Financial integrity — critical |
| Publishing | User-level rights declaration, separate channel consents, editorial review, revoke/takedown tracking | Rights and trust — critical |
| Asset attribution | Consent to publish **display name** and preview bottom-right watermark | Avoid inadvertent identity disclosure — critical |
| Gallery | Search, filter, reports, abuse moderation, canonical URL, accessible alt text | Discoverability and support — high |
| Content | Editorial approval, source references, fact-check limits, original copy, refresh timestamps | Knowledge credibility — high |
| Social posting | Brand poster templates, queued scheduled posts, per-channel quotas and tokens, status/retry logs | Reliable automation — high |
| Product analytics | Activation, generation cost, accepted outputs, publication opt-ins and conversion | Operating insight — medium |
| Support | Help center, contact escalation, content-report mechanism and incidents | Customer trust — high |
| Operations | Daily spend alert, backup/restore drills, error monitoring, CI, rollback | Sustainable launch — critical |
| Platform separation | Independent company project/DB/CMS/buckets/logs/secrets under parent billing | Other startup safety — critical |
| Commercial policy | AI disclosure, copyright, customer rights, VAT review, subscription cancellation | Prelaunch readiness — high |
