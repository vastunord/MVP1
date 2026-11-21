"use client";
import { useState } from "react";
import Link from "next/link";
import {
  visibleControls,
  primaryAction,
  type ToolDefinition,
  type Control,
} from "@vastunord/contracts/tools";
import { messages, type Locale } from "@/lib/i18n";
import { studioSampleHref, translated, type StudioSample } from "@/lib/workspace-catalog";
import { Button } from "./ui";
import { PrivateUpload } from "./private-upload";
import { StudioCanvas } from "./studio-canvas";
import "./studio-tools.css";
function Field({
  control,
  value,
  onChange,
  unknown,
}: {
  control: Control;
  value: string | number | boolean | undefined;
  onChange: (value: string | number | boolean) => void;
  unknown: string;
}) {
  const id = "option-" + control.id;
  if (control.kind === "action")
    return <Button disabled>{control.label}</Button>;
  if (control.kind === "unknown")
    return (
      <div className="field">
        <label htmlFor={id}>{control.label}</label>
        <select id={id} disabled>
          <option>{unknown}</option>
        </select>
      </div>
    );
  if (control.kind === "toggle" && typeof value === "boolean")
    return (
      <label className="check" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {control.label}
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
        <strong id={id}>{control.label}</strong>
        <div className="preset-options" role="group" aria-labelledby={id}>
          {options.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={value === option}
              onClick={() => onChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <div className="field">
      <label htmlFor={id}>{control.label}</label>
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
          {unknown}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {options.length === 1 && <span className="small">{unknown}</span>}
    </div>
  );
}
export function Editor({
  tool,
  locale,
  uploadsEnabled,
  sample,
}: {
  tool: ToolDefinition;
  locale: Locale;
  uploadsEnabled: boolean;
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
  const [preview, setPreview] = useState("");
  const english = locale === "en";
  return (
    <div className="studio-editor">
      <div className="editor-topbar">
        <Link href="/app/library">← {t.back}</Link>
        <div className="row">
          <Button disabled>{t.history}</Button>
          <Button disabled>{t.export}</Button>
        </div>
      </div>
      <div className="studio-workbench">
        <div className="inspector">
          <div
            className="inspector-scroll"
            role="region"
            tabIndex={0}
            aria-label={t.controls}
          >
            <section className="inspector-group" id="source-image">
              <h2>{english ? "Source image" : "Kildebilde"}</h2>
              {sample && !preview && (
                <div className="selected-study">
                  <strong>{translated(sample.name, locale)}</strong>
                  <span>{english ? "Studio sample" : "Studiobilde"}</span>
                  <details>
                    <summary>{english ? "Try another tool with this photo" : "Prøv et annet verktøy med dette bildet"}</summary>
                    {([
                      ["room-reimagination", "Gi rommet ny form", "Reimagine the room"],
                      ["material-refinement", "Utforsk materialer", "Explore materials"],
                      ["lighting-reimagination", "Endre lyset", "Change the lighting"],
                    ] as const).filter(([id]) => id !== tool.id).map(([id, nb, en]) => (
                      <Link key={id} href={studioSampleHref(sample, id)}>{english ? en : nb} ↗</Link>
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
                  onPreview={setPreview}
                />
              </div>
              {tool.reference && (
                <Button className="reference-slot" disabled>
                  ＋ {t.reference}
                </Button>
              )}
            </section>
            <section className="inspector-group">
              <label className="studio-kicker" htmlFor="prompt">
                {t.prompt}
              </label>
              <p className="inspector-help" lang="en">
                {tool.prompt}
              </p>
              <textarea
                id="prompt"
                maxLength={1000}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
              <div className="prompt-tools">
                {tool.improve && <Button disabled>{t.improve}</Button>}
                <small>{prompt.length} / 1000</small>
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
                <textarea aria-label={t.avoid} rows={2} maxLength={1000} />
              </details>
            </section>
            <section className="inspector-group">
              <h2>{t.controls}</h2>
              {visibleControls(tool, values).map((c) => (
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
                    unknown={t.unknown}
                    onChange={(v) =>
                      setValues((prev) => ({ ...prev, [c.id]: v }))
                    }
                  />
                </fieldset>
              ))}
            </section>
          </div>
          <div className="primary-action">
            <Button className="primary" disabled aria-describedby="action-help">
              {primaryAction(tool, values)}
            </Button>
            <p id="action-help">{t.actionHelp}</p>
          </div>
        </div>
        <StudioCanvas
          tool={tool}
          locale={locale}
          preview={preview}
          sample={preview ? undefined : sample}
          guides={values.guides === true}
        />
      </div>
    </div>
  );
}
