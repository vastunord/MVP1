"use client";
import { useState, type CSSProperties } from "react";
import Image from "next/image";
import type { ToolDefinition } from "@vastunord/contracts/tools";
import { messages, type Locale } from "@/lib/i18n";
import { translated, type StudioSample } from "@/lib/workspace-catalog";
import { canvasDescription, sampleTones, toolDescription } from "./tool-presentation";

export function StudioCanvas({
  tool,
  locale,
  preview,
  sample,
  guides,
}: {
  tool: ToolDefinition;
  locale: Locale;
  preview: string;
  sample?: StudioSample;
  guides: boolean;
}) {
  const english = locale === "en";
  const t = messages(locale);
  const [toneIndex, setToneIndex] = useState(
    tool.id === "lighting-reimagination" ? 1 : 0,
  );
  const [compare, setCompare] = useState(true);
  const [position, setPosition] = useState(
    ["sky-transformation", "seasonal-transformation"].includes(tool.id)
      ? 42
      : tool.id === "resolution-enhancement"
        ? 45
        : 46,
  );
  const tone = sampleTones[toneIndex];
  const toneName = english ? tone.en : tone.nb;
  const staticExample = !tool.comparison;
  const canvasPhoto = `/media/canvas/${tool.id}.webp`;
  return (
    <section className="studio-canvas" aria-label={t.canvas}>
      <div className="canvas-heading">
        <span className="studio-kicker">{t[tool.category]}</span>
        <h1 lang="en">{tool.name}</h1>
        <p>{toolDescription(tool.id, locale)}</p>
      </div>
      <figure className="canvas-figure">
        {preview ? (
          <div className="sample-stage private-stage">
            {/* Authenticated, server-authorized endpoint or ephemeral local blob. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={english ? "Selected project image" : "Valgt prosjektbilde"}
            />
          </div>
        ) : sample ? (
          <div className="sample-stage selected-stage">
            <Image
              src={sample.image.startsWith("/") ? sample.image : "/reference/" + sample.image}
              alt={translated(sample.sampleAlt, locale)}
              fill
              priority
              sizes="(max-width: 850px) 95vw, 65vw"
            />
          </div>
        ) : (
          <div
            className="sample-stage"
            style={{ "--divider": position + "%" } as CSSProperties}
          >
            <Image
              src={canvasPhoto}
              unoptimized
              className={staticExample ? undefined : "tone-" + tone.id}
              alt={canvasDescription(tool.id, locale)}
              fill
              priority
              sizes="(max-width: 850px) 95vw, 65vw"
            />
            {!staticExample && compare && (
              <>
                <div className="sample-before">
                  <Image
                    src={canvasPhoto}
                    unoptimized
                    alt=""
                    fill
                    sizes="(max-width: 850px) 95vw, 65vw"
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
                  onChange={(e) => setPosition(Number(e.target.value))}
                  aria-label={
                    english
                      ? "Before and after comparison"
                      : "Sammenlign før og etter"
                  }
                  aria-valuetext={
                    (english ? "Original image " : "Originalbilde ") +
                    position +
                    " %"
                  }
                />
              </>
            )}
            {staticExample &&
              tool.id === "perspective-correction" &&
              guides && <div className="sample-guides" aria-hidden="true" />}
            {staticExample && tool.id === "object-placement" && (
              <div className="sample-pins" aria-hidden="true">
                <span>1</span>
                <span>2</span>
              </div>
            )}
            {tool.id === "visual-cleanup" && (
              <div className="example-mask" aria-hidden="true" />
            )}
          </div>
        )}
        <figcaption className="sample-caption">
          <span>
            {preview
              ? english
                ? "Private project photo"
                : "Privat prosjektbilde"
              : sample
                ? translated(sample.name, locale)
                : english ? "Brand sample" : "Merkevareeksempel"}
          </span>
          {preview
            ? null
            : sample
              ? english ? "Selected source photo" : "Valgt kildebilde"
            : staticExample
              ? tool.id === "visual-cleanup"
                ? english
                  ? "Example brush selection"
                  : "Eksempel på penselmarkering"
                : tool.id === "object-placement"
                  ? english
                    ? "Example placement markers"
                    : "Eksempel på plasseringspunkter"
                  : english
                    ? "Perspective guide study"
                    : "Studie av perspektivlinjer"
              : (english ? "Curated tone study" : "Ferdig tonestudie") +
                " · " +
                toneName}
        </figcaption>
      </figure>
      {!preview && !sample && !staticExample && (
        <div className="studio-variants">
          <div
            role="group"
            aria-label={english ? "Sample tones" : "Eksempeltoner"}
          >
            {sampleTones.map((s, i) => (
              <button
                type="button"
                key={s.id}
                aria-pressed={toneIndex === i}
                onClick={() => setToneIndex(i)}
              >
                <Image
                  src={canvasPhoto}
                  unoptimized
                  className={"studio-tone-chip tone-" + s.id}
                  width={80}
                  height={48}
                  alt=""
                />
                <span>{english ? s.en : s.nb}</span>
              </button>
            ))}
          </div>
          <button
            className="compare-toggle"
            aria-pressed={compare}
            onClick={() => setCompare(!compare)}
          >
            {english ? "Compare" : "Sammenlign"}
          </button>
        </div>
      )}
      <ol className="studio-steps">
        <li>{t.step1}</li>
        <li>{t.step2}</li>
        <li>{t.step3}</li>
      </ol>
    </section>
  );
}
