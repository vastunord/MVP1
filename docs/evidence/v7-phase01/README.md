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
