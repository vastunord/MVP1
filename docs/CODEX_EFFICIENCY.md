# Codex credit and context efficiency

**Do not use the 3,000+ word master as a repeated user prompt.** It's a stable reference file in Git. Use the 15 short task prompts instead.

- `AGENTS.md` is the permanent rule set (read once per session or automatic discovery).
- `docs/PROJECT_STATE.md` is the <1-page current handoff; keep it updated, not a full log.
- Read only docs relevant to the task, identified by prompt phase; never all 15 docs by default.
- Use targeted search by symbol/path; avoid full repository rescans and repeated UI-browser scraping unless code/UI changed.
- Split changes into one testable vertical slice; feature branch and small commits.
- Run focused tests during development, full CI at milestone boundaries.
- Use lower/default reasoning for routine formatting/refactor; reserve high effort for complex architecture, concurrent accounting, auth and security depending on currently available Codex model settings.
- Use static mock/test fixtures only in development; mark as DEMO, not production.
- Budget model/API operations, use batching/caching for editorial jobs when appropriate, avoid calling two reasoning models automatically for one answer.
- Never reduce credits by skipping security, permissions, source-rights checks or core tests.
- Prefer three response items: completed / tests / blockers-next.
