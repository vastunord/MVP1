"use client";
import { AssetSharingConsent } from "./asset-sharing-consent";
import { useEffect, useRef, useState } from "react";
import { primaryAction, type ToolDefinition } from "@vastunord/contracts/tools";
import type {
  BriefValues,
  RenderEngine,
  RenderSelection,
  RenderStatus,
  StudioResult,
  StudioWorkflow,
} from "@/lib/studio-render";
import type { Locale } from "@/lib/i18n";

const endpoint = "/api/studio/renders";
const jobIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function recoveryKey(projectId: string, toolId: string) {
  return `vn-render-recovery:${projectId}:${toolId}`;
}
function rememberJob(projectId: string, toolId: string, row: RenderStatus) {
  try {
    const key = recoveryKey(projectId, toolId);
    if ((row.state === "RUNNING" || row.state === "QUEUED") && !row.waitingForSubmission && jobIdPattern.test(row.id))
      sessionStorage.setItem(key, row.id);
    else if (sessionStorage.getItem(key) === row.id) sessionStorage.removeItem(key);
  } catch { /* Recovery is optional if browser storage is unavailable. */ }
}
type Props = {
  tool: ToolDefinition;
  values: BriefValues;
  engine: RenderEngine;
  prompt: string;
  avoid: string;
  locale: Locale;
  enabled: boolean;
  submissionEnabled: boolean;
  workflow: StudioWorkflow;
  selection: RenderSelection;
  onResult: (asset: StudioResult | null) => void;
};
function renderResult(row: RenderStatus): StudioResult | null {
  return row.outputAssetId
    ? { source: row.sourceAssetId, output: row.outputAssetId, media: row.media }
    : null;
}
export function StudioRenderAction({
  tool,
  values,
  engine,
  prompt,
  avoid,
  locale,
  enabled,
  submissionEnabled,
  selection,
  onResult,
  workflow,
}: Props) {
  const en = locale === "en";
  const [consent, setConsent] = useState(false);
  const [job, setJob] = useState<RenderStatus | null>(null);
  const [history, setHistory] = useState<RenderStatus[]>([]);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const requestKey = useRef({ id: "", body: "" });
  const submitting = useRef(false);
  const recoveryAbort = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);
  const [resync, setResync] = useState(0);
  const projectId = selection.projectId;
  const needsLocation = [
    "object-placement",
    "visual-cleanup",
    "perspective-correction",
  ].includes(tool.id);
  const unsupportedMode =
    (tool.id === "visual-cleanup" && values.mode === "Brush & delete") ||
    (tool.id === "resolution-enhancement" &&
      (values.mode === "Manual controls" || !!prompt || !!avoid));
  const ready =
    enabled &&
    submissionEnabled &&
    consent &&
    projectId &&
    (workflow === "concept"
      ? Boolean(prompt.trim())
      : Boolean(selection.sourceAssetId)) &&
    (workflow !== "style" || selection.referenceIds.length > 0) &&
    (!needsLocation || prompt.trim()) &&
    !unsupportedMode;
  useEffect(() => {
    if (!enabled || !projectId) return;
    let id: string | null = null;
    try { id = sessionStorage.getItem(recoveryKey(projectId, tool.id)); } catch { return; }
    if (!id || !jobIdPattern.test(id)) return;
    const abort = new AbortController();
    recoveryAbort.current = abort;
    async function recover() {
      try {
        const response = await fetch(endpoint + "?" + new URLSearchParams({ projectId, toolId: tool.id, id: id! }), { signal: abort.signal });
        if (!response.ok) return;
        const rows: unknown = await response.json();
        if (abort.signal.aborted || !Array.isArray(rows)) return;
        const row = rows.find((item: RenderStatus) => item.id === id && item.toolId === tool.id) as RenderStatus | undefined;
        if (!row) {
          try { if (sessionStorage.getItem(recoveryKey(projectId, tool.id)) === id) sessionStorage.removeItem(recoveryKey(projectId, tool.id)); } catch { /* Optional storage. */ }
          return;
        }
        // History is authenticated and scoped to this project; never submit here.
        rememberJob(projectId, tool.id, row);
        setJob(row);
        onResult(renderResult(row));
      } catch { /* Leave the pointer for a later retry; history remains available. */ }
    }
    void recover();
    return () => { abort.abort(); if (recoveryAbort.current === abort) recoveryAbort.current = null; };
  }, [enabled, projectId, tool.id, onResult]);
  useEffect(() => {
    if (
      !job ||
      !projectId ||
      !enabled ||
      ["SUCCEEDED", "FAILED", "CANCELLED"].includes(job.state) ||
      job.waitingForSubmission
    )
      return;
    const abort = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let wait = job.media === "video" ? 15000 : 3000;
    async function poll() {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "status", id: job!.id, projectId }),
          signal: abort.signal,
        });
        if (!response.ok) throw Error();
        const result: RenderStatus = await response.json();
        if (abort.signal.aborted) return;
        if (
          result.state === "SUCCEEDED" ||
          result.state === "FAILED" ||
          result.state === "CANCELLED"
        ) {
          rememberJob(projectId, tool.id, result);
          setJob(result);
          onResult(renderResult(result));
        } else {
          wait = Math.min(15000, Math.round(wait * 1.4));
          timer = setTimeout(poll, wait);
        }
      } catch {
        if (!abort.signal.aborted)
          setError(
            en
              ? "Could not check or save this result. Check again to retry the same job; this does not start another render."
              : "Kunne ikke sjekke eller lagre dette resultatet. Sjekk på nytt for å prøve samme jobb igjen; det starter ikke en ny rendring.",
          );
      }
    }
    timer = setTimeout(poll, wait);
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  }, [job, projectId, enabled, en, onResult, resync, tool.id]);
  async function start() {
    if (!ready || submitting.current) return;
    recoveryAbort.current?.abort();
    submitting.current = true;
    setBusy(true);
    setError("");
    const payload = {
      ...selection,
      sourceAssetId: workflow === "concept" ? null : selection.sourceAssetId,
      referenceIds:
        workflow === "video" || workflow === "concept"
          ? []
          : selection.referenceIds,
      workflow,
      toolId: tool.id,
      values,
      engine,
      prompt,
      avoid,
      consent,
    };
    const fingerprint = JSON.stringify(payload);
    if (
      requestKey.current.body !== fingerprint ||
      job?.state === "SUCCEEDED" ||
      job?.state === "FAILED" ||
      job?.state === "CANCELLED"
    )
      requestKey.current = { body: fingerprint, id: crypto.randomUUID() };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id: requestKey.current.id }),
      });
      // A project switch remounts this action. The accepted server-side job
      // remains in its original project; do not move its result to the new UI.
      if (!mounted.current) return;
      if (!response.ok) {
        setError(
          response.status === 402
            ? en
              ? "The rendering provider requires available funds."
              : "Rendertjenesten krever tilgjengelige midler."
            : response.status === 403
              ? en
                ? "This operation is unavailable on the rendering account."
                : "Rendertjenestens konto gir ikke tilgang til denne operasjonen."
              : response.status === 429
                ? en
                  ? "The rendering provider is at a usage limit. Check your project renders before retrying."
                  : "Rendertjenesten har nådd en bruksgrense. Sjekk prosjektrendere før du prøver igjen."
                : en
                  ? "Could not submit this render. Retry the same brief or check project renders."
                  : "Kunne ikke sende oppdraget. Prøv samme beskrivelse på nytt eller sjekk prosjektrendere.",
        );
        return;
      }
      const result: RenderStatus = await response.json();
      if (!mounted.current) return;
      rememberJob(projectId, tool.id, result);
      setJob(result);
      onResult(null);
      if (result.outputAssetId) onResult(renderResult(result));
    } catch {
      if (!mounted.current) return;
      setError(
        en
          ? "Connection interrupted. Retry the same brief."
          : "Tilkoblingen ble avbrutt. Prøv samme beskrivelse på nytt.",
      );
    } finally {
      submitting.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  async function list() {
    try {
      const r = await fetch(
        endpoint + "?" + new URLSearchParams({ projectId, toolId: tool.id }),
      );
      if (!r.ok) throw Error();
      const rows: RenderStatus[] = await r.json();
      setHistory(rows);
      setError(
        rows.length
          ? ""
          : en
            ? "No previous renders."
            : "Ingen tidligere rendere.",
      );
    } catch {
      setError(
        en
          ? "Could not load project renders."
          : "Kunne ikke laste tidligere rendere.",
      );
    }
  }
  const waiting =
    job &&
    !["SUCCEEDED", "FAILED", "CANCELLED"].includes(job.state) &&
    !job.waitingForSubmission;
  const statuses = {
    QUEUED: en ? "Queued" : "I kø",
    RUNNING: en ? "Rendering" : "Rendrer",
    SUCCEEDED: en ? "Saved to the project" : "Lagret i prosjektet",
    FAILED: en ? "Render failed" : "Rendring mislyktes",
    CANCELLED: en ? "Cancelled" : "Avbrutt",
  };
  return (
    <div className="primary-action">
      {enabled && (
        <label className="render-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          {en
            ? "Send this photo, selected references and brief to MNML for processing."
            : "Send bildet, valgte referanser og beskrivelsen til MNML for behandling."}
        </label>
      )}
      <button
        type="button"
        className="button primary"
        disabled={!ready || busy || Boolean(waiting)}
        onClick={start}
        aria-describedby="action-help"
      >
        {workflow === "video"
          ? en
            ? "Generate walkthrough"
            : "Generer videovandring"
          : workflow === "upscale"
            ? en
              ? "Upscale image"
              : "Oppskaler bilde"
            : tool.id === "room-reimagination" && !en
              ? "Generer rom"
              : primaryAction(tool, values)}
      </button>
      <p id="action-help">
        {!enabled || !submissionEnabled
          ? en
            ? "Rendering is unavailable in this environment."
            : "Rendring er utilgjengelig i dette miljøet."
          : unsupportedMode
            ? en
              ? "Choose automatic enhancement without a written brief, or describe an object edit without a brush mask."
              : "Velg automatisk forbedring uten beskrivelse, eller beskriv en endring uten penselmaske."
            : workflow === "concept" && !prompt.trim()
              ? en
                ? "Describe the scene to create."
                : "Beskriv motivet du vil lage."
              : workflow === "style" && !selection.referenceIds.length
                ? en
                  ? "Select a project image as style reference."
                  : "Velg et prosjektbilde som stilreferanse."
                : workflow !== "concept" && !selection.sourceAssetId
                  ? en
                    ? "Choose a saved private project image."
                    : "Velg et lagret privat prosjektbilde."
                  : needsLocation && !prompt.trim()
                    ? en
                      ? "Describe the object or area and the change you want."
                      : "Beskriv området og ønsket endring."
                    : ""}
      </p>
      {job && <p role="status">{statuses[job.state]}</p>}
      {job?.waitingForSubmission && <p role="status">{en
        ? "Submission is not confirmed. This job will not be submitted automatically; check your project history before starting another."
        : "Innsendingen er ikke bekreftet. Denne jobben sendes ikke automatisk; sjekk prosjekthistorikken før du starter en ny."}</p>}
      {enabled && job?.state === "SUCCEEDED" && job.outputAssetId && (
        <AssetSharingConsent
          key={job.outputAssetId}
          assetId={job.outputAssetId}
          locale={locale}
        />
      )}
      {error && <p role="status">{error}</p>}
      {waiting && error && (
        <button
          type="button"
          onClick={() => {
            setError("");
            setResync((i) => i + 1);
          }}
        >
          {en ? "Check again" : "Sjekk på nytt"}
        </button>
      )}
      {enabled && projectId && <>
        <p className="inspector-help">{en
          ? "To revisit or check an existing job, open Project renders and select it. This does not start a new render."
          : "For å åpne eller sjekke en eksisterende jobb, åpne Prosjektrendere og velg den. Dette starter ikke en ny rendring."}</p>
        <details
          className="render-history"
          onToggle={(e) => {
            if (e.currentTarget.open) void list();
          }}
        >
          <summary>{en ? "Project renders" : "Prosjektrendere"}</summary>
          {history.map((row) => (
            <button
              key={row.id}
              type="button"
              onClick={() => {
                recoveryAbort.current?.abort();
                rememberJob(projectId, tool.id, row);
                setJob(row);
                setError("");
                onResult(renderResult(row));
              }}
            >
              {statuses[row.state]} · {row.id.slice(0, 8)}
            </button>
          ))}
        </details>
      </>}
    </div>
  );
}
