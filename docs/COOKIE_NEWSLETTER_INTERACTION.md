# Visitor preferences, newsletter and Prana

## Public experience

| Interaction | Behavior |
|---|---|
| First visit | A bilingual card sits in the lower-left corner. It offers equally prominent reject and accept buttons, a link to the policy and a preference editor. The page stays available for browsing. A missing, malformed or obsolete decision starts with both optional categories off. |
| Settings | Saving a choice collapses the card into a round cookie button. It reopens the preferences alongside the existing footer control. The site has no optional analytics or advertising integrations or identifiers to clear. The browser requests the official webfont from Google’s CDN. [Norwegian privacy notice](https://vastunord-web.vercel.app/privacy) · [English privacy notice](https://vastunord-web.vercel.app/en/privacy) |
| Newsletter invitation | A cinema ticket with perforated edges and a detachable-stub design opens after 27 seconds of visible, focused marketing-page time with a recorded cookie choice, including rejection. The timer pauses during other dialogs, menu or form interactions. Account, Studio, privacy and email-link pages never trigger it. |
| Dismiss or reopen | First presentation records the invitation as seen. Close, Escape and Not now leave a fixed lower-left tab. It reopens on demand and survives navigation and reload. An open letter or Prana panel is the only expanded visitor dialog. |
| Prana | The upper-right header button and the fixed lower-right emblem open the same assistant panel. The tablist supports arrows, Home and End. It offers Prana, Quick Tips and Film with bilingual room guides. Consultation and a rights-approved film or playlist await activation. |

## Stored choices

- `vn-cookie-choices` in first-party local storage holds the consent version, decision timestamp and separate Statistics/Marketing booleans. A version change prompts for a new choice. A rejected choice allows exactly the same navigation.
- `vn-newsletter-display` is an independent versioned first-party display preference. Minimizing the invitation never creates a subscriber. A successful server confirmation suppresses later invitations on that browser. If storage is blocked, preferences can be kept for the current page session.
- Language and theme continue using their existing cookies. Current optional tracker inventory is empty. Opening Prana, changing language, browsing and scrolling grant no optional consent. New tracking integrations must explicitly consult the appropriate consent category before loading and provide category-specific cleanup on withdrawal.

The footer control and equivalent first-layer accept/reject choices follow the Norwegian authority’s guidance. [Datatilsynet on declining consent](https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/6.-ikke-la-avvisning-av-samtykke-kreve-ekstra-klikk-eller-vare-mer-brysomt/)

## Email and suppression

The Hobby demonstration shows the invitation design with signup visibly unavailable. Its server refuses newsletter writes. A configured Development environment requires the reviewed newsletter tables, explicit enablement, a separate signing secret, a trusted app origin and the existing approved Resend sender. [Environment inventory](ENVIRONMENT_VARIABLE_INVENTORY.md)

1. The signup endpoint validates the origin, address, supported locale, explicit opt-in and rate limits. A unique normalized address and a database reservation prevent duplicate enrollment. The record carries its source, consent version, timestamps and language.
2. Resend is asked to deliver the localized verification message after a reservation. The generic response does not reveal membership. A provider failure permits retry and reports unavailability. A request or delivery acknowledgement leaves membership unconfirmed.
3. Confirmation and withdrawal links carry purpose-bound tokens in URL fragments. Landing-page GETs do not change membership. The recipient explicitly submits the action. Confirmation expires after 24 hours, and withdrawal preserves suppression. An unsubscribed address cannot be reactivated by a public signup request.
4. Payload editorial publishing, campaigns and list broadcasting are outside this increment. Before live collection, verify the environment and sender with a controlled inbox, review retention and fulfillment of privacy requests, and pass consent, delivery, confirmation and unsubscribe checks using approved infrastructure.

**Local integration results.** The disposable PostgreSQL fixture exercised the proposed migration, actual Prisma operations, duplicate requests, rate limiting, mail failure/retry, confirmed opt-in and withdrawal suppression. A separate local browser followed the synthetic confirmation link, sent an explicit POST, confirmed the address, then unsubscribed. Replaying confirmation after withdrawal failed. Mail was intercepted locally. Live Neon and Resend delivery for this newsletter remain unverified. Repeat the isolated database check with `pnpm --filter @vastunord/web run test:newsletter-db`.

## Behavioral reference

The Phase 01 evidence index records the visitor controls at phone, tablet and desktop widths. [Screenshots and browser checks](evidence/v7-phase01/README.md)

The public NRide homepage exposed NO/EN, a theme control, a cookie settings region with distinct rejection and acceptance, and a newsletter dialog with an unchecked email opt-in. Closing the invitation revealed a control to reopen it. Its precise delay was not measured. Vastu Nord uses the 27-second delay, fixed corner arrangement and artwork specified for this project. [Public reference](https://www.nride.no/)
