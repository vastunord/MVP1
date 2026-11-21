# Vastu Nord architectural decisions

Record only significant decisions. One entry: ID, date, status (`proposed/accepted/rejected/superseded`), evidence, alternatives, impact, dependencies and test/approval. For large decisions use a file under `docs/adr/`.

| ID | Date | Decision | Status | Rationale / link |
|---|---|---|---|---|
| D-001 | 2026-11-21 | Architecture-first, separate Vastu Nord resources from existing Codex business | Proposed pending setup | Owner instruction; resource isolation |
| D-002 | 2026-11-21 | Every user-generated asset private until independent explicit publication consent | Proposed pending legal/product approval | Privacy and consent protection |

## Historical ADR v3.1 — SUPERSEDED (not to execute)

**Decision:** Keep Payload, hosted as an independent Vercel app with isolated Neon CMS DB and object storage; adopt Postiz Cloud (not self-hosted) for authorized Pinterest and YouTube distribution. **Reason:** no locally hosted production systems, fewer operations dependencies, human-gated editorial publishing and maintained separation from the other business. **Consequence:** one additional Vercel project, one paid Postiz cloud subscription, vendor API dependency and separate consent/approval gates. **Alternative rejected now:** direct Pinterest/YouTube integration as the initial launch requirement. Status: SUPERSEDED BY v3.2; do not implement, subscribe, or create this service.


### ADR v3.2 — Independent ownership and deferred Postiz (supersedes v3.1)
**Decision:** Two independent vendor accounts and all resources for NRide and Vastu Nord; one unrelated Codex developer account for both codebases. Vastu Nord Payload stays cloud-hosted on its own Vercel/Neon. Postiz is NOT active; manually post via brand-owned native social services after separate consent/editorial approval. Future `SocialPublisherAdapter` remains disabled until authorized. **Reason:** hard operational isolation, avoid extra subscription now, preserve option to automate later. **Status:** APPROVED TARGET DESIGN, NOT IMPLEMENTED. Earlier v3.1 Postiz decision is superseded.
