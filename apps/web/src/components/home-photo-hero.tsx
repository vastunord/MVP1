"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { studies, studioSampleHref, translated } from "@/lib/workspace-catalog";
import { Action } from "./marketing-elements";
import "./home-photo-hero.css";

const scenes = [
  [
    "Originalfoto / kveldstone",
    "Original photo / evening tone",
    "Et nytt blikk på stuen.",
    "Reimagine your living room.",
  ],
  [
    "Materialstudie",
    "Material study",
    "Utforsk tekstur og dybde.",
    "Explore texture and depth.",
  ],
  [
    "Lysstudie",
    "Light study",
    "Se hva lyset gjør med rommet.",
    "See how light shapes a space.",
  ],
] as const;

export function HomePhotoHero({
  locale,
  uploadsEnabled,
}: {
  locale: Locale;
  uploadsEnabled: boolean;
}) {
  const en = locale === "en";
  const t = (nb: string, english: string) => (en ? english : nb);
  const [index, setIndex] = useState(0);
  const [split, setSplit] = useState(71);
  const sample = studies[index];
  const scene = scenes[index];
  const move = (direction: number) =>
    setIndex((i) => (i + direction + studies.length) % studies.length);

  return (
    <section className="photo-hero" aria-labelledby="home-title">
      <div className={"photo-hero-stage scene-" + sample.id}>
        <Image
          className="photo-hero-image"
          src={"/reference/" + sample.image}
          alt={translated(sample.sampleAlt, locale)}
          fill
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
        />
        {index === 0 && (
          <>
            <div
              className="photo-hero-tone"
              style={{ clipPath: `inset(0 0 0 ${split}%)` }}
            >
              <Image
                src="/reference/soft-evening.webp"
                alt=""
                fill
                sizes="100vw"
                loading="eager"
              />
            </div>
            <span
              className="photo-hero-line"
              style={{ left: split + "%" }}
              aria-hidden="true"
            >
              <b>‹ ›</b>
            </span>
            <input
              className="photo-hero-range"
              type="range"
              min={0}
              max={100}
              value={split}
              onChange={(e) => setSplit(Number(e.target.value))}
              aria-label={t(
                "Sammenlign lyset i rommet",
                "Compare room lighting",
              )}
              aria-valuetext={t(
                `Originalfoto ${split} prosent, resten kveldstone`,
                `Original photo ${split} percent, remainder evening tone`,
              )}
            />
          </>
        )}
        <div className="photo-hero-veil" />
        <div className="photo-hero-copy">
          <p className="mk-label">
            {t(
              "Visuell design og forvandling",
              "Visual design & transformation",
            )}
          </p>
          <h1 id="home-title">
            {t("Se hva som er mulig.", "See what’s possible.")}
          </h1>
          <p className="photo-hero-deck">
            {t(
              "Gi ideene dine form. Utforsk rom, prøv nye detaljer og se mulighetene før du tar neste beslutning.",
              "Turn your ideas into visuals. Reimagine spaces, transform details, and explore possibilities before deciding what comes next.",
            )}
          </p>
          <div className="photo-hero-actions">
            <Action href="/app/tools/room-reimagination#source-image">
              {uploadsEnabled
                ? t("Last opp ditt bilde", "Upload your photo")
                : t("Åpne romeditoren", "Open room editor")}
            </Action>
            <Action secondary href={studioSampleHref(sample)}>
              {t("Prøv dette bildet", "Try this sample")}
            </Action>
          </div>
        </div>
      </div>
      <div className="photo-hero-rail">
        <div
          className="photo-hero-current"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="mk-label">{scene[en ? 1 : 0]}</p>
          <h2>{scene[en ? 3 : 2]}</h2>
        </div>
        <div
          className="photo-hero-nav"
          role="group"
          aria-label={t("Velg eksempelbilde", "Choose a sample photo")}
        >
          <button
            className="photo-arrow"
            type="button"
            onClick={() => move(-1)}
            aria-label={t("Forrige studie", "Previous study")}
          >
            ←
          </button>
          <div className="photo-hero-thumbs">
            {studies.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={index === i}
                onClick={() => setIndex(i)}
                aria-label={translated(s.name, locale)}
              >
                <Image
                  src={"/reference/" + s.image}
                  alt=""
                  width={74}
                  height={48}
                  sizes="60px"
                />
              </button>
            ))}
          </div>
          <button
            className="photo-arrow"
            type="button"
            onClick={() => move(1)}
            aria-label={t("Neste studie", "Next study")}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
