# VASTU NORD — COMPLETE WEBSITE + STUDIO GO-LIVE BUILD
## Codex Master Execution Prompt v7.0 | Brand-locked | Figma-led | Photo-first UX | Billing deferred

> **MISSION:** Finish the EXISTING Vastu Nord application as a polished, working, Norwegian-first spatial visualization platform. Rebuild neither the repository nor its verified services. Replace generic-looking pages with a premium, fully functional customer experience. Build and verify real end-to-end journeys. **Billing is out of scope until the founder separately authorizes it.**

**Owner project:** Vastu Nord only. Other business projects, including NRide, are completely out of scope.\
**Existing local source:** `C:\Users\VN\Documents\ChatGPT\VastuNord` (confirm actual current root).\
**Current noncommercial public demo:** https://vastunord-web.vercel.app/\
**Product tagline:** Where Possibilities Take Shape\
**Frontend:** Existing Next.js / React / TypeScript on Vercel.\
**Data:** Existing Vastu Nord Neon PostgreSQL and Prisma.\
**Authentication:** Existing Better Auth with Resend.\
**Media:** Private Vercel Blob, approved public derivatives only.\
**Knowledge CMS:** Payload CMS deployed in the cloud, with its own database and editorial controls.\
**AI:** Approved OpenAI/Azure AI Foundry (or another expressly authorized provider) through a cost-aware adapter and durable-job system. Verify image/video operations separately.\
**Publishing:** Official Pinterest manual/API route and founder-owned YouTube where authorized; **Postiz excluded**.\
**Language:** Norwegian Bokmål (`nb-NO`) default and English (`en`).\
**Site modes:** Responsive light and dark with explicit direct buttons.\
**Commercial mode:** Personal noncommercial beta on Vercel Hobby for now; business launch requires appropriate hosting/terms review.\
**Excluded:** Checkout, subscriptions, paid plans, credit purchases, Stripe activation and any production billing. Existing billing scaffolds must remain inaccessible or clearly deferred.

---

## 0. EXECUTION RULE: DELIVER PRODUCT, NOT ANOTHER REPORT

1. Begin by reading `AGENTS.md`, `docs/PROJECT_STATE.md`, and the relevant current source files. Read this master prompt once; subsequent sessions use the concise phase prompt and state file.
2. Verify the latest LOCAL code, Git branch/commit, deployed version and repository status. Earlier GitHub `main` may be behind the working Codex code. Never reset, force-push, overwrite or clone over the current application. Reconcile safely.
3. Preserve proven Better Auth, Resend, Neon, private Blob, uploads, project persistence, 17 Studio routes, i18n and theme services. No mock state may replace working production code.
4. **Within the first implementation session, deliver a visible tested improvement**, preferably a brand-correct professional header with explicit language/theme buttons and corrected hero entry flow. Do not stop after a design audit.
5. Reuse shared component/configuration systems rather than writing 17 separate editors. Keep normal work incremental; finish, test, document and commit one coherent change at a time.
6. Make one consolidated request for missing owner-provided Figma exports, licensed brand assets, AI budget/API access or social authorization; continue independent work in the meantime.
7. No new third-party Codex plugins. Official provider runtime APIs, approved cloud services and already configured connectors are allowed. Never store secrets in prompts, Git or browser bundles.
8. Actions requiring extra explicit approval: unplanned paid charges, destructive schema/data changes, publishing a user's work publicly, posting to external social accounts, releasing customer data, changing unrelated company resources. Routine reversible code/test changes may proceed in authorized scope.
9. For each task, update `docs/PROJECT_STATE.md`, `docs/CHANGELOG.md` and `docs/go-live/GO_LIVE_STATE.md`; record verified features, actual tests, current branch/commit, next exact task and blockers. Do not re-audit unrelated completed phases.

---

## 1. NON-NEGOTIABLE SOURCE AUTHORITY

| Priority | Source | What it governs |
|---|---|---|
| 1 | `assets/brand/Brand Guidelines Document.pdf` (36 pages), with verified originals | **Exact official logo, logo variants, colors, typography, visual restrictions and tone**. Never compromise. |
| 2 | **These new explicit owner directives** | Direct `EN`/`NO` buttons, direct Light/Dark buttons, professional header, significantly wider cinematic homepage image, stronger photo-first entry flow, and remaining functional integrations. |
| 3 | Finalized Figma marketing file: https://www.figma.com/design/yLScUtnuv6HLK0NDL8I9WE/Finalised-Marketing-Website-Screens--Dev-?node-id=0-1 | **Approved marketing page composition, site identity, assets, layout, sections and page hierarchy** unless explicitly superseded by priority 1–2. |
| 4 | Studio prototype: https://vastu-nord-design-prototype.vercel.app/app and `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md` | **17 actual Studio tools**, editor shell, controls, empty states, supported page behaviors. |
| 5 | `docs/references/vastunord-html-demo/` (recovered interactive HTML prototype) | Supplementary dashboard, projects, render library, Home Experience, Knowledge, Prana, gallery and contextual-waiting UX. **Do not port fake storage, fake wallet or simulated generation.** |
| 6 | https://www.reimaginehome.ai/ and https://app.reimaginehome.ai/ | **UX / task-flow benchmark ONLY**, not a branding, layout, source-code, image, marketing claim or copy authority. |
| 7 | Existing live Vastu Nord application + tests | Evidence of what functions. Preserve working implementations and safely improve them. |

If the final Figma file cannot be opened, do not claim to have seen its frames. Request a **single batch** of approved desktop/mobile frame exports, assets, and logo/font files. Implement verified app/screens and the specific user-directed header controls while awaiting exports. Do not invent absent Figma page designs.

**Source conflicts:** Make a short decision entry (source A, source B, priority, selected implementation). The official logo/fonts are mandatory even if a prototype differs. The user's explicit new homepage/header requirements take precedence over older prototypes while preserving Figma's distinctive art direction.

---

## 2. EXACT BRAND COMPLIANCE — STOP GENERIC LOGOS AND FONTS

The brand PDF visibly specifies:
- Official **VastuNord** architectural monogram and custom wordmark; primary horizontal lockup, secondary, tertiary, standalone logomark, and approved tagline treatment.
- Font family: **Zalando Sans Expanded**, including listed weights. Follow approved type hierarchy and weights; ensure a valid license and usable authorized font files exist before calling branding complete.
- Six primary brand color swatches: near-black, warm ivory, deep teal, sage, sand and orange. Extract verified values from the approved design source/Figma variables or source artwork; **do not invent color codes from memory**.
- Logo don’ts: no arbitrary recoloring, gradient, outline, rotation, distortion or unrelated background treatment.

Mandatory actions:
1. Visually review PDF pages containing the approved logo variants, color palette, font family and usage rules. Check the actual logo file(s) against those pages and the Figma exports. The supplementary HTML demo's logos are NOT automatically approved originals.
2. Inventory approved asset paths and font weights; obtain licensed source files from the owner if absent. Never pull a random font package, alter the wordmark, recreate it with typed text or replace the mark with a generic icon.
3. Create/verify semantic brand design tokens and consistent `@font-face` integration only with authorized assets; select correct approved logo variant for light/dark headers, mobile navigation, favicon and footer.
4. Ensure buttons, headings, form typography, Studio navigation, dialogs and CMS typography remain in the same identity system. Test rendering on desktop/mobile and fallback behavior while the licensed font loads.
5. Record visual evidence in `docs/BRAND_PARITY.md`: PDF/Figma reference → actual asset → route → screenshot → pass/fail. **Do not declare brand-complete if approved logo or font is absent.**

---

## 3. PROFESSIONAL TOP MENU — EXPLICIT CONTROLS REQUIRED

Build a restrained premium architectural header using the **approved Figma navigation labels and hierarchy**, refined for usability. Preserve the source design's personality rather than introducing an unrelated UI.

- **Left:** exact approved horizontal logo, clickable home; correctly scaled and visually balanced.
- **Primary navigation:** use approved Figma section names and real destinations; make Studio, suitable examples/gallery, Knowledge Hub and other actually available journeys discoverable. No broken links, duplicate menus or invented solutions.
- **Always-visible feature:** **VastuNord Prana** accessible from the persistent global top navigation, with its consultation/tips/film panel. On narrow screens provide a clear visible entry point.
- **Right utilities:** **two adjacent text buttons `EN` and `NO`** with obvious active state, keyboard focus and accessible labels. **Never a language dropdown.** `NO` selects Norwegian Bokmål; preserve page/workflow across locale changes when possible.
- **Theme:** two adjacent **direct Light and Dark buttons** (text, optionally supported by sun/moon icons) with clear selected state. **Never a dropdown for theme.** If system preference is supported, apply as initial default or in settings, but the global visible control offers one-click Light/Dark.
- **Account:** sign-in when logged out, account/workspace when logged in; one compelling creation CTA aligned with actual route (no dead button).
- **Behavior:** deliberate spacing, consistent hover/active/focus states, scroll treatment that remains legible over the hero, no jarring overlays or excessive shadows. Avoid a crowded row; selectively reorganize into a genuinely usable mobile menu while keeping language/theme one-tap choices accessible.
- Test 390/768/1280/1440 widths and keyboard/touch interactions, sticky-scroll contrast, route transitions, auth state, and no horizontal overflow.

**Acceptance:** both `EN` and `NO` are visible clickable buttons (not a selector), both Light and Dark are clickable buttons (not a selector), header reflects the official wordmark, Prana is globally accessible, and all primary destinations function.

---

## 4. HOME PAGE — WIDE CINEMATIC HERO AND PHOTO-FIRST JOURNEY

**Objective:** The page must be much more visually impressive, specific and useful than a minimal marketing scaffold. User asks for a homepage at least as compelling and easy to start as ReimagineHome. Translate its successful *interaction principles* into an unmistakably Vastu Nord experience, not a visual replica.

### Required hero transformation

- Use a **dominant, high-resolution, wide architectural image or authentic before/after pair** from the reorganized `assets/Visuals/` collection only after suitability/rights review. Make the image occupy materially more horizontal space than the current hero: desktop target ~85–100% of available content width, with responsive full-bleed or near-full-bleed treatment as supported by approved Figma. Prioritize the picture, not a narrow stock-like card.
- Strong image focal point and natural crop; preserve architectural realism, camera consistency and direction. A before/after slider is preferable where a genuine matched pair exists; keyboard accessible and operable on touch. Never falsely claim two unrelated images are a before/after pair.
- Hero overlay text and CTAs remain readable against both light/dark variations; no gradients on the official logo, no unnecessary floating widgets covering the main image. Use a sensible image aspect ratio and portrait-friendly layout at mobile widths.
- Headline and copy must follow finalized Figma wording where approved; refine only where this explicit user instruction changes hierarchy. No copied competitor copy.
- **One clear primary CTA:** e.g. `Upload Your Space` or the approved Figma equivalent → actual Studio upload/appropriate entry. Secondary: `Try a Sample` → an authorized sample media workflow. Account signup should occur at the appropriate persistence/generation boundary, not as a confusing dead-end.
- Make the hero feel active and purposeful: intuitive choice among high-priority goals (staging, redesign, exterior) if already covered by approved Figma design; otherwise provide concise clickable tool entry below the hero.
- Use image optimization, properly sized responsive derivatives, lazy loading below the fold, a stable hero aspect box and measured Core Web Vitals. Do not load original multi-megabyte demo renders directly into the landing hero.

### Translate ReimagineHome's *journey patterns*, not its branding

ReimagineHome currently demonstrates: prominent **photo upload or sample-photo entry**, simple goal selection, guided prompt/refinement, understandable before/after, and a path to saved results. Use these behaviors to streamline Vastu Nord's **Choose → Create → Explore → Decide** promise.

Suggested Vastu Nord customer journey:

**Arrive → View dramatic room transformation → Upload / choose approved sample → Select goal or one of 17 configured tools → Describe change & choose style → Sign in when necessary → Submit actual supported AI job → Follow truthful progress + optional relevant tips → Compare result with source → Save to private project → Refine/download → Choose whether to submit for public gallery.**

Do not copy competitor artwork, page sections verbatim, CSS, proprietary layout, ratings, testimonials, statistics, free-design offers, pricing or claims such as perfect geometry. Do not promise precise structural preservation unless your model tests establish it.

### Homepage coverage (only where supported by approved Figma / owner requirements)

- Immersive hero with real creation action, compelling source/result examples and honest labeling of AI concepts.
- Clear three-to-five-step visual explanation of how Vastu Nord works, integrated with actual Studio behavior.
- Tool/solution discovery that maps to 17 Studio tools without an overwhelming homepage catalog.
- Curated image examples and a real linked public gallery with filters, not fabricated customer case studies.
- Short Knowledge Hub editorial previews; visually rich and genuinely useful context, not AI-generated spam.
- Relevant Home Experience / guided-tour positioning, labeled accurately if 3D isn't available.
- Visible Prana help, accessible footer, contact/privacy terms and no broken links.
- Strong final CTA to begin an actual supported task.

**Acceptance:** the first view on 1440px shows a noticeably wider hero with legible content and working upload/sample entry; the first meaningful action is understandable in <30 seconds in a usability walkthrough. At mobile widths the hero remains readable and CTAs prominent. Capture before/after implementation screenshots and Figma comparison.

---

## 5. FINISH ALL REMAINING CUSTOMER-FACING PAGES

Reconcile route inventory against **actual Figma frames**, 17-tool matrix, recovered HTML demo and existing Next.js routes; avoid a standalone landing page with empty placeholders.

**Public pages:** Home; Studio overview/entry; appropriate approved solutions; examples & public gallery; Knowledge Hub categories/articles; Home Experience (accurately labeled); About/contact/support; FAQs; privacy/terms, cookie controls if trackers require; social links. Pricing/billing may remain hidden or an honest coming-later message only if part of approved design. Broken `/solutions/*` links identified previously must be built from approved content or removed/redirected—never left in the live menu.

**Private application:** Dashboard; projects create/open/rename/archive/restore/delete; personal Files/Assets/Renders; search, filters, albums/favorites where supported; image upload and preview; source image selection; all 17 Studio editors; before/after comparisons; saved results and version history; download; profile/security/settings; account export and deletion requests; Prana; feedback/help. Use real Neon/Blob data for authenticated features. Handle loading, empty, errors, retries and network loss professionally.

**17-tool policy:** `StudioShell + ToolConfiguration + SharedComponents + SecureJobAdapter`. Preserve exact recorded tool labels, categories, option defaults, conditional controls, comparison labels and route identifiers; fix obvious inconsistencies only with evidence. Do not pretend a disabled capability is active. Provide a capability-status matrix per tool.

**Home Experience / Budget Intelligence:** Guided visual journeys may ship if real linked media exists. Do not claim a panoramic video is a navigable 3D twin. Budget scenarios must use deterministic calculations and disclosed estimates if included; do not invent market quotes.

---

## 6. ENABLE REAL ACCOUNT, PRIVATE FILE AND AI RENDERING FLOWS

### Auth and project storage

- Reuse tested Better Auth/Resend/Prisma implementation; verify production-only Neon branch and properly scoped app role; apply reviewed migration to production only under authorized, guarded workflow. Do not copy development-owner credentials into publicly reachable Production.
- Verify new account + real email verification + original-password sign-in, forgotten password, logout, session expiration, personal project persistence and two-user private access isolation on intended environment.
- Cloud media: private Vercel Blob originals/outputs, access authorization, signed retrieval, deletion and failed-job cleanup/reconciliation. Preserve current verified JPEG/PNG/WebP 4 MiB upload limit unless explicitly changed and tested; UI must not claim 20 MiB while backend enforces 4 MiB.

### First real rendering vertical slice

**Select an existing photo → choose `Virtual Home Staging` or `Room Reimagination` → configure approved options → submit one real supported AI image transformation → persist job and rendered output to private storage → show genuine job statuses → compare original/result → save and reopen → download → refine version.**

- Choose image-capable approved provider/model using capability and pricing checks. Do not assume a text/chat model supports image-to-image or that an available video model exists in the same region.
- Job orchestration must be durable/recoverable (queue, idempotency, timeout, retry, cancellation behavior, ownership checks); user leaving page must not lose job. Do not fabricate progress percentages, success states, artifacts or billed usage.
- Keep per-user request caps and a fixed owner-approved daily/monthly AI spend ceiling during the no-billing beta. Reject abuse, invalid images and oversized jobs. Reserve usage counts/server authorization atomically; logs are redacted.
- Add capability mapping for every Studio tool: supported provider operation, required input, prompt/preset contract, output contract, known fidelity limitations, model availability, measured cost, test evidence. Hide/disable capabilities that cannot truly run.
- Video: implement only if a separately verified image-to-video/video-generation provider and operating budget support it; proper async persistence/download/visibility. Don't label video “live” until its real test passes.

---

## 7. REORGANIZED VISUALS + PRIVATE/PUBLIC GALLERY + PINTEREST

1. Recursively scan the **current local** `assets/Visuals/`; previous 727-file/4.45GB manifest is historical and may now be wrong. Record relative paths, format/dimensions, bytes, SHA-256, duplicate candidates, editorial category, usage-rights evidence, whether matching before/after, orientation, hero suitability and approved public status.
2. Preserve originals; don't mass-copy binary assets into GitHub or Vercel. Generate curated responsive WebP/AVIF derivatives, thumbnails, explicit focal points and descriptive alt text. Update broken references after folder reorganization.
3. Classify each asset: founder-owned approved demonstration; licensed third-party; user-owned private/consented; unknown rights; rejected. **Unknown rights = no publication.** Company demo examples must not be presented as real customer work.
4. Implement separate private user library vs publicly approved gallery; channel-specific permissions per Pinterest/YouTube, editable attribution/watermark, human editorial approval, consent withdrawal and external takedown log.
5. Connect public gallery cards to approved Pinterest board/profile, with manual publishing and tracked post URLs as first valid stage; official Pinterest API when authorized and verified. Do not auto-publish an asset simply because it appears publicly on the site.
6. Keep Postiz out. Build a replaceable publishing adapter for later, disabled by default.

---

## 8. PAYLOAD CMS — REAL CLOUD KNOWLEDGE HUB

- Deploy Payload separately to authorized Vastu Nord Vercel cloud project; use separately owned Neon CMS database and persistent cloud media, no local production hosting.
- Configure Norwegian/English articles, galleries/render stories, categories, authors, citations, reviewed design explanations, SEO metadata, schema.org as relevant, revisions, human draft/approval/publish, scheduled/withdrawn status and source-rights records.
- For each render story: what was changed, design intent, strengths, practical tradeoffs, suitability, what the image cannot establish, related tools, truthful tone (clear, empathetic, specific). No fabricated expert credentials or client testimonials.
- AI-assisted content creation generates **drafts only**; editorial approval and rights/consent gate always precede publication.
- Public Knowledge Hub pages use published Payload content; localized routes, sitemap/canonical/hreflang and contextual links into the Studio. Prana and contextual waiting may retrieve only approved published content.

---

## 9. PRANA — PERSISTENT TOP-MENU EXPERIENCE

**VastuNord Prana** must be available from the global top navigation on marketing and app pages, plus mobile. Panel is polished and accessible, remembers correct context when permitted, and contains exactly three primary tabs:

1. **AI Consultation:** real AI chat with approved provider, source-grounded answers from published Payload articles, optional permissioned active-project context, safe tool calls only, chat history/retention behavior, fallback when unavailable. Never claim project modifications unless a checked server action completes.
2. **Quick Tips:** reviewed, bilingual contextual tips with links to approved Knowledge Hub articles and relevant Studio actions. Context-aware, not random advertising.
3. **Film:** founder-approved YouTube videos/playlists or licensed own video assets with working thumbnails/playback controls; lazy embeds, platform privacy handling, no invented film library.

Prana must work in light/dark, keyboard/touch and both languages. Its icon should respect brand visual geometry without replacing the official logo. Include real empty/error states, cost caps and abuse limits.

---

## 10. LAUNCH QUALITY, COMPLIANCE AND OPERATIONS

- **Professional visual QA:** compare every accessible marketing frame against Figma and homepage against approved hero; validate original logo + actual licensed Zalando Sans Expanded fonts, responsive 390/768/1280/1440 screens, high-quality media crops, consistent footer/nav/forms and dark mode.
- **Functional QA:** no broken CTAs, nav, tool routes, uploads, project saves, generation jobs, downloads, review flow, consent, CMS articles or Prana tabs; tests for unauthorized user B access and anonymous access.
- **Quality controls:** accessible keyboard/contrast/labels, reduced motion, image alt text, performance budgets/Core Web Vitals, upload scanning policy, sensible retention, orphan storage reconciliation, log redaction, backups/restore procedure, error monitoring, release rollback, rate limiting and abuse controls.
- **Trust and policy:** clear noncommercial beta label as applicable; image results labeled conceptual; avoid unverified structural-preservation claims; privacy/terms/support; data export/deletion request, rights/watermarks and consent withdrawal; no copied competitor content or fabricated figures.
- **Operational handoff:** owner can publish Knowledge Hub content, approve gallery items, maintain images, connect Pinterest, add Film playlist, rotate credentials, see AI spend and inspect failures using a concise documented admin runbook.
- **Hosting:** Current Vercel Hobby remains for *personal, noncommercial* demo only. A commercial public business service requires eligible hosting; even noncommercial `.vercel.app` Production is publicly reachable, so only enable live accounts/private media after correct production data isolation/permissions and tests.
- **Billing:** absolutely deferred. Disable checkout and fake credit balance, hide pricing claims unless Figma-approved nontransactional messaging. No Stripe or payment processing, no credit-purchase APIs. Free demo generation limits and cost dashboard only.

---

## 11. EXECUTION ORDER AND CODEx MODEL/REASONING SELECTION

Run one focused phase at a time, keeping the relevant phase `.md` and `PROJECT_STATE.md` as context; **do not paste the full master prompt every time**.

| Phase | Focus | Effort | Acceptance |
|---|---|---|---|
| 00 | Safe local/deployed source baseline; official brand assets, final Figma access and current `Visuals` mapping | **High** once | Baseline reconciled, brand gap clear, first visible fix committed |
| 01 | **Professional header + EN/NO + Light/Dark + dominant wide hero + real upload/sample path** | **High** design pass, **Medium** implementation | Brand exact, responsive, new hero and journey deployed + screenshots |
| 02 | All finalized Figma marketing pages + application dashboard/workspace polish | Medium | Route parity, real CTAs, mobile/desktop, no generic placeholders |
| 03 | Production-only onboarding, projects/private media access | Medium | Two-user real E2E and private upload verification |
| 04 | First real AI image rendering, 17-tool capability matrix, later verified video | High architecture, Medium build | Real before/after saved and reopened, cost measured |
| 05 | Reorganized Visuals, curated galleries and consent workflows | Medium | Current manifest, rights gate, galleries, revocation tests |
| 06 | Payload CMS cloud + Knowledge Hub + human approval | Medium | Bilingual published article appears on site |
| 07 | Prana three tabs + film / reviewed tips | Medium | Top-menu Prana works across screens and languages |
| 08 | Pinterest linking and approved publishing + SEO/support | Medium | Public gallery ↔ approved Pinterest links + logged approved post |
| 09 | Integrated noncommercial launch QA and founder handover | **High** final review, Medium fixes | Proven working site, brand/visual/functional release gates, updated docs |
| 10 | **Billing/monetization** | **NOT AUTHORIZED** | Separate future project only |

**Use the strongest *actually available* coding-capable Codex model** with High reasoning for the initial cross-reference UI/brand analysis and complex AI orchestration; Medium for routine implementation; Low for isolated documentation, copy changes and simple test fixes. Higher effort is not a substitute for missing Figma exports or provider authorization. Maintain cost efficiency by reading only changed routes and relevant canonical specs.

**Continue autonomously within already approved reversible code/test/deploy scope.** Never assume approval for new API spend, data-destructive operations, publication to third-party platforms or production database changes.

---

## 12. REQUIRED PROJECT MEMORY AND EXIT REPORT

Maintain:

- `docs/PROJECT_STATE.md` — short canonical handoff with current phase, next action, verified live status, blockers.
- `docs/CHANGELOG.md` — concise implementation/test/commit record.
- `docs/go-live/GO_LIVE_STATE.md` — checked journeys, service status, last deployment, next phase.
- `docs/BRAND_PARITY.md` — official logo/fonts/colors asset proof and actual screenshots.
- `docs/FIGMA_TO_ROUTE_MATRIX.md` — Figma frame/node → route → status → images → screenshot result.
- `docs/REIMAGINEHOME_UX_BENCHMARK.md` — photo-first UX patterns adopted, what intentionally differs; no copied visual/copy/assets.
- `docs/STUDIO_TOOL_CONFIGURATION_MATRIX.md` — canonical 17-tool list; don't duplicate.
- `docs/VISUALS_ASSET_MANIFEST.csv` or documented replacement — current reorganized paths, rights, hero candidates.
- `docs/OWNER_ACTIONS_ONE_LIST.md` — one consolidated list of only genuinely missing external credentials/assets/decisions.
- `docs/go-live/RELEASE_CHECKLIST.md` — measurable release blockers and gates; no billing activation.

At end of each phase report compactly:

**DONE** (routes / user flows actually improved), **BRAND/Figma evidence**, **TESTED** (commands + screenshots at 390/768/1280/1440, actual backend where applicable), **LIVE URL** (if deployed), **BLOCKED** (only genuine dependencies), **COMMIT/DEPLOY ID**, **NEXT one task**.

**START NOW:** Perform targeted project memory/source verification and immediately implement the most valuable available change: the correct branded header and direct EN/NO + Light/Dark buttons; complete the wide interactive hero when approved Figma imagery/Visuals evidence is available. Do not finish with only a planning report.
