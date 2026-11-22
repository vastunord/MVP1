# Phase 01 design revision · live evidence

These captures show application commit `d1af4d8` on the existing Vastu Nord noncommercial site. Vercel deployment `dpl_Ens6kjjYL2AiFER8xccFwUCueAEQ` serves the public alias. [Live website](https://vastunord-web.vercel.app) · [Previous release](../v7-phase01/README.md)

| Screen | Phone · 390 px | Desktop · 1440 px |
|---|---|---|
| Homepage and language/theme controls | [Norwegian](home-390.webp) | [English](home-1440.webp) |
| First-visit cookie card | [Norwegian](cookie-notice-390.webp) | [English](cookie-notice-1440.webp) |
| Newsletter ticket | [Norwegian](newsletter-ticket-390.webp) | [English](newsletter-ticket-1440.webp) |
| Cookie, newsletter and Prana launchers | [Norwegian](visitor-docks-390.webp) | [English](visitor-docks-1440.webp) |
| Render gallery | [Norwegian](gallery-390.webp) | [English](gallery-1440.webp) |
| Room Reimagination controls | [Norwegian](room-390.webp) | [English](room-1440.webp) |

Additional views show the [768 px dark homepage](home-768.webp), [17-tool library](tools-1440.webp) and [Prana dialog](prana-1440.webp). Screenshots were taken with reduced motion. The Next control remains available with that preference.

A public browser stepped through all 11 comparison pairs, returned to the first, and opened that exact source in Studio. The gallery exposed 50 unique thumbnail URLs. All 17 tool-card URLs were distinct from those in the gallery. All 17 editors, both privacy pages, the cookie settings icon and the three Prana tabs were verified. Five protected service paths and three newsletter write paths stayed closed. The test sent no email or private images.

Local browser automation also verified automatic rotation, pause, keyboard comparison, newsletter timing and returning focus after each dialog closed. TypeScript, ESLint, the production build, 30 unit tests and 36 browser tests passed. [Source and placement verification](../../ASSET_MANIFEST.md)
