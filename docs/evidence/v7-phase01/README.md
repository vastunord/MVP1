# Phase 01 homepage and visitor controls

## Previous release

Application commit `a550e02` introduced the full-width, same-room lighting study and the global branded header. These public screenshots were captured before the Phase 01 visitor controls.

| Mobile | Tablet | Desktop | Wide desktop |
|---|---|---|---|
| [390 px](../v7-brand-entry/after-390-light.webp) | [768 px](../v7-brand-entry/after-768-light.webp) | [1280 px](../v7-brand-entry/after-1280-light.webp) | [1440 px](../v7-brand-entry/after-1440-light.webp) |

The approved source photograph and evening treatment show the same furnished living room from the same viewpoint. The 723-entry [Visuals manifest](../../VISUALS_ASSET_MANIFEST.csv) records no rights-cleared, verified empty-to-furnished pair. The [asset request](../../OWNER_ACTIONS_ONE_LIST.md) specifies the required matching frames.

## Local release build

Edge inspected Norwegian/light and English/dark at 390, 768, 1280 and 1440 CSS pixels. Every hero image decoded at the full viewport width. The font renderer reported Zalando Sans Expanded for the headline. Both direct view buttons and the slider worked, including a touch tap at mobile width. Selecting a whole image updated the slider value and returning to comparison restored the split.

At 390 and 1440 px, the browser kept the newsletter paused while consent was unresolved and while Prana was open. It advanced the 27-second foreground delay with a test clock, dismissed the invitation and reopened it from the fixed left dock. Reload, route changes, scrolling and switching to Norwegian preserved its state. A 390 × 510 viewport check kept the dialog and its close control reachable. The demo showed unchecked marketing consent and an unavailable submission action. No email address was submitted.

## Live release

The same browser checks passed on the [public demo](https://vastunord-web.vercel.app/) from application commit `5d3dcc5`, deployment `dpl_J6erWY7u52BMMHTC2xLQ8xqBXkqj`. All 17 screenshots below show the deployed site at a viewport height of 900 CSS pixels. No uncaught browser exception occurred in these journeys.

| Width | Norwegian · light | English · dark |
|---|---|---|
| 390 px | [Mobile homepage](home-390-light.webp) | [Mobile homepage](home-390-dark.webp) |
| 768 px | [Tablet homepage](home-768-light.webp) | [Tablet homepage](home-768-dark.webp) |
| 1280 px | [Desktop homepage](home-1280-light.webp) | [Desktop homepage](home-1280-dark.webp) |
| 1440 px | [Wide homepage](home-1440-light.webp) | [Wide homepage](home-1440-dark.webp) |

| Interaction | 390 px | 1440 px |
|---|---|---|
| First visit with unresolved cookie choices | [Mobile notice](first-visit-390.webp) | [Desktop notice](first-visit-1440.webp) |
| Newsletter after eligible time | [Mobile invitation](newsletter-390.webp) | [Desktop invitation](newsletter-1440.webp) |
| Dismissed newsletter and Prana during scrolling | [Mobile docks](docks-scrolled-390.webp) | [Desktop docks](docks-scrolled-1440.webp) |
| Prana open on the keyboard-selected Quick Tips tab | [Mobile panel](prana-tips-390.webp) | [Desktop panel](prana-tips-1440.webp) |

The [cookie preference center](cookie-settings-1440.webp) opened with both optional choices off. Opening Prana preserved the unresolved cookie notice. After the newsletter was dismissed, both launchers kept their viewport positions on scroll, the left tab reopened the dialog, and Escape returned focus to its launcher. The newsletter tab stayed off the Studio library; its 17 configured tool cards remained available.
