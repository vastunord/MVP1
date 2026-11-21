# PHASE 07 — Wallet, pricing, credits, subscriptions and payment contracts

> **v3.3 GREENFIELD RULE:** Original developer source and hosting are unavailable. This task operates ONLY on the NEW Vastu Nord-owned repository and cloud environments. The three old URLs are design references, not implementation sources. See `docs/GREENFIELD_OVERRIDE.md`. Do not inspect or require old-team Git/Vercel credentials. Preserve recorded PROJECT_STATE; never touch NRide.

**Operating rule:** Follow root `AGENTS.md`. At start read `docs/PROJECT_STATE.md`, relevant canonical documents and this task ONLY. If prerequisite not satisfied, document blocker and implement only safe independent work. Do not rescan the full repo or repeat earlier prompts. Save decisions/progress to Git and run appropriate tests. Work on a feature branch, no production writes, no external Codex/MCP plugins.

## Preconditions
Provider cost structure known; transactional DB/schema; sandbox payment access.

## What to build / inspect
Implement an append-only internal credit ledger with grants (subscription, top-up, bonus), reservations, consumption, release, correction, expiry and audit reconciliation. Price actual image and video tool operations in server-authorized policies, calculate available balances transactionally, prevent concurrent double-spending. Expose wallet history, plans, monthly/yearly offers, invoice/receipt UI and usage graph. Integrate payment provider sandbox and verified signed webhooks; do not activate live billing without owner approval. Handle refunds, chargebacks, subscription renewal/cancel, expired credits and retried callbacks. Keep price/renewal conditions consistent with public copy.

## Required Markdown updates
docs/DATA_AND_API_CONTRACTS.md, docs/FEATURE_REGISTRY.md, docs/INTEGRATIONS_AND_ACCESS.md, docs/PROJECT_STATE.md

## Exit / acceptance criteria
Concurrency, webhook dedupe, refund and reconciliation tests; no live charge without approval.

## End-of-phase response
State completed scope, actual changed files, tests run/results, missing credentials/asset decisions, feature status, branch/commit and exact next prompt. Do not overclaim success.
