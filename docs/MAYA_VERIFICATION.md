# Maya 7 verification — 27 November 2026

## 28 November · Designer Studio and independent workspace release

All 17 editors have reference captures. The local candidate adds bespoke forms, bounded controls, session-scoped placement and private-workspace return handling. See the [desktop comparisons](evidence/designer-parity/DESKTOP_COMPARISON.md) and [journey matrix](JOURNEY_PARITY_MATRIX.md). Provider accuracy, exact visual alignment and the Production private-render journey have separate acceptance gates.


28 November release continuation. Seventeen focused Maya draft and provider-contract tests passed across the 17 tool definitions. The Pool + Spa editor, draft reader and server now agree on the conditional Spillover spa selection. Switching to a mode that removes that choice resets the selection. Garden tidy mode now omits inactive style and area settings from the effective provider request while preserving the original user choices in the submission snapshot. Targeted ESLint passed. These results cover local settings and request construction. Release-origin rendering, post-login recovery and private download require independent verification.

The 28 November local webpack production build passed. All 16 targeted browser checks passed, including direct navigation to all 17 workflows, the conditional Pool + Spa reset, keyboard focus near the action dock, and the advanced panel at 390, 768, 1280 and 1440 pixels. The four screenshots in `docs/evidence/maya-local/` were refreshed. Two additional controlled browser checks passed for project-authorized source and reference recovery and account/project/tool-scoped drafts.

These results use synthetic local data and controlled provider responses. They do not establish live Preview behavior or provider image quality.

| ID | Status | Evidence and remaining work |
|---|---|---|
| MAYA-C01 | PARTIAL | Existing definitions supply 17 tool identities, operation/experience mapping, options and bounds; server rejects unknown fields, malformed selections and unsupported manual modes. Complete explicit control-by-control native/prompt/unavailable validation and compatibility review. |
| MAYA-C02 | PARTIAL | Fixture tests cover validated style prompt guidance, normalization of Auto and an English/Norwegian empty-furnishing conflict. Full conflict and locale-independent mapping coverage remains. |
| MAYA-C03 | PARTIAL | Nullable versioned JSON snapshot is created before provider submission and returned by owned history; isolated PostgreSQL fixture verifies save/read and same-job retry. Legacy jobs show a missing-snapshot notice. Preview migration and restricted runtime column permissions are verified; live reopen and release migration remain unverified. Historical settings display is read-only, not an editable restored configuration. |
| MAYA-C04 | VERIFIED_LOCAL | Existing isolated job fixture covers owned inputs, ambiguous submission and storage recovery, and terminal states; previous browser fixture covered confirmed same-job recovery. No additional live provider test. |
| MAYA-C05 | PARTIAL | Room advanced groups have a changed-setting count and summary, section/tool reset and prompt undo. Full per-tool controls, localized values, conflict announcements and focus acceptance remain. |
| MAYA-C06 | PARTIAL | Four controlled browser fixtures passed settings and source/reference recovery across reload, project/tool/account switches, a removed source, a delayed previous-project response and retention of a newly selected local image, without an upload or render request. IDs restore only after the authenticated project-asset list returns matching accessible images. Expired-session, full cross-tab and live Blob verification remain. |
| MAYA-C07 | PARTIAL | Local browser checks passed at 390, 768, 1280 and 1440px with both languages and both themes represented. Screenshots are in `docs/evidence/maya-local/`; a reset-control overlap seen at 390px was corrected and a horizontal clearance check passed in the sampled view. Arbitrary scroll positions, all locale/theme combinations, screen readers and physical devices remain unverified. |
| MAYA-C08 | PARTIAL | Local unit suite: 66 passed. The 164-test shared browser regression passed on the prior built candidate; the final Webpack build passed after read-only settings and mobile reset refinements. A targeted final browser recheck covers those layout refinements. Full Maya acceptance and live gates are not complete. |

Update: the additive migration `20261127_maya_submission_settings` was applied to Preview using the reviewed target-pinned Prisma procedure, with its checksum and runtime column permissions verified. The separate newsletter migration remains pending; runtime application save/read and release/Production migration remain unverified. No new paid render, production change, push or deployment occurred.
