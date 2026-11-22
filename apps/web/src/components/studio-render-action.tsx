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
type Props = {
  tool: ToolDefinition;
  values: BriefValues;
  engine: RenderEngine;
  prompt: string;
  avoid: string;
  locale: Locale;
  enabled: boolean;
  workflow: StudioWorkflow;
  videoEnabled: boolean;
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
  selection,
  onResult,
  workflow,
  videoEnabled,
}: Props) {
  const en = locale === "en";
  const [consent, setConsent] = useState(false);
  const [job, setJob] = useState<RenderStatus | null>(null);
  const [history, setHistory] = useState<RenderStatus[]>([]);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const requestKey = useRef({ id: "", body: "" });
  const submitting = useRef(false);
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
    consent &&
    projectId &&
    (workflow === "concept"
      ? Boolean(prompt.trim())
      : Boolean(selection.sourceAssetId)) &&
    (workflow !== "style" || selection.referenceIds.length > 0) &&
    (workflow !== "video" || videoEnabled) &&
    (!needsLocation || prompt.trim()) &&
    !unsupportedMode;
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
          setJob(result);
          onResult(renderResult(result));
        } else {
          wait = Math.min(15000, Math.round(wait * 1.4));
          timer = setTimeout(poll, wait);
        }
      } catch {
        if (!abort.signal.aborted)
          setError(
            en ? "Could not check this render." : "Kunne ikke hente status.",
          );
      }
    }
    timer = setTimeout(poll, wait);
    return () => {
      clearTimeout(timer);
      abort.abort();
    };
  }, [job, projectId, enabled, en, onResult, resync]);
  async function start() {
    if (!ready || submitting.current) return;
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
      if (!response.ok) {
        setError(
          response.status === 429
            ? en
              ? "The daily render limit has been reached."
              : "Dagens rendergrense er nådd."
            : en
              ? "Could not submit this render. Retry the same brief or check project renders."
              : "Kunne ikke sende oppdraget. Prøv samme beskrivelse på nytt eller sjekk prosjektrendere.",
        );
        return;
      }
      const result: RenderStatus = await response.json();
      setJob(result);
      onResult(null);
      if (result.outputAssetId) onResult(renderResult(result));
    } catch {
      setError(
        en
          ? "Connection interrupted. Retry the same brief."
          : "Tilkoblingen ble avbrutt. Prøv samme beskrivelse på nytt.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
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
        {!enabled
          ? en
            ? "Rendering is closed in this demo."
            : "Rendring er stengt i denne demoen."
          : unsupportedMode
            ? en
              ? "Choose automatic enhancement without a written brief, or describe an object edit without a brush mask."
              : "Velg automatisk forbedring uten beskrivelse, eller beskriv en endring uten penselmaske."
            : workflow === "video" && !videoEnabled
              ? en
                ? "Video requires a separate development allowance."
                : "Video krever en egen utviklingskvote."
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
      {enabled && job?.state === "SUCCEEDED" && job.outputAssetId && <AssetSharingConsent key={job.outputAssetId} assetId={job.outputAssetId} locale={locale} />}
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
      {enabled && projectId && (
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
                setJob(row);
                setError("");
                onResult(renderResult(row));
              }}
            >
              {statuses[row.state]} · {row.id.slice(0, 8)}
            </button>
          ))}
        </details>
      )}
    </div>
  );
}
