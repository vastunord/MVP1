# Maya 7 verification — 27 November 2026

These results use synthetic local data and controlled provider responses. They do not establish live Preview behavior or provider image quality.

| ID | Status | Evidence and remaining work |
|---|---|---|
| MAYA-C01 | PARTIAL | Existing definitions supply 17 tool identities, operation/experience mapping, options and bounds; server rejects unknown fields, malformed selections and unsupported manual modes. Complete explicit control-by-control native/prompt/unavailable validation and compatibility review. |
| MAYA-C02 | PARTIAL | Fixture tests cover validated style prompt guidance, normalization of Auto and an English/Norwegian empty-furnishing conflict. Full conflict and locale-independent mapping coverage remains. |
| MAYA-C03 | PARTIAL | Nullable versioned JSON snapshot is created before provider submission and returned by owned history; isolated PostgreSQL fixture verifies save/read and same-job retry. Legacy jobs show a missing-snapshot notice. No cloud migration or live reopen; historical settings display is read-only, not an editable restored configuration. |
| MAYA-C04 | VERIFIED_LOCAL | Existing isolated job fixture covers owned inputs, ambiguous submission and storage recovery, and terminal states; previous browser fixture covered confirmed same-job recovery. No additional live provider test. |
| MAYA-C05 | PARTIAL | Room advanced groups have a changed-setting count and summary, section/tool reset and prompt undo. Full per-tool controls, localized values, conflict announcements and focus acceptance remain. |
| MAYA-C06 | PARTIAL | A controlled component browser fixture passed account, project, tool and reload switching without a write or render request. Session keys scope draft settings to account/project/tool, and sign-out clears them. Uploaded source/reference restoration, expired-session handling and full cross-tab/stale-response tests remain. |
| MAYA-C07 | PARTIAL | Local browser checks passed at 390, 768, 1280 and 1440px with both languages and both themes represented. Screenshots are in `docs/evidence/maya-local/`; a reset-control overlap seen at 390px was corrected and a horizontal clearance check passed in the sampled view. Arbitrary scroll positions, all locale/theme combinations, screen readers and physical devices remain unverified. |
| MAYA-C08 | PARTIAL | Local unit suite: 66 passed. The 164-test shared browser regression passed on the prior built candidate; the final Webpack build passed after read-only settings and mobile reset refinements. A targeted final browser recheck covers those layout refinements. Full Maya acceptance and live gates are not complete. |

The additive migration `20261127_maya_submission_settings` has only been run in disposable local fixtures. Existing Preview/Development databases require a separately reviewed and authorized migration before this candidate can use Studio rendering; do not deploy it there first. No paid render, production change, push or deployment occurred.
