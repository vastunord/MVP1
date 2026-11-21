# PHASE 13 — Hardening, legal readiness and end-to-end test coverage

> **v3.3 GREENFIELD RULE:** Original developer source and hosting are unavailable. This task operates ONLY on the NEW Vastu Nord-owned repository and cloud environments. The three old URLs are design references, not implementation sources. See `docs/GREENFIELD_OVERRIDE.md`. Do not inspect or require old-team Git/Vercel credentials. Preserve recorded PROJECT_STATE; never touch NRide.

**Operating rule:** Follow root `AGENTS.md`. At start read `docs/PROJECT_STATE.md`, relevant canonical documents and this task ONLY. If prerequisite not satisfied, document blocker and implement only safe independent work. Do not rescan the full repo or repeat earlier prompts. Save decisions/progress to Git and run appropriate tests. Work on a feature branch, no production writes, no external Codex/MCP plugins.

## Preconditions
Core flows and permissions implemented at least in staging.

## What to build / inspect
Run complete CI, typecheck, lint, unit, integration and E2E tests for signup, private uploads, AI jobs, refunds, publication consent, social failures, Payload approval, Prana and isolation. Check responsive mobile and keyboard/screen reader, WCAG 2.2 AA where applicable, Core Web Vitals and media responsiveness. Security audit for OAuth, broken access control, user-A/user-B leakage, API abuse/rate-limits, prompt injection, PII/EXIF, secret rotation, GDPR export/delete, third-party processor disclosures. Set error monitoring, job duration/cost and spend-alert dashboards. Verify robots/sitemaps/nb-NO & en hreflang, canonical tags, consent-based analytics. Record bugs and issue priorities; do not claim legal compliance without review.

## Required Markdown updates
docs/QUALITY_GATES.md, docs/FEATURE_REGISTRY.md, docs/RESOURCE_ISOLATION.md, docs/PROJECT_STATE.md, docs/CHANGELOG.md

## Exit / acceptance criteria
Critical defects resolved or launch blocked; tests listed accurately; privacy and security evidence recorded.

## End-of-phase response
State completed scope, actual changed files, tests run/results, missing credentials/asset decisions, feature status, branch/commit and exact next prompt. Do not overclaim success.
