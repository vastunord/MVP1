"use client";
import { useState } from "react";
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
import { StudioToolSwitcher } from "./studio-tool-switcher";
import { StudioRenderAction } from "./studio-render-action";
import {
  renderEngines,
  renderMode,
  sceneWorkflows,
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
}: {
  control: Control;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
  locale: Locale;
}) {
  const id = "option-" + control.id;
  const text = (label: string) => roomLabel(label, locale);
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
          type={control.min === undefined ? "number" : "range"}
          min={control.min}
          max={control.max}
          value={typeof value === "number" ? value : ""}
          onChange={(e) => {
            if (e.target.value !== "") onChange(Number(e.target.value));
          }}
        />
        {control.min === undefined && (
          <span className="small" lang="en">
            Reference range limits not recorded; numeric input is provisional.
          </span>
        )}
      </div>
    );
  const options =
    control.kind === "toggle" ? ["On", "Off"] : (control.options ?? []);
  if (
    control.kind === "select" &&
    ["style", "palette"].includes(control.id) &&
    options.length > 1
  )
    return (
      <div className="field">
        <strong id={id}>{text(control.label)}</strong>
        <div className="preset-options" role="group" aria-labelledby={id}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={value === option}
              onClick={() => onChange(option)}
            >
              {text(option)}
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <div className="field">
      <label htmlFor={id}>{text(control.label)}</label>
      <select
        id={id}
        value={
          typeof value === "boolean" ? (value ? "On" : "Off") : (value ?? "")
        }
        onChange={(e) =>
          onChange(
            control.kind === "toggle"
              ? e.target.value === "On"
              : e.target.value,
          )
        }
      >
        <option value="" disabled>
          {locale === "en" ? "Choose…" : "Velg …"}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {text(o)}
          </option>
        ))}
      </select>
    </div>
  );
}
export function Editor({
  tool,
  locale,
  uploadsEnabled,
  renderEnabled,
  videoEnabled,
  sample,
}: {
  tool: ToolDefinition;
  locale: Locale;
  uploadsEnabled: boolean;
  renderEnabled: boolean;
  videoEnabled: boolean;
  sample?: StudioSample;
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
  const [engine, setEngine] = useState<RenderEngine>("v4.6-ultra");
  const [selection, setSelection] = useState<RenderSelection>({
    projectId: "",
    sourceAssetId: "",
    referenceIds: [],
  });
  const [result, setResult] = useState<StudioResult | null>(null);
  const [workflow, setWorkflow] = useState<StudioWorkflow>("design");
  const [preview, setPreview] = useState("");
  const english = locale === "en";
  const room = tool.id === "room-reimagination";
  const enhance = tool.id === "resolution-enhancement";
  const video = workflow === "video";
  const imageOnly = enhance || video;
  const configured = visibleControls(tool, values);
  const unavailable = configured.filter(
    (control) => control.kind === "unknown",
  );
  const startWithDesign = room && !sample && !uploadsEnabled;
  const settings = room && (
    <RoomSettings
      tool={tool}
      values={values}
      locale={locale}
      update={(next) => setValues((previous) => ({ ...previous, ...next }))}
    />
  );
  return (
    <div className="studio-editor">
      <div className="editor-topbar">
        <Link href="/app/library">← {t.back}</Link>
        <StudioToolSwitcher tool={tool} locale={locale} sample={sample} />
      </div>
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
            <section className="inspector-group studio-engine">
              {(renderMode(tool.id) || enhance) && (
                <>
                  <label className="studio-kicker" htmlFor="studio-workflow">
                    {english ? "Workflow" : "Arbeidsmåte"}
                  </label>
                  <select
                    id="studio-workflow"
                    value={workflow}
                    onChange={(e) => {
                      setWorkflow(e.target.value as StudioWorkflow);
                      setResult(null);
                    }}
                  >
                    {enhance ? (
                      <>
                        <option value="design">
                          {english
                            ? "Automatic enhancement"
                            : "Automatisk forbedring"}
                        </option>
                        <option value="upscale">
                          {english ? "Upscale image" : "Oppskaler bilde"}
                        </option>
                      </>
                    ) : (
                      sceneWorkflows
                        .filter((w) => w.id !== "style" || tool.reference)
                        .map((w) => (
                          <option key={w.id} value={w.id}>
                            {english ? w.en : w.nb}
                          </option>
                        ))
                    )}
                  </select>
                </>
              )}
              <label className="studio-kicker" htmlFor="render-engine">
                {english ? "Render engine" : "Rendermotor"}
              </label>
              {renderMode(tool.id) && !video ? (
                <select
                  id="render-engine"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value as RenderEngine)}
                >
                  {renderEngines.map((item) => (
                    <option key={item.id} value={item.id}>
                      MNML {item.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span id="render-engine">
                  {video
                    ? "MNML · Flash · 10 s"
                    : enhance
                      ? workflow === "upscale"
                        ? "MNML · Upscale"
                        : "MNML · Enhance"
                      : "MNML · Edit"}
                </span>
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
            </section>
            {startWithDesign && !imageOnly && settings}
            <section className="inspector-group" id="source-image">
              <h2>{english ? "Source image" : "Kildebilde"}</h2>
              {sample && !preview && (
                <div className="selected-study">
                  <strong>{translated(sample.name, locale)}</strong>
                  <span>{english ? "Studio sample" : "Eksempel i Studio"}</span>
                  <details>
                    <summary>
                      {english
                        ? "Try another tool with this photo"
                        : "Prøv et annet verktøy med dette bildet"}
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
                          {english ? en : nb} ↗
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
                  withRoomReferences={
                    Boolean(tool.reference) &&
                    !["video", "concept"].includes(workflow)
                  }
                />
              </div>
              {tool.reference &&
                !uploadsEnabled &&
                !["video", "concept"].includes(workflow) && (
                  <RoomReferences assets={[]} enabled={false} locale={locale} />
                )}
            </section>
            {!imageOnly && (
              <section className="inspector-group">
                <label className="studio-kicker" htmlFor="prompt">
                  {t.prompt}
                </label>
                <p className="inspector-help" lang={room ? locale : "en"}>
                  {room && !english ? "Beskriv rommet du ønsker" : tool.prompt}
                </p>
                <textarea
                  id="prompt"
                  maxLength={4000}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <div className="prompt-tools">
                  <button
                    type="button"
                    onClick={() => {
                      const summary = configured
                        .filter(
                          (c) =>
                            ["select", "toggle"].includes(c.kind) &&
                            values[c.id] !== undefined &&
                            !["guides", "preview", "mode"].includes(c.id),
                        )
                        .map(
                          (c) =>
                            roomLabel(c.label, locale) +
                            " — " +
                            roomLabel(String(values[c.id]), locale),
                        )
                        .join(", ");
                      const line =
                        summary ||
                        (english
                          ? "Preserve the layout and show natural material textures."
                          : "Behold planløsningen og vis naturlige materialteksturer.");
                      if (!prompt.includes(line))
                        setPrompt(
                          (prompt.trim() + "\n" + line).trim().slice(0, 4000),
                        );
                    }}
                  >
                    {english
                      ? "Add settings to brief"
                      : "Legg valg i beskrivelsen"}
                  </button>
                  <small>{prompt.length} / 4000</small>
                </div>
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
            {!video &&
              workflow !== "upscale" &&
              (room ? (
                !startWithDesign && settings
              ) : (
                <section className="inspector-group">
                  <h2>{t.controls}</h2>
                  {configured
                    .filter((control) => control.kind !== "unknown")
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
                </section>
              ))}
          </div>
          <StudioRenderAction
            key={selection.projectId}
            tool={tool}
            locale={locale}
            enabled={renderEnabled && uploadsEnabled}
            videoEnabled={videoEnabled}
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
