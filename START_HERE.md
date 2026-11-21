# START HERE — Greenfield Vastu Nord (v3.3)

You have a planning folder already at `C:\Users\VN\Documents\ChatGPT\VastuNord`. The owner **does not have the former teams' GitHub or Vercel access**. This is expected and no longer a failed preflight.

## 1. Put files in the correct place
- Extract the upgrade ZIP into the **existing** VastuNord root, not into another `VastuNord` child folder.
- Confirm `AGENTS.md`, `MASTER_CODEX_PROMPT.md`, `docs/PROJECT_STATE.md`, `docs/GREENFIELD_OVERRIDE.md`, `prompts/00-SAFE_WORKSPACE_AND_REFERENCES.md`, and the brand PDF are accessible.
- **Do not overwrite `docs/PROJECT_STATE.md` or `docs/CHANGELOG.md`**; the upgrade does not include them.

## 2. Create your private GitHub repository through the Vastu Nord owner account
- Use `vastunord@gmail.com` (or the GitHub identity the company controls).
- Create PRIVATE, empty repo, suggested name **`vastunord-platform`**. Do **not** auto-initialize with a README, license or `.gitignore` because local documents already exist.
- Copy the actual remote URL, such as `https://github.com/<VASTUNORD_ACCOUNT>/vastunord-platform.git`. Do not invent the account name.
- Do not create the Vercel website project yet; Codex should first scaffold a buildable application in the new repository. Cloud resources are provisioned only at the relevant phase.

## 3. Open one Codex project and run exactly one task
Open the existing VastuNord folder, make sure the NRide project is **not** selected, choose **Low** reasoning and paste:

```text
VASTU NORD ONLY. The original designers/developers handed over ONLY public website links, not GitHub, Vercel, design source, backend or credentials. This is an approved GREENFIELD reconstruction in a NEW business-owned repository. Read AGENTS.md, docs/GREENFIELD_OVERRIDE.md, docs/PROJECT_STATE.md, docs/PHASE00_STATE_RECONCILIATION.md, and prompts/00-SAFE_WORKSPACE_AND_REFERENCES.md. Do not re-run the previous Phase 00 audit. Reconcile its recorded findings: no .git is expected, and the old team's cloud IDs are not required. Check the actual folder and any local sensitive files. Prepare the new Git repository safely, without touching global settings or NRide. If the exact new private GitHub remote URL and authorization are available, initialize/link/push only as permitted. Validate the three reference URLs using capabilities that actually work, record evidence or inaccessible status. Review the 36-page brand PDF visually where tools allow. Update existing PROJECT_STATE.md and CHANGELOG.md in place. Report what I must do in GitHub, confirmed current state, gate status, and next step. Phase 00 only; no features or production changes.
```

## 4. Then Phase 01
After Phase 00 PASS, select **Medium** reasoning and use `prompts/01-DESIGN_AUDIT_AND_STUDIO_PARITY.md`. Collect screenshots or screen recordings if the URLs cannot be inspected in Codex. Do not start implementing the Studio before making the feature/tool inventory.

## 5. Continue
Each new session reads only AGENTS + PROJECT_STATE + current phase + required docs. Normal feature work Medium; basic docs Low; security, ledger and complex AI failures High **only if needed**. See `docs/MODEL_EFFORT_MATRIX.md`.
