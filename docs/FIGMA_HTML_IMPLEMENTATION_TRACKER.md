# Figma and HTML implementation tracker

## Design evidence

The [finalized marketing file](https://www.figma.com/design/yLScUtnuv6HLK0NDL8I9WE/Finalised-Marketing-Website-Screens--Dev-?node-id=0-1) exposed paired desktop and mobile boards for Home, the living-room feature, About, Pricing, Resources and Contact in the guest canvas. Those six board subjects identify the rows below. Frame-level node IDs, measured geometry, original image exports and the licensed font file were unavailable. The official brand PDF governs identity.

The [Studio configuration matrix](STUDIO_TOOL_CONFIGURATION_MATRIX.md) and designer Studio prototype govern the tool catalogue and each editor. Recovered files in `docs/references/vastunord-html-demo/` supply supplementary workspace interactions. The supplied execution brief in this checkout is `prompts/VastuNord_Figma_HTML_Codex_Rebuild_v5.md`. The deployed application renders Next.js components. The sample images originate in the supplied brand reference, as recorded in the [asset manifest](ASSET_MANIFEST.md).

## Marketing

| Route family, including English | Figma board subject | Scope and outstanding evidence |
|---|---|---|
| `/` | Home | Desktop and mobile page composition. Exact hero image, image crops and typography await design exports. |
| `/features` | Living-room feature | Six linked Studio workflows, three selectable lighting/palette studies and FAQs follow the inspected board. The previously observed `/solutions/living-room-design` redirects here in both locales. Subject-specific approved images remain outstanding. |
| `/about` | About | Story and editorial sections follow the approved board hierarchy. Detailed typography and imagery await comparison. |
| `/pricing` | Pricing | Public demonstration of the pricing surface. Commercial prices, entitlements and purchases require separate approval. |
| `/resources` | Resources | Search and eight topic filters, expanded reading and five bilingual article permalinks from the historical route inventory. Detail pages use reference-based sample copy and the existing reading hierarchy. Final editorial copy, crops and original assets await approval. |
| `/contact` | Contact | Contact and help navigation. Commercial lead collection and message submission stay disabled on Hobby. |
| Authentication routes | No additional finalized frames established | Existing bilingual forms and server-side readiness checks retained. Production signup remains disabled. |

Classification for the first six rows is **Figma inspected / visual approximation** with **Missing approved asset** where noted. No marketing row has verified pixel parity. Testimonials, social proof metrics and commercial offers require approved substantiation before publication. Six historical broken solution URLs have no independent approved layout in this rebuild.

## Application

| Route or feature | Authority | Implemented experience | Verification or limit |
|---|---|---|---|
| `/app`, `/app/dashboard` | Demo supplementary, `dashboard` and `projectCard` | Image-led dashboard, shortcuts, project studies and linked albums. Verified sessions can see their recent unarchived projects. | Dashboard navigation test. Owner-scoped data is gated by existing auth readiness. |
| `/app/projects`, `/app/studies/[id]` | Already working project API, supplementary project card | Existing create, rename, archive and restore flows. Illustrative project detail and matching album have distinct routes. | Study-to-album browser test. Real mutations stay closed on the public demo. |
| `/app/renders`, `/app/albums`, `/app/files`, `/app/assets` | Demo supplementary, `rendersPage`, `assetsPage` | Brand reference gallery with album and text filters, favourites for the current view and full-size image dialog. | Gallery search, favourites, empty filter and dialog tested in the workspace suite. These are reference assets, separate from private files. |
| `/app/library` and 17 `/app/tools/[id]` routes | Designer Studio prototype and existing matrix | Shared catalogue and tool-specific controls, sample canvas, comparison where observed, presets and retained private upload boundary. | Existing route/config tests and browser suite exercise editor navigation and disabled generation. Exact tool-specific example imagery and approved exports remain outstanding. |
| `/app/search` and command dialog | Demo supplementary, `commandResults` | Keyboard-accessible search across workspace destinations and the 17 real tool routes. | Shortcut, dismissal, filtering and navigation test. |
| `/app/home-experience` | Demo supplementary, `experiencePage` | Guided room, lighting and material exploration using illustrative references. | No measured spatial model or generated room output. |
| `/app/knowledge` and `/app/prana` | Demo supplementary, `knowledgePage`, `renderPrana`, requested Prana modes | Reading and local topic selection. Prana includes consultation, quick tips and film views. | CMS articles, live consultation and video service await their respective phases. |
| `/app/budget`, `/app/billing`, `/app/credits` | Demo supplementary, `budgetPage`, `billingPage`, `walletPage` | Illustrative scenario controls and account information states. | Backend blocked for verified regional pricing, wallet ledger, invoicing and checkout. |
| `/app/shared`, `/app/team`, `/app/settings` | Demo supplementary and existing account screens | Private workspace and sharing availability, preference navigation and existing authenticated account controls. | Invitations and collaboration are unavailable. Existing preferences remain available on the public demo. |

The [responsive screenshot index](evidence/rebuild-v5/README.md) pairs the previous public site with the rebuilt interface at 390, 768, 1280 and 1440 pixels. The workspace, Studio and experience browser tests cover the interactive paths above. The [project state](PROJECT_STATE.md) records the final validation and deployment result. Guest-canvas inspection establishes composition only. Final comparison requires original-scale desktop/mobile frame exports, approved visual assets and relevant font entitlement.
