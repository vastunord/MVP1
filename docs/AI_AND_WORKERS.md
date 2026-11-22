# AI and workers

## Implemented provider paths

Prana and Studio’s brief improvement use the same Groq server credential. The Groq chat API returns a structured domain classification and up to three short sentences. The app returns a localized redirect for abusive, unrelated and unsafe questions. Only the text the visitor submits and public guidance enter a consultation. Visitors explicitly accept a suggested brief before it replaces their text. Groq sets usage limits. [Groq structured outputs](https://console.groq.com/docs/structured-outputs)

Studio submits to MNML v2 only for an authenticated user with an authorized project and explicit image-processing consent. The job stores an idempotency key, input references, provider job ID and private output metadata. Prana V1 is the interface label for the five render levels. MNML account limits apply. Fulfilment requires the render migration and appropriate table access. [MNML API](https://developers.mnml.ai/docs) · [Configuration](ENVIRONMENT_VARIABLE_INVENTORY.md)

## Earlier architecture and remaining worker requirements

Azure AI Foundry / Azure OpenAI is the recorded preference; primary/backup require owner-approved deployments. No account, model entitlement, region, quota or credential verified. [Official model availability](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/concepts/models-sold-directly-by-azure) is not proof of owner access. Choose models only after capability, quality, retention and cost checks.

ImageProvider/VideoProvider expose configured capabilities, submit, getStatus, cancel where supported and normalizeOutput. TextProvider serves Prana separately. Immutable requests contain job/idempotency IDs, authorized inputs and config/prompt version. Persist provider request ID, result metadata and actual cost evidence. Map all 17 tools to required editing/reference/mask/output capabilities; disable unsupported combinations before reserving credits.

Recommend Vercel Workflow steps in apps/web as durable workers, avoiding a separate operated queue/fleet. The [official Workflow repository](https://github.com/vercel/workflow) documents durable execution; current plan limits, region, retention and billing need verification. Async provider operations use delayed polling/callbacks, never a continuously open browser request.

## Lifecycle and failure rules

States: queued → submitting → running → validating-output → succeeded; alternatives failed, cancel-requested, cancelled, reconciling.

1. Validate permissions, private assets, capability, moderation, budget and quote; commit job, credit reservation and dispatch outbox atomically.
2. Dispatcher leases outbox and starts workflow keyed by job ID. Periodic reconciliation recovers missing dispatch; DB uniqueness prevents duplicate active attempts.
3. Worker records attempt and submits; persist provider request ID and poll/verify callbacks.
4. Timeout after possible acceptance enters reconciling. Use provider idempotency/status where available; never blindly resubmit/fail over and double-charge.
5. Validate/store private output, then atomically commit version, success and one credit settlement. Cleanup reconciles orphan objects.
6. Definitive unchargeable failure releases once. Transient retry has bounded backoff/jitter; exhausted/ambiguous jobs require operator review. Browser closure does not cancel work.
7. Poll persisted app status initially; optional SSE later. No synthetic percentages.

Reconciler/operator recovery is required before paid generation. Failover requires compatible capability, approved transfer and evidence prior attempt will not execute. Never fail over to evade moderation. Set per-job/workspace/day/deployment cost and concurrency caps; record provider spend separately from credits. Video remains disabled until real tests pass.

Keep media/prompts out of workflow logs; pass IDs/minimal metadata. Confirm processor retention, training-use policy and region before enabling private uploads. No training consent inferred. Prana is read-only initially, retrieves approved content and caller-authorized projects, treats retrieved instructions as untrusted, and needs retention/safety evaluation.

Tests later: reserve/dispatch crash, stale leases, ambiguous provider timeout, duplicate callback/settlement, cancellation race, storage failure, capability rejection, rate/cost caps, log redaction, recovery and image/video quality. No real API call performed.
