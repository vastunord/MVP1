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
import { Button } from "./ui";
import { PrivateUpload } from "./private-upload";
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
}: {
  tool: ToolDefinition;
  locale: Locale;
  uploadsEnabled: boolean;
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
  return (
    <>
      <div className="editor-heading">
        <div>
          <Link href="/app/library">← {t.back}</Link>
          <h1>{tool.name}</h1>
        </div>
        <div className="row">
          <Button disabled>{t.history}</Button>
          <Button disabled>{t.export}</Button>
        </div>
      </div>
      <p className="small">{t.previewNote}</p>
      <div className="editor">
        <section className="editor-panel" aria-label={t.controls}>
          <PrivateUpload
            locale={locale}
            enabled={uploadsEnabled}
            onPreview={setPreview}
          />
          {tool.reference && <Button disabled>{t.reference}</Button>}
          <div className="field">
            <label htmlFor="prompt">{t.prompt}</label>
            <p className="small" lang="en">
              {tool.prompt}
            </p>
            <textarea
              id="prompt"
              maxLength={1000}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <span className="small">{prompt.length} / 1000</span>
            {tool.improve && <Button disabled>{t.improve}</Button>}
          </div>
          <div className="field">
            <label htmlFor="avoid">{t.avoid}</label>
            <textarea id="avoid" rows={2} maxLength={1000} />
          </div>
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
                onChange={(v) => setValues((prev) => ({ ...prev, [c.id]: v }))}
              />
            </fieldset>
          ))}
          <div className="primary-action">
            <Button className="primary" disabled aria-describedby="action-help">
              {primaryAction(tool, values)}
            </Button>
            <p id="action-help" className="small">
              {t.actionHelp}
            </p>
          </div>
        </section>
        <section className="canvas" aria-label={t.canvas}>
          <div className="canvas-inner">
            {preview ? (
              // Images are either local previews or authorized private-media endpoints.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt={
                  locale === "en"
                    ? "Selected project image"
                    : "Valgt prosjektbilde"
                }
                style={{
                  maxWidth: "100%",
                  maxHeight: "60vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <>
                <div className="canvas-icon" aria-hidden="true">
                  ＋
                </div>
                <h2>{t.canvas}</h2>
                <p>{t.canvasBody}</p>
                {tool.comparison && (
                  <div className="comparison-labels" lang="en">
                    <span>{tool.comparison[0]}</span>
                    <span>{tool.comparison[1]}</span>
                  </div>
                )}
                <p className="small">{t.empty}</p>
              </>
            )}
          </div>
          <ol className="canvas-steps">
            <li>{t.step1}</li>
            <li>{t.step2}</li>
            <li>{t.step3}</li>
          </ol>
        </section>
      </div>
    </>
  );
}
