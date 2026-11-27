"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  visibleControls,
  type ToolDefinition,
  type Control,
} from "@vastunord/contracts/tools";
import { messages, type Locale } from "@/lib/i18n";
import {
  studioSampleHref,
  translated,
  type StudioSample,
} from "@/lib/workspace-catalog";
import { Button } from "./ui";
import { PrivateUpload, RoomReferences } from "./private-upload";
import { RoomSettings, roomLabel } from "./room-settings";
import { StudioCanvas } from "./studio-canvas";
import { StudioChoices } from "./studio-choices";
import { StudioPrompt } from "./studio-prompt";
import { StudioToolSwitcher } from "./studio-tool-switcher";
import { StudioRenderAction } from "./studio-render-action";
import { mayaDraftKey, readMayaDraft, type MayaDraft } from "@/lib/maya-drafts";
import {
  renderEngines,
  mayaExperience,
  mayaExperiences,
  renderMode,
  sceneWorkflows,
  supportedWorkflows,
  unsupportedStudioOption,
  type StudioWorkflow,
  type StudioResult,
  type RenderEngine,
  type RenderSelection,
} from "@/lib/studio-render";
import "./studio-tools.css";
function Field({
  control,
  value,
  onChange,
  locale,
  toolId,
}: {
  control: Control;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
  locale: Locale;
  toolId: string;
}) {
  const id = "option-" + control.id;
  const text = (label: string) => roomLabel(label, locale);
  if (["preview", "guides"].includes(control.id))
    return (
      <div className="field">
        <label htmlFor={id}>
          <input id={id} type="checkbox" disabled checked={value === true} readOnly />
          {text(control.label)}
        </label>
        <span className="small">{locale === "en" ? "This preview control is not available yet." : "Denne forhåndsvisningen er ikke tilgjengelig ennå."}</span>
      </div>
    );
  if (control.kind === "action")
    return <Button disabled>{control.label}</Button>;
  if (control.kind === "toggle" && typeof value === "boolean")
    return (
      <label className="check" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {text(control.label)}
      </label>
    );
  if (control.kind === "range")
    return (
      <div className="field">
        <label htmlFor={id}>
          {control.label}{" "}
          <output htmlFor={id}>
            {value}
            {control.unit}
          </output>
        </label>
        <input
          id={id}
          disabled={control.min === undefined || control.max === undefined}
          type={control.min === undefined ? "number" : "range"}
          min={control.min}
          max={control.max}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => {
            if (e.target.value !== "") onChange(Number(e.target.value));
          }}
        />
        {control.min === undefined && (
          <span className="small">
            {locale === "en" ? "This adjustment is not available yet." : "Denne justeringen er ikke tilgjengelig ennå."}
          </span>
        )}
      </div>
    );
  const options =
    control.kind === "toggle" ? ["On", "Off"] : (control.options ?? []);
  return (
    <StudioChoices
      label={text(control.label)}
      value={String(
        typeof value === "boolean" ? (value ? "On" : "Off") : (value ?? ""),
      )}
      kind={
        [
          "room",
          "style",
          "time",
          "lighting",
          "medium",
          "camera",
          "viewpoint",
        ].includes(control.id)
          ? control.id
          : "compact"
      }
      choices={options.map((v) => ({
        value: v,
        label: text(v) + (unsupportedStudioOption(toolId, control.id, v) ? (locale === "en" ? " (unavailable)" : " (utilgjengelig)") : ""),
        disabled: unsupportedStudioOption(toolId, control.id, v),
      }))}
      onChange={(v) => onChange(control.kind === "toggle" ? v === "On" : v)}
    />
  );
}
export function Editor({
  tool,
  locale,
  uploadsEnabled,
  renderEnabled,
  submissionEnabled,
  improveEnabled,
  sample,
  userId,
}: {
  tool: ToolDefinition;
  locale: Locale;
  uploadsEnabled: boolean;
  renderEnabled: boolean;
  submissionEnabled: boolean;
  improveEnabled: boolean;
  sample?: StudioSample;
  userId?: string;
}) {
  const t = messages(locale);
  const [values, setValues] = useState<
    Record<string, string | number | boolean>
  >(() =>
    Object.fromEntries(
      tool.controls
        .filter((c) => c.defaultValue !== undefined)
        .map((c) => [c.id, c.defaultValue!]),
    ),
  );
  const [prompt, setPrompt] = useState("");
  const [avoid, setAvoid] = useState("");
  const [engine, setEngine] = useState<RenderEngine>("fast");
  const [selection, setSelection] = useState<RenderSelection>({
    projectId: "",
    sourceAssetId: "",
    referenceIds: [],
  });
  const [result, setResult] = useState<StudioResult | null>(null);
  const [workflow, setWorkflow] = useState<StudioWorkflow>("design");
  const [preview, setPreview] = useState("");
  const [draftNotice, setDraftNotice] = useState(false);
  const [draftRecovered, setDraftRecovered] = useState(false);
  const english = locale === "en";
  const draftKey = userId ? mayaDraftKey(userId, selection.projectId, tool.id) : "";
  const activeDraft = useRef("");
  const latestDraft = useRef<MayaDraft | null>(null);
  const previousDraft = useRef<{ key: string; value: MayaDraft } | null>(null);
  useEffect(() => {
    latestDraft.current = { version: 1, values, prompt, avoid, engine, workflow };
  }, [values, prompt, avoid, engine, workflow]);
  useEffect(() => {
    if (!draftKey) return;
    let active = true;
    activeDraft.current = "";
    queueMicrotask(() => {
      if (!active) return;
      let draft: MayaDraft | null = null;
      try {
        const raw = sessionStorage.getItem(draftKey);
        if (raw) {
          draft = readMayaDraft(raw, tool);
          if (!draft) { sessionStorage.removeItem(draftKey); setDraftNotice(true); }
        }
      } catch { /* Draft storage is optional. */ }
      if (!draft && userId && selection.projectId && previousDraft.current?.key === mayaDraftKey(userId, "", tool.id)) draft = previousDraft.current.value;
      if (draft) {
        setValues(draft.values); setPrompt(draft.prompt); setAvoid(draft.avoid);
        setEngine(draft.engine); setWorkflow(draft.workflow); setDraftRecovered(true);
      } else {
        setValues(Object.fromEntries(tool.controls.filter((c) => c.defaultValue !== undefined).map((c) => [c.id, c.defaultValue!])));
        setPrompt(""); setAvoid(""); setEngine("fast"); setWorkflow("design"); setDraftRecovered(false);
      }
      activeDraft.current = draftKey;
    });
    return () => {
      active = false;
      if (activeDraft.current === draftKey && latestDraft.current) {
        previousDraft.current = { key: draftKey, value: latestDraft.current };
        try { sessionStorage.setItem(draftKey, JSON.stringify(latestDraft.current)); } catch { /* Optional storage. */ }
      }
      activeDraft.current = "";
    };
  }, [draftKey, tool, userId, selection.projectId]);
  useEffect(() => {
    if (!draftKey || activeDraft.current !== draftKey) return;
    const timer = setTimeout(() => {
      if (activeDraft.current === draftKey && latestDraft.current) {
        try { sessionStorage.setItem(draftKey, JSON.stringify(latestDraft.current)); } catch { /* Optional storage. */ }
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [draftKey, values, prompt, avoid, engine, workflow]);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        if (!userId && sessionStorage.getItem("vn-unsaved-editor-settings") === "yes") {
          sessionStorage.removeItem("vn-unsaved-editor-settings");
          setDraftNotice(true);
        }
      } catch { /* Optional notice only. */ }
    });
    return () => { active = false; };
  }, [userId]);
  const room = tool.id === "room-reimagination";
  const enhance = tool.id === "resolution-enhancement";
  const video = workflow === "video";
  const imageOnly = enhance || video;
  const configured = visibleControls(tool, values);
  const unavailable = configured.filter(
    (control) => control.kind === "unknown",
  );

  const settings = room && (
    <RoomSettings
      tool={tool}
      values={values}
      locale={locale}
      update={(next) => setValues((previous) => ({ ...previous, ...next }))}
    />
  );
  return (
    <div className="studio-editor" onInputCapture={(event) => {
      if (!userId && event.target instanceof Element && event.target.closest(".studio-prompt, .room-settings, .avoid-detail, .inspector-group .studio-choices")) {
        try { sessionStorage.setItem("vn-unsaved-editor-settings", "yes"); } catch { /* Optional notice only. */ }
      }
    }}>
      {draftNotice && <p role="status" className="inspector-help">{english ? "Your previous unsaved description and settings were not retained. Please review and enter them again." : "Den forrige ulagrede beskrivelsen og innstillingene ble ikke beholdt. Kontroller og legg dem inn på nytt."}</p>}
      {draftRecovered && <p role="status" className="inspector-help">{english ? "Your settings were restored for this account, project and tool. Select your image again if needed." : "Valgene er gjenopprettet for denne kontoen, prosjektet og verktøyet. Velg bildet på nytt ved behov."}</p>}
      <div className="editor-topbar">
        <Link href="/app/library"><span aria-hidden="true">← </span>{t.open}</Link>
        <StudioToolSwitcher tool={tool} locale={locale} sample={sample} />
      </div>
      {!submissionEnabled && <p role="status" className="inspector-help editor-availability">{english ? "Explore this workflow with a sample. Image generation is not enabled in this demo." : "Utforsk arbeidsflyten med et eksempel. Bildegenerering er ikke aktivert i denne demonstrasjonen."}</p>}
      <div className="studio-workbench">
        <div className="inspector">
          {room && (
            <nav
              className="room-section-links"
              aria-label={english ? "Room controls" : "Romvalg"}
            >
              <a href="#room-settings">Design</a>
              <a href="#source-image">
                {english ? "Image & brief" : "Bilde og beskrivelse"}
              </a>
            </nav>
          )}
          <div
            className="inspector-scroll"
            role="region"
            tabIndex={0}
            aria-label={t.controls}
          >
            <details className="inspector-group studio-engine room-drawer" open>
              <summary>
                {english ? "Workflow and engine" : "Arbeidsflyt og motor"}
              </summary>
              <div>
                <StudioChoices
                  label={english ? "Maya experience" : "Maya-opplevelse"}
                  value={mayaExperience(tool.id)}
                  choices={mayaExperiences.map((item) => ({
                    value: item.id,
                    label: (english ? item.en : item.nb) + (item.id !== mayaExperience(tool.id) ? (english ? " — unavailable for this workflow" : " — utilgjengelig for denne arbeidsflyten") : ""),
                    disabled: item.id !== mayaExperience(tool.id),
                  }))}
                  onChange={() => { /* Experience is bound to this tool's existing operation. */ }}
                />
                <p className="inspector-help">{english ? "Experiences describe workflows, not provider model versions. Other operations need a compatible workflow." : "Opplevelsene beskriver arbeidsflyter, ikke leverandørens modellversjoner. Andre operasjoner krever en kompatibel arbeidsflyt."}</p>
                {(renderMode(tool.id) || enhance) && (
                  <StudioChoices
                    kind="workflow"
                    label={english ? "Workflow" : "Arbeidsflyt"}
                    value={workflow}
                    choices={
                      enhance
                        ? [
                            {
                              value: "design",
                              label: english
                                ? "Automatic enhancement"
                                : "Automatisk forbedring",
                            },
                            {
                              value: "upscale",
                              label: english
                                ? "Upscale image"
                                : "Oppskaler bilde",
                            },
                          ]
                        : sceneWorkflows
                            .filter((w) => supportedWorkflows(tool.id, Boolean(tool.reference)).includes(w.id))
                            .map((w) => ({
                              value: w.id,
                              label: english ? w.en : w.nb,
                            }))
                    }
                    onChange={(v) => {
                      setWorkflow(v as StudioWorkflow);
                      setResult(null);
                    }}
                  />
                )}
                {supportedWorkflows(tool.id, Boolean(tool.reference)).length > 1 && (
                  <p className="inspector-help">{english ? "Your choices are retained when switching workflows. Only settings shown for the selected workflow are used." : "Valgene beholdes når du bytter arbeidsflyt. Bare innstillinger som vises for valgt arbeidsflyt brukes."}</p>
                )}
                {renderMode(tool.id) && !video ? (
                  <label className="studio-model-select">
                    <span><span aria-hidden="true">◈ </span>{english ? "Provider model" : "Leverandørmodell"}</span>
                    <select value={engine} aria-describedby="studio-model-help" onChange={(event) => setEngine(event.target.value as RenderEngine)}>
                      {renderEngines.map((option) => (
                        <option key={option.id} value={option.id} disabled={!option.verified}>{option.label}{!option.verified ? (english ? " — not available" : " — ikke tilgjengelig") : ""}</option>
                      ))}
                    </select>
                    <span id="studio-model-help" className="inspector-help">{english ? "Fast uses the model tested with one interior image. Results vary; other models are not available until tested." : "Fast bruker modellen som er testet med ett interiørbilde. Resultatene varierer; andre modeller er utilgjengelige til de er testet."}</span>
                  </label>
                ) : (
                  <p className="studio-kicker">
                    Maya ·{" "}
                    {video
                      ? "Film · 10 s"
                      : enhance
                        ? workflow === "upscale"
                          ? english
                            ? "Upscale"
                            : "Oppskalering"
                          : english
                            ? "Enhance"
                            : "Forbedring"
                        : english
                          ? "Edit"
                          : "Redigering"}
                  </p>
                )}
                {video && (
                  <p className="inspector-help">
                    {english
                      ? "A slow camera move into one still image."
                      : "En rolig kamerabevegelse innover i ett stillbilde."}
                  </p>
                )}
                {workflow === "concept" && (
                  <p className="inspector-help">
                    {english
                      ? "Choose the destination project and describe your scene. The render uses text only."
                      : "Velg målprosjekt og beskriv motivet. Rendringen bruker bare tekst."}
                  </p>
                )}
                {workflow === "upscale" && (
                  <p className="inspector-help">
                    {english
                      ? "Output dimensions depend on the source and provider."
                      : "Resultatets størrelse avhenger av kilden og leverandøren."}
                  </p>
                )}
              </div>
            </details>
            <details
              className="inspector-group room-drawer"
              id="source-image"
              open
            >
              <summary>{english ? "Source image" : "Kildebilde"}</summary>
              <div>
                {sample && !preview && (
                  <div className="selected-study">
                    <strong>{translated(sample.name, locale)}</strong>
                    <span>
                      {english ? "Studio sample" : "Eksempel i Studio"}
                    </span>
                    <details>
                      <summary>
                        {english
                          ? "Workflow"
                          : "Arbeidsflyt"}
                      </summary>
                      {(
                        [
                          [
                            "room-reimagination",
                            "Gi rommet ny form",
                            "Reimagine the room",
                          ],
                          [
                            "material-refinement",
                            "Utforsk materialer",
                            "Explore materials",
                          ],
                          [
                            "lighting-reimagination",
                            "Endre lyset",
                            "Change the lighting",
                          ],
                        ] as const
                      )
                        .filter(([id]) => id !== tool.id)
                        .map(([id, nb, en]) => (
                          <Link key={id} href={studioSampleHref(sample, id)}>
                            {english ? en : nb} <span aria-hidden="true">↗</span>
                          </Link>
                        ))}
                    </details>
                  </div>
                )}
                <div className={uploadsEnabled ? "" : "source-unavailable"}>
                  {!uploadsEnabled && (
                    <>
                      <span className="upload-glyph" aria-hidden="true">
                        ↑
                      </span>
                      <strong>{t.upload}</strong>
                    </>
                  )}
                  <PrivateUpload
                    locale={locale}
                    enabled={uploadsEnabled}
                    onPreview={(url) => {
                      setPreview(url);
                      setResult(null);
                    }}
                    onSelection={setSelection}
                    draftUserId={userId}
                    draftToolId={tool.id}
                    withRoomReferences={
                      Boolean(tool.reference) &&
                      !["video", "concept"].includes(workflow)
                    }
                  />
                </div>
                {tool.reference &&
                  !uploadsEnabled &&
                  !["video", "concept"].includes(workflow) && (
                    <RoomReferences
                      assets={[]}
                      enabled={false}
                      locale={locale}
                    />
                  )}
              </div>
            </details>
            {!imageOnly && (
              <section className="inspector-group">
                <StudioPrompt
                  value={prompt}
                  change={setPrompt}
                  label={t.prompt}
                  help={
                    room && !english ? "Beskriv rommet du ønsker" : tool.prompt
                  }
                  locale={locale}
                  enabled={improveEnabled}
                />
                {tool.improve && (
                  <details className="avoid-detail">
                    <summary>{english ? "Writing tips" : "Skrivetips"}</summary>
                    <p className="inspector-help">
                      {english
                        ? "Name the part of the scene to change. Describe the materials and the light. Specify any features that should stay as they are."
                        : "Angi hvilken del av motivet du vil endre. Beskriv materialene og lyset. Ta med detaljer som skal beholdes."}
                    </p>
                  </details>
                )}
                <details className="avoid-detail">
                  <summary>{t.avoid}</summary>
                  <textarea
                    aria-label={t.avoid}
                    rows={2}
                    maxLength={1000}
                    value={avoid}
                    onChange={(e) => setAvoid(e.target.value)}
                  />
                </details>
              </section>
            )}
            {!video && !imageOnly && <p className="inspector-help">{english ? "Design choices are included as instructions to the image provider; exact changes are not guaranteed." : "Designvalgene sendes som instrukser til bildeleverandøren. Eksakte endringer kan ikke garanteres."}</p>}
            {!video &&
              workflow !== "upscale" &&
              (room ? (
                settings
              ) : (
                <details className="inspector-group room-drawer" open>
                  <summary>{t.controls}</summary>
                  <div>
                    {configured
                      .filter((control) => control.kind !== "unknown" && control.id !== "palette")
                      .map((c) => (
                        <fieldset
                          key={c.id}
                          disabled={
                            tool.id === "garden-design" &&
                            values.tidy === true &&
                            ["style", "scope"].includes(c.id)
                          }
                        >
                          <Field
                            control={c}
                            toolId={tool.id}
                            value={values[c.id]}
                            locale={locale}
                            onChange={(v) =>
                              setValues((prev) => ({ ...prev, [c.id]: v }))
                            }
                          />
                        </fieldset>
                      ))}
                    {unavailable.length > 0 && (
                      <details className="avoid-detail">
                        <summary>
                          {english
                            ? "Unavailable settings"
                            : "Utilgjengelige innstillinger"}{" "}
                          ({unavailable.length})
                        </summary>
                        <ul>
                          {unavailable.map((control) => (
                            <li key={control.id}>
                              {roomLabel(control.label, locale)}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </details>
              ))}
            <button type="button" className="room-reset editor-reset" aria-describedby="editor-reset-help" onClick={() => setValues(Object.fromEntries(tool.controls.filter((c) => c.defaultValue !== undefined).map((c) => [c.id, c.defaultValue!])))}>{english ? "Reset tool defaults" : "Tilbakestill verktøyvalg"}</button>
            <p className="inspector-help" id="editor-reset-help">{english ? "Your description and image are kept." : "Beskrivelsen og bildet beholdes."}</p>
          </div>
          <StudioRenderAction
            key={selection.projectId}
            tool={tool}
            locale={locale}
            enabled={renderEnabled && uploadsEnabled}
            submissionEnabled={submissionEnabled}
            workflow={workflow}
            selection={selection}
            onResult={setResult}
            values={values}
            engine={engine}
            prompt={imageOnly ? "" : prompt}
            avoid={imageOnly ? "" : avoid}
          />
        </div>
        <StudioCanvas
          tool={tool}
          locale={locale}
          preview={
            result
              ? result.source
                ? "/api/assets/" +
                  encodeURIComponent(result.source) +
                  "/download"
                : ""
              : preview
          }
          output={
            result
              ? "/api/assets/" + encodeURIComponent(result.output) + "/download"
              : undefined
          }
          outputMedia={result?.media}
          sample={preview ? undefined : sample}
          guides={values.guides === true}
        />
      </div>
    </div>
  );
}
