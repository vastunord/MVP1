# PHASE 05 — Recreate Studio UI from OBSERVED `/app` interactions

**Effort: MEDIUM.** Reference: https://vastu-nord-design-prototype.vercel.app/app (visual, not code). Use all evidence captured in Phase 01; do not guess what tools exist.

1. Rebuild the Studio's observed navigation/tool categories, left/center/right panels or responsive equivalents, upload/preview/canvas, controls, prompt helper, tool thumbnails, project selection, results/history, compare, save and exported versions. Respect the approved brand and tool hierarchy.
2. Build a typed tool registry: exact observed label, category, icon/thumbnail rights, input schema, supported output, visible controls, status VERIFIED / IMPLEMENTING / BLOCKED / DEFERRED, backend operation mapping. Preserve observer evidence and all original tools in the **planned inventory**, even if some are deferred due to genuine AI provider limits.
3. Reuse single project/asset/job infrastructure for Studio and Quick Tools. Implement responsive mobile variant and keyboard/accessibility patterns. Give true loading/empty/error states, no dead buttons pretending to be functional.
4. Do not assert UI reconstruction proves working image generation. Real AI provider integration comes in Phase 06; unavailable actions clearly marked, not silently mocked.
5. Save screenshots and parity comparisons to `docs/VISUAL_PARITY_MATRIX.md`; document all unknown/unseen menu options as questions for the owner.

Update STUDIO_INVENTORY, FEATURE_REGISTRY, ASSET_MANIFEST, PROJECT_STATE and CHANGELOG; test observed controls and persistence. Don't modify old prototype sites.
