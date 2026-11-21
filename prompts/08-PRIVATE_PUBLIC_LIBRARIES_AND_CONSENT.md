# PHASE 08 — Default-private gallery, public opt-in, moderation, withdrawal

> **v3.3 GREENFIELD RULE:** Original developer source and hosting are unavailable. This task operates ONLY on the NEW Vastu Nord-owned repository and cloud environments. The three old URLs are design references, not implementation sources. See `docs/GREENFIELD_OVERRIDE.md`. Do not inspect or require old-team Git/Vercel credentials. Preserve recorded PROJECT_STATE; never touch NRide.

**Operating rule:** Follow root `AGENTS.md`. At start read `docs/PROJECT_STATE.md`, relevant canonical documents and this task ONLY. If prerequisite not satisfied, document blocker and implement only safe independent work. Do not rescan the full repo or repeat earlier prompts. Save decisions/progress to Git and run appropriate tests. Work on a feature branch, no production writes, no external Codex/MCP plugins.

## Preconditions
Auth, asset ownership and rendering output storage validated.

## What to build / inspect
Deliver My Private Library, consent UX per generated asset, accessible public gallery and asset-specific editorial review. Consent must be separate for public gallery, Pinterest and YouTube with opt-in default OFF. Show exact media/metadata and optional public attribution pseudonym; watermark public derivative bottom-right only when chosen. Strip sensitive EXIF; assess faces/private addresses. Implement `ConsentGrant`, `PublicationRequest`, `ModerationDecision` and separate `ChannelPublication` records with proper state/history, owner revocation and internal public unpublish. Test owner A cannot publish B's render, and revocation changes public access. Do not post to external social yet.

## Required Markdown updates
docs/CONTENT_AND_CONSENT.md, docs/DATA_AND_API_CONTRACTS.md, docs/FEATURE_REGISTRY.md, docs/PROJECT_STATE.md

## Exit / acceptance criteria
Private-by-default invariant and per-channel consent tests; public listing contains only approved assets.

## End-of-phase response
State completed scope, actual changed files, tests run/results, missing credentials/asset decisions, feature status, branch/commit and exact next prompt. Do not overclaim success.
