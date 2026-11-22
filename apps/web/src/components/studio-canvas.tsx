"use client";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { ToolDefinition } from "@vastunord/contracts/tools";
import { messages, type Locale } from "@/lib/i18n";
import { translated, type StudioSample } from "@/lib/workspace-catalog";
import { homeComparisons } from "@/lib/home-comparisons";
import { canvasDescription, toolDescription } from "./tool-presentation";

export function StudioCanvas({
  tool,
  locale,
  preview,
  sample,
  guides,
  output,
  outputMedia,
}: {
  tool: ToolDefinition;
  locale: Locale;
  preview: string;
  sample?: StudioSample;
  guides: boolean;
  output?: string;
  outputMedia?: "image" | "video";
}) {
  const en = locale === "en",
    t = messages(locale);
  const [compare, setCompare] = useState(false);
  const [position, setPosition] = useState(50);
  const source =
    preview ||
    (sample
      ? sample.image.startsWith("/")
        ? sample.image
        : "/reference/" + sample.image
      : "/media/canvas/" + tool.id + ".webp");
  const study =
    homeComparisons.find((item) => sample?.id === "hero-" + item.id) ??
    homeComparisons.find(
      (item) =>
        item.id ===
        (tool.category === "Exterior & Landscape"
          ? "white-villa"
          : "city-living"),
    )!;
  const canCompare = output
    ? Boolean(preview) && outputMedia !== "video"
    : !preview && (!sample || sample.id.startsWith("hero-"));
  const comparing = compare && canCompare;
  const after = output || study.after;
  const before = output ? source : study.before;
  const sourceAlt = preview
    ? en
      ? "Selected private image"
      : "Valgt privatbilde"
    : sample
      ? translated(sample.sampleAlt, locale)
      : canvasDescription(tool.id, locale);
  return (
    <section className="studio-canvas" aria-label={t.canvas}>
      <div className="canvas-heading">
        <span className="studio-kicker">{t[tool.category]}</span>
        <h1 lang="en">{tool.name}</h1>
        <p>{toolDescription(tool.id, locale)}</p>
      </div>
      <figure className="canvas-figure">
        <div
          className={
            "sample-stage " +
            (preview || output
              ? "private-stage"
              : sample
                ? "selected-stage"
                : "")
          }
          style={{ "--divider": position + "%" } as CSSProperties}
        >
          {output && outputMedia === "video" ? (
            <video
              controls
              playsInline
              preload="metadata"
              src={output}
              aria-label={en ? "Project walkthrough" : "Prosjektvandring"}
            />
          ) : (
            <Image
              src={comparing ? after : output || source}
              alt={
                output
                  ? en
                    ? "Private render result"
                    : "Privat renderresultat"
                  : comparing
                    ? translated(study.afterAlt, locale)
                    : sourceAlt
              }
              unoptimized
              fill
              priority
              sizes="(max-width:850px) 95vw, 65vw"
            />
          )}
          {comparing && (
            <>
              <div className="sample-before">
                <Image
                  src={before}
                  alt={output ? sourceAlt : translated(study.beforeAlt, locale)}
                  unoptimized
                  fill
                  sizes="(max-width:850px) 95vw, 65vw"
                />
              </div>
              <div className="sample-divider" aria-hidden="true">
                <span>↔</span>
              </div>
              <input
                className="sample-range"
                type="range"
                min="0"
                max="100"
                value={position}
                onChange={(e) => setPosition(e.currentTarget.valueAsNumber)}
                aria-label={
                  en ? "Before and after comparison" : "Sammenlign før og etter"
                }
              />
            </>
          )}
          {!comparing &&
            !output &&
            tool.id === "perspective-correction" &&
            guides && <div className="sample-guides" aria-hidden="true" />}
        </div>
        <figcaption className="sample-caption">
          <span>
            {output
              ? en
                ? "Project render"
                : "Prosjektrender"
              : comparing
                ? translated(study.title, locale)
                : preview
                  ? en
                    ? "Private project photo"
                    : "Privat prosjektbilde"
                  : sample
                    ? translated(sample.name, locale)
                    : en
                      ? "Studio reference"
                      : "Studioreferanse"}
          </span>
          {sample &&
            !comparing &&
            !output &&
            (en ? "Selected source photo" : "Valgt kildebilde")}
          {canCompare && (
            <button
              type="button"
              className="compare-toggle"
              aria-pressed={comparing}
              onClick={() => setCompare(!comparing)}
            >
              {comparing
                ? en
                  ? "Single image"
                  : "Enkeltbilde"
                : output
                  ? en
                    ? "Compare with source"
                    : "Sammenlign med original"
                  : en
                    ? "Compare example"
                    : "Sammenlign eksempel"}
            </button>
          )}
        </figcaption>
      </figure>
    </section>
  );
}
