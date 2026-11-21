# Quality, release and acceptance gates

## Core end-to-end tests

- User A/B signup, email verification/reset, Google OAuth callback when configured, and private workspace permissions.
- Upload, file validation, media source lineage, signed URL expiration, delete/export workflow.
- Real authorized image generation and real authorized video generation for each tool marked enabled; job retries and recovery.
- Before/after, versioning, favorites, exports, responsive Studio, no controls dead on mobile.
- Credit quote, parallel reservation, consumption/release/refund, duplicate payment webhooks and ledger reconciliation.
- Private by default; no listing/index of private asset; gallery opt-in; separate Pinterest/YouTube opt-in; chosen pseudonym watermark; human editorial approval; withdrawal/takedown reconciliation.
- AI knowledge articles never posted before review; only consented assets included.
- Prana's consultation/tips/film tabs and citations; project data not leaked across user accounts.
- `nb-NO` and `en` route, top-right locale toggle, light/dark/system theme and persisted preferences.
- Accessibility WCAG 2.2 AA as applicable, Core Web Vitals, reduced-motion, media controls, loading progress honesty.
- Security: CSRF, SSRF (if remote URLs), OAuth state/PKCE where supported, XSS, rate limiting, prompt injection, content moderation, EXIF, secrets, user deletion and audit logs.
- Deployment isolation: new Vercel/Neon/CMS/bucket identities; no other brand secrets or data accessible.

## Definition of done

Mark `VERIFIED` only with evidence from a working authorized environment and exact test commands/results. If credentials or deployment is missing, mark `BLOCKED`; if UI behavior is mocked, label `DEMO ONLY`. Keep stable CI, rollback and safe staging. No production publishing/billing/domain modifications without owner authorization.
