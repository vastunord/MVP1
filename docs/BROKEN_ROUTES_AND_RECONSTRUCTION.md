# Broken routes and reconstruction decisions — Phase 01E-C

**Scope:** Six linked design-reference solution routes observed in the public prototype. The routes returned a branded 404 on desktop; route names alone do not establish original copy, imagery, claims, or functionality. No candidate developer-site paths were guessed.

| Exact route | Observed status | Intended subject (route-name inference only) | Available supporting requirements | Recommendation | Priority / owner decision |
|---|---|---|---|---|---|
| `/solutions/kitchen-remodel-visualizer` | Branded custom 404; one fresh-tab retry also returned 404 | Kitchen remodel visualization | Shared solution-page pattern is visible on four other solution pages; Studio includes Room Reimagination and Material Refinement tools. Neither supplies this page’s original copy or claims. | Remove or suppress the broken public link until an owner-approved brief exists; then decide whether to build. Do not redirect to a guessed destination. | P1 before public launch; owner decides build vs permanent removal and approves claims/assets. |
| `/solutions/office-redesign` | Branded custom 404 | Office redesign | Shared solution-page pattern; Studio has Room Reimagination and Furniture Refresh. Specific office content is unavailable. | Remove or suppress the broken public link pending an approved brief; then decide whether to build. | P1 before public launch; owner decision and content/assets required. |
| `/solutions/retail-space-visualization` | Branded custom 404 | Retail-space visualization | Shared solution-page pattern only; no matching specific Studio workflow or original page content was verified. | Remove or suppress the broken public link pending an approved brief; then decide whether to build. | P1 before public launch; owner decision and product-scope confirmation required. |
| `/solutions/property-visualization` | Branded custom 404 | Property visualization | Shared solution-page pattern and general marketing references; exact audience, content and capability claims unavailable. | Remove or suppress the broken public link pending an approved brief; then decide whether to build. | P1 before public launch; owner decision and claims/assets required. |
| `/solutions/living-room-renovation` | Branded custom 404 | Living-room renovation | Shared solution-page pattern; accessible living-room design and renovation articles provide adjacent editorial context, not original route content. | Remove or suppress the broken public link pending an approved brief; then decide whether to build. | P1 before public launch; owner decides whether it duplicates `/solutions/living-room-design`. |
| `/solutions/garden-renovation` | Branded custom 404 | Garden renovation | Shared solution-page pattern; Studio includes Garden Design and Outdoor Visualization. Original page copy, media and claims remain unavailable. | Remove or suppress the broken public link pending an approved brief; then decide whether to build. | P1 before public launch; owner decides whether it duplicates `/solutions/backyard-design`. |

## Verified fallback

Each route displayed the shared header/footer, “This space doesn't exist — yet.” fallback copy, and a “Back to home” link. Page-specific headings, sections, media, interactions and testimonials were **NOT ACCESSIBLE**. Prices and capability claims were **NOT PRESENT** on the fallback. The development reference had no corresponding route exposed in its inspected navigation; alternate URLs are **NOT TESTED**.

## Reconstruction rule

Do not reproduce original content from the slugs. For each route, require an owner decision on build/redirect/permanent removal, an approved brief, substantiated claims, authorized media, and a confirmed CTA destination. Any redirect requires an explicit, semantically valid target. Until then, remove the broken link or keep it unpublished. Evidence details are in `docs/MARKETING_REFERENCE_COMPARISON.md` and `docs/REFERENCE_EVIDENCE.md`.
