# AI operations and worker system

## Pipeline

1. Browser sends task intent and selected authorized assets.
2. Backend verifies identity, ownership, input type, quota and moderation prerequisites.
3. Model/capability registry selects compatible, approved endpoint and deterministic credit price.
4. Transaction reserves credits while recording idempotent `RenderJob` and request ID.
5. Durable queue routes to an image or video worker; provider primary/backup failover only when capability/quality comparable.
6. Worker stores originals/output securely and writes audit metadata and actual provider cost.
7. On success settle credit; on unchargeable failure release/rescind; duplicate callbacks must not double charge.
8. User sees real status via SSE/polling and can navigate away without canceling the job.
9. If relevant, contextual education is selected independently from approved Payload knowledge.
10. After save/private, user may separately initiate gallery/social review flows.

**Provider selection:** Historical old prompt chooses Azure AI Foundry with Azure OpenAI primary and backup deployments. Verify image/video support, locations, latency, safety capabilities and current prices. Never substitute a prohibited external plugin or invent working video generation. If necessary, seek approval for different official provider API; keep interface future-ready without false claims.

**Model-use economy:** lightweight deterministic logic or cached search where possible; low-cost model for tagging and content summaries; more capable reasoning only when justified; image/video endpoints for generative media. Use per-job cost caps, global daily caps, scheduled workloads and output quality evaluation. Avoid repeated same-context prompting.
