# PHASE 06 — Real authorized image/video generation and durable jobs

> **v3.3 GREENFIELD RULE:** Original developer source and hosting are unavailable. This task operates ONLY on the NEW Vastu Nord-owned repository and cloud environments. The three old URLs are design references, not implementation sources. See `docs/GREENFIELD_OVERRIDE.md`. Do not inspect or require old-team Git/Vercel credentials. Preserve recorded PROJECT_STATE; never touch NRide.

**Operating rule:** Follow root `AGENTS.md`. At start read `docs/PROJECT_STATE.md`, relevant canonical documents and this task ONLY. If prerequisite not satisfied, document blocker and implement only safe independent work. Do not rescan the full repo or repeat earlier prompts. Save decisions/progress to Git and run appropriate tests. Work on a feature branch, no production writes, no external Codex/MCP plugins.

## Preconditions
Project storage+job schemas+capability matrices; model credentials authorization.

## What to build / inspect
Implement server-side provider adapters, compatibility/price registry, approved primary/backup routing, image/video generation through only permitted official models and endpoints. Design background job lifecycle, quote and reserve idempotency, retries/timeouts, cancellation limits, safe provider callbacks and status polling/SSE. Integrate actual image/video provider only when authorized and verified; test one real operation per enabled mode. Do not substitute generic text AI for missing video capability or install unauthorized plugins. Store all outputs private with provider metadata, costs, moderation results and lineage. On unsupported capabilities block visibly, document needed approval, and don't charge. Add provider outage and worker-crash test.

## Required Markdown updates
docs/AI_OPERATIONS.md, docs/INTEGRATIONS_AND_ACCESS.md, docs/FEATURE_REGISTRY.md, docs/PROJECT_STATE.md

## Exit / acceptance criteria
At least one image generation verified in configured environment; video each marked VERIFIED or clearly BLOCKED; no duplicate charges.

## End-of-phase response
State completed scope, actual changed files, tests run/results, missing credentials/asset decisions, feature status, branch/commit and exact next prompt. Do not overclaim success.
