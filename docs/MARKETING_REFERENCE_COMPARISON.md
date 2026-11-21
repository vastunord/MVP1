# Marketing reference comparison — Phase 01E-A

**Inspected:** 2026-11-21, desktop in Codex's in-app browser. These are rendered public references, not implementation sources. All pricing, usage metrics, testimonials, product claims, and account actions remain unverified beyond their visible presentation.

## 1. Page inventory

| Reference | Routes inspected | Notes |
|---|---|---|
| Design prototype (primary UX) | `/`, `/features`, `/about`, `/pricing`, `/resources`, `/contact`, `/login`, `/forgot-password`, `/signup`; `/solutions/living-room-design`, `/solutions/virtual-staging`, `/solutions/living-room-scandinavian-design`, `/solutions/backyard-design`; five article routes listed below | Primary nav, footer routes, auth forms, four linked solutions, and all five resource cards were followed. No credentials, form submission, upload, or account action. |
| Development site (secondary content) | `/`, `/features`, `/about`, `/pricing`, `/resources`, `/contact` | Public nav and visible content inspected. Its `/features` displays a living-room solution page, unlike the general feature overview on the design site. |

Design article routes inspected: `/resources/visualize-a-renovation-before-you-build`, `/resources/virtual-staging-vs-traditional-staging`, `/resources/choosing-the-right-interior-style`, `/resources/ai-for-homeowners`, `/resources/design-trends`. Other solution URLs appeared as related links but their pages were not opened: `/solutions/kitchen-remodel-visualizer`, `/solutions/office-redesign`, `/solutions/retail-space-visualization`, `/solutions/property-visualization`, `/solutions/living-room-renovation`, `/solutions/garden-renovation`. They are **linked, not inspected**. No separate Privacy or Terms pages were exposed; those footer links resolve to `/contact` on both sites.

## 2. Navigation comparison

Both headers show the VastuNord wordmark and Features, About, Pricing, Resources, Contact, Sign In, plus a prominent orange action. The design prototype directs Sign In to `/login` and its main action to `/signup?next=/app/new`; its homepage start action goes to `/signup`. The development reference directs Sign In to `/contact` and its main visualizing/upload actions to `/pricing`.

Footer labels are similar, but destinations differ. The design footer links the four displayed solutions to their corresponding solution pages. Its Product links go to Features, Resources (labelled Examples), Features (Use Cases), and Pricing; Company links to About, Contact, Resources, and Login. Privacy and Terms both go to Contact. On the development reference, Living Room Design goes to `/features`, Virtual Staging, Backyard Design, Scandinavian Living Room, and Examples go to `/resources`; Use Cases goes to `/features`; Sign In and both legal links go to `/contact`. These mappings are visible inconsistencies, not verified routing intent.

## 3. Page-by-page comparison

| Page | Design prototype | Development reference | Difference and target direction |
|---|---|---|---|
| Home | “See What’s Possible.” transformation hero; story selector for interior/exterior/detail; transformation categories; possibility explorer; four-step workflow; audiences; metrics/testimonial; FAQ; CTA and grouped footer. | Nearly the same narrative and section sequence; carousel happened to show Exterior during inspection while design showed Interior. | Use the design page structure and interaction as primary; use developer copy only where content is corroborated. Treat displayed figures and placeholder testimonials as unverified and omit until substantiated. |
| Features | General capabilities page: photo-grounded visualization, style languages, comparisons, iteration, interior/exterior, boards; Explore/Compare/Decide cards; comparison; solutions. | `/features` is a living-room solution landing with the long-form solution template, not a capabilities overview. | Preserve the general feature overview as the target `/features`; consider the developer page content as a candidate solution article, not a replacement. Confirm route/content ownership. |
| About | Problem-led story, rationale, five-stage IDEA/VISUALIZE/COMPARE/REFINE/DECIDE, four-step workflow, audiences and CTA. | Closely matching story and order. | Design layout preferred; preserve consistent narrative after copy and claims review. |
| Pricing | Free and Pro cards, annual/monthly switch; annual displayed at €19/month, monthly at €24/month; FAQs and CTA. | Same visible plans and prices; toggle uses tab semantics. | Similar content; design visual control can guide layout. Plan availability, price, included credits, billing, and purchase routes require owner confirmation; no transaction tested. |
| Resources | Resource Center search and category filters, five linked articles, topic buttons and newsletter form. Selecting Renovation filter changed visible articles. | Similar heading/categories and five article teasers, topic area and newsletter. Cards were not exposed as links in the inspected accessibility tree. | Prefer design's observable linked-card/filter behavior. Verify article routes and newsletter destination before implementation. |
| Contact | Support/sales/partnership/feedback choices; Name, Email, Subject (Product Support default), Message, Send Message; FAQ and CTA. | Similar content/form; CTA routes to Pricing, while design routes to signup-oriented flow. | Reuse the design structure; submit only after service and privacy destination are defined. Form delivery unverified. |
| Auth | Design exposes Login, Forgot Password, and Signup forms with email/password fields and sign-up terms checkbox. | No login route surfaced; Sign In points to Contact. | Treat design forms as reference UI only; auth, recovery, terms/privacy destination and session behavior are unverified. |
| Solutions | Four linked routes inspected, using a shared long-form template: hero and empty live-preview shell; problem, possibility examples, use cases, benefits, four-step workflow, audiences, gallery, FAQs, related links, CTA. Empty preview action was disabled until an image is provided. | `/features` supplies a similar living-room narrative, but its CTA and related links route to `/pricing` or `/resources`, not corresponding solutions. | Use observed design solution template for those confirmed pages. Do not claim generation from the empty preview. Other linked solution routes remain uninspected. |
| Resource articles | Five articles inspected. Shared article structure: category/read-time, title and summary, sectioned text, related reading, CTA, footer. | Article detail pages were not exposed by accessible links in the inspected developer Resources view. | Design article layout is observed; content accuracy, authorship, dates and claim review remain open. |

## 4. Visual component inventory

- **Header:** white horizontal bar, dark navy wordmark/nav, orange primary action and sign-in link.
- **Hero:** large geometric sans heading, small uppercase letter-spaced kicker, short supporting copy and CTA. Homepage uses dark navy/teal imagery field with a large interior/exterior photograph and orange accent; hero content can change through the story selector/carousel.
- **Content sections:** alternating white and dark photographic/background areas; generous spacing; uppercase section labels; editorial headings; image-led examples.
- **Interactive components observed:** homepage story selector and previous/next controls; category tabs; before/after comparison slider; three-variation carousel; four-step cards; accordions; pricing billing switch; resource search and category filters; contact subject selector; auth password visibility control. Only visible local UI state changes were considered observed; backend behavior was not inferred.
- **Cards:** transformation examples, audience groups, feature/process cards, solution cards, pricing plans, resource articles and FAQs.
- **Footer:** wordmark/short positioning statement plus Solutions, Product, Company and Legal link groups.
- **Typography/color:** visually consistent across references: navy/teal, white, orange CTA accents, display headings and spaced small caps. Exact font render, color values and contrast ratios were not measured.

## 5. Branding observations

The supplied 36-page brand PDF is the authority. The existing visual review records approved logo treatments, six visible palette swatches and Zalando Sans Expanded typography; no hex codes were sampled. The marketing references appear directionally aligned in wordmark treatment, dark blue/teal and warm orange accents, spacious imagery-led composition, and expanded geometric headings. This is a visual comparison only; exact palette, typography file/rendering, image rights, and logo clear-space compliance have not been measured in these sites. Do not distribute licensed font files.

## 6. Recommended target design

1. Use the design prototype's homepage, general Features page, shared marketing shell, linked solution template, article layout, and visible interaction patterns as the visual direction.
2. Use development copy only where the same information is visible and consistent; document and resolve conflicting route destinations before implementing them.
3. Keep legal destinations explicit and real; the observed Privacy/Terms links to Contact are not acceptable evidence of actual legal content.
4. Treat pricing, plan details, metrics, testimonials and product capability claims as unverified until owner-approved. Do not model a live purchase or AI service from these pages.
5. Preserve the official brand PDF's identity and verify exact color/type against the source during implementation. Replace remote-reference imagery only with authorized assets from the owner library.

## 7. Open questions and owner actions

- Provide mobile screenshots or recordings at 390×844 (or 375×812) for the homepage, menu, Features, About, Pricing, Resources, Contact, one solution and one article. The available browser exposed desktop only and did not offer a durable repository screenshot export.
- Confirm whether the six linked but uninspected solution routes should be part of the MVP sitemap.
- Confirm approved prices, plan entitlements, metrics/testimonials, marketing claims, CTA destinations, and whether the preview is intentionally a mock/disabled shell.
- Provide actual Privacy and Terms destinations, contact form delivery requirements, and approved article copy/ownership.
- Provide authorized image-library URL/ID and rights/mapping before asset replacement.
- Confirm whether auth routes should exist in the marketing reference scope and identify the intended account flow.

## 8. Evidence and capture limitations

Inspection used the in-app browser's rendered page and accessibility view at desktop viewport 1280×720. Screens were visible in the session for both home pages and the two Resources indexes; the browser tool did not expose a durable project-local screenshot-save action. No screenshot file is claimed or included. Other route details were recorded from visible rendered content/accessibility trees. Mobile behavior, hidden states, source code, APIs, account flows, newsletter delivery, form submission, billing and generation remain unverified.

Manual screenshot checklist for owner: capture each route in the inventory at desktop and mobile; include homepage carousel/selector, comparison drag, feature method tabs, pricing annual and monthly, resource search and Renovation filter, contact subject selector, login password visibility, one solution empty preview, article body/footer, and open mobile navigation. Save URL and viewport with each image.

## Evidence references

- Design: [homepage](https://vastu-nord-design-prototype.vercel.app/), [features](https://vastu-nord-design-prototype.vercel.app/features), [about](https://vastu-nord-design-prototype.vercel.app/about), [pricing](https://vastu-nord-design-prototype.vercel.app/pricing), [resources](https://vastu-nord-design-prototype.vercel.app/resources), [contact](https://vastu-nord-design-prototype.vercel.app/contact), [login](https://vastu-nord-design-prototype.vercel.app/login), [signup](https://vastu-nord-design-prototype.vercel.app/signup), [forgot password](https://vastu-nord-design-prototype.vercel.app/forgot-password).
- Development: [homepage](https://vastunord.vercel.app/), [features](https://vastunord.vercel.app/features), [about](https://vastunord.vercel.app/about), [pricing](https://vastunord.vercel.app/pricing), [resources](https://vastunord.vercel.app/resources), [contact](https://vastunord.vercel.app/contact).
- Brand authority: `assets/brand/Brand Guidelines Document.pdf`; summary in `docs/REFERENCE_EVIDENCE.md` and `docs/SOURCE_REGISTER.md`.
- Related records: `docs/REFERENCE_EVIDENCE.md`, `docs/VISUAL_PARITY_MATRIX.md`.
