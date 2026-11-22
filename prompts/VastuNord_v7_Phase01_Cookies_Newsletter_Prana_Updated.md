# VASTU NORD — v7 PHASE 01 (CONSOLIDATED UPDATE)
## Final Header, Scandinavian Before/After Hero, Floating Prana, Cookie Consent & Newsletter Dock

**Run in the EXISTING Vastu Nord Codex repository.** This document supersedes the earlier standalone Phase 01 UI-polish prompt; it does not supersede the complete v7 go-live roadmap. **Do not rebuild the project or repeat completed phases.**

**Mode:** Implement and test in the existing Next.js application; do not stop at another analysis document.
**Reasoning:** High for design reconciliation and tricky overlay/state coordination; Medium for routine implementation; Low for documentation/test cleanup.
**Current demo:** https://vastunord-web.vercel.app/ (noncommercial Vercel Hobby test site).

## 1. Read narrowly scoped project context

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/FIGMA_TO_ROUTE_MATRIX.md`
- The most recent v7 design evidence and Phase 01 prompt
- Relevant existing header, homepage hero, theme/language, Prana, footer, consent, newsletter, Resend, and database source files
- Brand Guidelines PDF under the project's existing brand-assets location

Read other docs only to resolve a concrete conflict. Reuse past audits and the verified 17-tool matrix. Do not repeat the full reference-site audit.

## 2. Nonnegotiable design hierarchy

1. Finalized approved Figma marketing file: `https://www.figma.com/design/yLScUtnuv6HLK0NDL8I9WE/Finalised-Marketing-Website-Screens--Dev-?node-id=0-1`
2. Official 36-page Vastu Nord Brand Guidelines (logo treatments, colors, **Zalando Sans Expanded**, licensed font files and visual restrictions)
3. Current approved Vastu Nord designs and Studio tool inventory
4. Original Studio prototype `https://vastu-nord-design-prototype.vercel.app/app`
5. Recovered Vastu Nord interactive HTML demo for supplementary interaction patterns
6. `https://www.nride.no/` as a **behavioral comparison** for EN/NO, Light/Dark, consent, and newsletter UI; **do not** copy NRide branding, credentials, content, or data
7. `https://www.reimaginehome.ai/` as a user-journey reference only; no copying of its identity or proprietary visuals

If Figma assets are inaccessible, request approved exports *once*, use the verified approved assets already present, and record exact parity as unverified. Do not invent a replacement brand system.

## 3. Header and navigation (preserve what works)

- Keep the exact approved wordmark and licensed font; fix incorrect logos/font fallbacks before release.
- Refine alignment, spacing, hover/focus/active states, logo size, navigation grouping, mobile layout and CTA hierarchy.
- Use visible segmented **NO | EN** buttons. No language dropdown. Persist language and translate the entire consent and newsletter experience.
- Use visible **Light | Dark** buttons. No theme dropdown. Persist selected theme and prevent flashes of the wrong theme.
- Preserve a permanent Prana entry in the navigation; the floating launcher is the primary in-page access method.
- Observe the existing NRide interaction pattern where inspectable, but adapt styling to the official Vastu Nord design.

## 4. Full-width, high-impact BEFORE/AFTER hero

- Preserve the Figma-approved homepage structure while making the architectural media expansive and premium.
- Present the **same modern Scandinavian living room** from a matched viewpoint in both states:
  - **Before:** empty, unfurnished, plain/unfinished wall treatment, realistic and tidy, without structural destruction.
  - **After:** fully finished, painted and move-in-ready, with tasteful Scandinavian furniture, lighting, materials and decor.
- Match room architecture, door/window positions, dimensions and camera framing; compare only the intended furnishing and finish differences.
- Use an accessible before/after slider with keyboard and touch support, clearly labeled Before/After (localized), plus a non-slider fallback.
- Ensure beautiful focal-point crops at 390/768/1280/1440px without distorting the image; maintain headline/CTA contrast, image optimization and LCP performance.
- First search the current `assets/Visuals/` manifest and licensed approved local assets. If no verified matched pair exists, prepare an asset request and retain a clearly labeled approved fallback. Do not publish an unapproved customer photo or misrepresent an AI-created demo as a real renovation.
- The primary CTA must open a genuine supported upload/sample-to-Studio path; unavailable AI generation must be labeled rather than simulated as real.

## 5. Floating VastuNord Prana — bottom-right, fixed to viewport

- Provide a polished fixed-position launcher and accessible dismissible window that **does not move with page scrolling**.
- Three tabs with exactly these labels (localize descriptions without renaming the brand): **Prana | Quick Tips | Film**.
- Prana: approved AI consultation when live; otherwise clearly labeled availability, no fake answers presented as live.
- Quick Tips: reviewed short contextual guidance, eventually supplied by Payload CMS.
- Film: approved videos/reels or verified YouTube playlist; no autoplay with sound.
- Mobile: fit within safe-area insets, support keyboard and screen readers, and avoid covering the newsletter launcher, cookie notice or key CTAs.
- Opening Prana should not count as consent to cookies or newsletter.

## 6. COOKIE NOTICE AND PREFERENCE CENTER — REQUIRED

Treat this as a real consent system, not just a decorative disclaimer.

### First visit
- Display an elegant, unobtrusive bilingual notice on public pages **before optional analytics or marketing trackers run**.
- Use explanatory text, links to a real privacy/cookie policy, and equally clear **Accept all / Reject optional / Customize** choices.
- Strictly necessary storage is always described separately; optional **Statistics** and **Marketing** are OFF until the visitor positively opts in.
- No prechecked optional toggles, misleading color emphasis, consent through scrolling, or silent acceptance.
- A visitor must be able to browse the site after rejecting optional cookies.

### Persistence and control
- Store a versioned decision with timestamp and category settings using an appropriate strictly necessary consent record.
- Reopen via a persistent **Cookie settings** entry in the site footer; permit changing/revoking choices.
- On revocation, disable future optional tracking and remove/clear optional storage where technically possible.
- If policy or categories materially change, require fresh consent.
- Keep cookie settings independent of the newsletter subscription state.
- Show the choice banner only when no valid stored decision exists; avoid repeated display on every page.

### Integration rules
- Audit the actual trackers/libraries used; don't invent Google Analytics, Meta Pixel or marketing-cookie claims if they are not installed.
- If no optional trackers exist, say so plainly and don't deploy unnecessary marketing scripts.
- Use the approved Vastu Nord brand treatment and Norwegian/English copy.

## 7. DELAYED NEWSLETTER OFFER + LEFT-CORNER DOCK — REQUIRED

Replicate the **interaction concept** requested from NRide while using Vastu Nord branding and the existing backend architecture.

### Trigger
- On the public marketing site only, show the newsletter invitation after **about 25–30 seconds of active engagement**, never immediately upon page load.
- Do not show while a cookie choice is unresolved, an accessibility dialog is open, Prana is expanded, or another form/task is in progress.
- Never interrupt signup, an active Studio editing task, upload or rendering operation.
- Show at most once per visitor/device until the visitor takes an action or an explicit versioned reset is required.

### Dismissal behavior — important
- When the visitor clicks **X / Not now / Cancel**, do **NOT** make the newsletter access disappear permanently.
- **Minimize it into a small, tasteful, fixed bottom-left pill/tab labeled `Nyhetsbrev` (NO) or `Newsletter` (EN)**, possibly with a mail icon.
- The minimized pill remains **stationary on screen during scrolling** and across public-route navigation; it reopens the newsletter prompt on click.
- Persist the dismissed/minimized state across reloads so the full popup does not automatically return again.
- Provide a clear way to close an expanded dialog, and never reactivate it automatically after dismissal.
- Position it on the **left**, opposite the fixed **Prana** assistant on the **right**. On mobile, respect safe areas and the consent banner; do not overlap Prana, cookie controls, CTA buttons or system navigation.

### Newsletter signup and content
- Elegant, short NO/EN copy tied to Vastu Nord's purpose: design ideas, renovation guidance, approved render inspiration and platform updates. No fake discounts or urgency.
- Email field with validation, optional name if truly needed, an explicit **unchecked** marketing-email consent checkbox, and direct privacy/unsubscribe explanation.
- Newsletter opt-in is optional and independent of authentication, cookie analytics/marketing choices, and public-media publishing consent.
- Reuse the Vastu Nord verified Resend integration **only with a suitable newsletter list/consent storage system** (Neon or a future approved email-list provider). Store source, version, timestamp, locale, verification status and opt-out state; avoid duplicates and email enumeration.
- Prefer confirmed opt-in / double opt-in: collect email, send confirmation, activate only after confirmation. Provide working unsubscribe and suppression handling.
- Rate limit and protect the endpoint; never mark a fake success if the provider/database is unconfigured.
- After verified signup, show a success state and suppress further automatic prompts. The left corner pill may remain as a nonintrusive way to reach preferences, if useful.
- Billing and Postiz remain out of scope. Payload may later supply approved newsletter editorial content, but do not block Phase 01 visuals on Payload setup.

## 8. NRide behavioral reference: verify, do not assume

The deployed NRide source was inspected for these components:
- `src/components/cookie-settings.tsx` has consent preferences including statistics/marketing, explicit stored choice, and UI coexistence behavior.
- `src/components/newsletter-preferences.tsx` includes an unsubscribe preferences flow.

The **precise newsletter-delay timer and collapse-to-left-corner animation were not independently verified** from publicly accessible browser behavior. If Codex has legitimate access to NRide's source or live UI, inspect only the corresponding user interaction and document the observed pattern. Do not access NRide secrets or modify NRide. Otherwise, implement the exact Vastu Nord behavior above; do not block on NRide access.

## 9. Overlay coordination and accessibility

- Define one global overlay priority: cookie consent decisions take precedence; newsletter waits; the Prana launcher remains visible but does not obscure the cookie notice.
- Limit simultaneous expanded layers to one at a time where practical.
- Use semantic dialogs, a proper focus trap and return focus on dismissal, Escape handling, visible focus, accessible names and `prefers-reduced-motion` support.
- Fixed controls must remain reachable at 390px width; use responsive offset variables and safe-area padding.
- Do not use confusing close buttons or dark-pattern prompts. Avoid delaying essential content behind the newsletter dialog.

## 10. Verification gates

At minimum test:

1. NO/EN and Light/Dark at 390, 768, 1280, 1440px; selected state persists across reload.
2. Navbar and fixed Prana behave correctly during scroll, route change and mobile keyboard.
3. Prana tabs: **Prana / Quick Tips / Film**, tab keyboard accessibility, correct content and states.
4. Homepage before/after same-room pair, slider accessibility, mobile crops and contrast.
5. First-time cookie notice; reject optional without trackers; accept; customize; reopen and revoke from footer; choice persists.
6. Newsletter: never immediate; only after eligible delay; suppression when cookie/banner or another modal is active; close → fixed left pill; pill opens; dismissal persists on route change and reload; successful subscription suppresses the modal.
7. Mock timers in unit/browser tests; avoid brittle real-time waits. Test small mobile viewport collisions between newsletter, Prana and cookie controls.
8. Real newsletter submission and unsubscribe only when approved backend is configured; mark unverified flows clearly.
9. No regression to all 17 Studio routes, sample selection, verified authentication, project storage or private assets.
10. TypeScript, ESLint, production build, relevant unit tests and browser tests; capture durable screenshots and brief before/after evidence where possible.

## 11. Deliverables and execution

- Implement the UI changes in the existing Next.js codebase, not in a separate prototype.
- Update `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md`, `docs/FIGMA_TO_ROUTE_MATRIX.md`, and a concise `docs/COOKIE_NEWSLETTER_INTERACTION.md` describing states, data flows and deferred dependencies.
- Record the real provider and policy status, not imagined completion.
- Commit tested changes. Deploy to the existing authorized noncommercial Vercel demo and verify the live URL when safe; do not publish unapproved images, activate paid APIs or touch NRide.
- **Billing, payment plans, subscriptions and credit purchases remain deferred.** An email newsletter opt-in is not a paid website subscription.
- Report actual changes, tests, evidence, deployment, unresolved external setup and next go-live task. Do not stop at an audit; ship the user-visible experience.

**Execution order:** Verify relevant source → Header and hero refinement → Floating Prana → Cookie consent → Delayed newsletter + left dock → Accessibility and overlay integration → Tests → Documentation → Authorized deployment.
