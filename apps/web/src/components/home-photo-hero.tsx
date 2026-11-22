"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { homeComparisons } from "@/lib/home-comparisons";
import type { Locale } from "@/lib/i18n";
import { translated } from "@/lib/workspace-catalog";
import { Action } from "./marketing-elements";
import "./home-photo-hero.css";

type Scene = (typeof homeComparisons)[number];
const dwellMs = 8000;
const transitionMs = 650;

function SceneImages({
  scene,
  split,
  incoming = false,
  locale,
}: {
  scene: Scene;
  split: number;
  incoming?: boolean;
  locale: Locale;
}) {
  return (
    <div
      className={"hero-images" + (incoming ? " hero-incoming" : "")}
      aria-hidden={incoming || undefined}
    >
      <Image
        unoptimized
        src={scene.before}
        alt={translated(scene.beforeAlt, locale)}
        fill
        loading="eager"
        fetchPriority={incoming ? "auto" : "high"}
        sizes="100vw"
      />
      <div
        className="hero-after"
        style={{ clipPath: `inset(0 0 0 ${split}%)` }}
      >
        <Image
          unoptimized
          src={scene.after}
          alt={translated(scene.afterAlt, locale)}
          fill
          loading="eager"
          sizes="100vw"
        />
      </div>
    </div>
  );
}

function loadPair(scene: Scene) {
  return Promise.all(
    [scene.before, scene.after].map((src) => {
      const image = new window.Image();
      image.src = src;
      return image.decode();
    }),
  );
}

export function HomePhotoHero({
  locale,
  uploadsEnabled,
}: {
  locale: Locale;
  uploadsEnabled: boolean;
}) {
  const t = (nb: string, en: string) => (locale === "en" ? en : nb);
  const [index, setIndex] = useState(0);
  const [incoming, setIncoming] = useState(false);
  const [split, setSplit] = useState(55);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const next = (index + 1) % homeComparisons.length;
  const scene = homeComparisons[index];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(query.matches);
    let inView = true;
    const syncVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncVisibility();
    });
    syncMotion();
    syncVisibility();
    if (stage.current) observer.observe(stage.current);
    query.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      query.removeEventListener("change", syncMotion);
    };
  }, []);

  useEffect(() => {
    if (paused || focused || !visible || reduceMotion || incoming) return;
    let active = true;
    const timer = window.setInterval(async () => {
      if (document.querySelector("dialog[open]") || document.hidden) return;
      try {
        await loadPair(homeComparisons[next]);
        if (active && !document.querySelector("dialog[open]"))
          setIncoming(true);
      } catch {
        /* Keep the current comparison visible during a network interruption. */
      }
    }, dwellMs);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [paused, focused, visible, reduceMotion, incoming, next]);

  useEffect(() => {
    if (!incoming) return;
    const timer = window.setTimeout(
      () => {
        setIndex(next);
        setIncoming(false);
      },
      reduceMotion ? 0 : transitionMs,
    );
    return () => window.clearTimeout(timer);
  }, [incoming, next, reduceMotion]);

  async function advance() {
    if (incoming) return;
    try {
      await loadPair(homeComparisons[next]);
      setIncoming(true);
    } catch {
      /* A later action can retry the same pair. */
    }
  }

  const sample = {
    href: `/app/tools/room-reimagination?sample=hero-${scene.id}`,
    label: t("Prøv dette bildet", "Try this image"),
  };
  const studio = {
    href: "/app/tools/room-reimagination#source-image",
    label: uploadsEnabled
      ? t("Last opp ditt bilde", "Upload your photo")
      : t("Åpne Studio", "Open Studio"),
  };
  const [primary, secondary] = uploadsEnabled
    ? [studio, sample]
    : [sample, studio];
  return (
    <section
      ref={stage}
      className="photo-hero"
      aria-labelledby="home-title"
      onFocusCapture={(event) => setFocused(event.target.matches("input, a"))}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="photo-hero-stage" data-scene={scene.id}>
        <SceneImages
          key={scene.id}
          scene={scene}
          split={split}
          locale={locale}
        />
        {incoming && (
          <SceneImages
            key={homeComparisons[next].id}
            scene={homeComparisons[next]}
            split={split}
            incoming
            locale={locale}
          />
        )}
        <div className="photo-hero-veil" />
        <span className="hero-state hero-before-label">
          {t("Før", "Before")}
        </span>
        <span className="hero-state hero-after-label">
          {t("Etter", "After")}
        </span>
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
          onChange={(event) => setSplit(Number(event.target.value))}
          aria-label={t("Sammenlign før og etter", "Compare before and after")}
          aria-valuetext={t(`${split} prosent før`, `${split} percent before`)}
        />
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
            <Action href={primary.href}>{primary.label}</Action>
            <Action secondary href={secondary.href}>
              {secondary.label}
            </Action>
          </div>
        </div>
        <div className="hero-sequence">
          <span className="hero-scene-title">
            {translated(scene.title, locale)}
          </span>
          <span className="hero-counter">
            {String(index + 1).padStart(2, "0")} / {homeComparisons.length}
          </span>
          {!reduceMotion && (
            <button
              type="button"
              onClick={() => setPaused(!paused)}
              aria-label={
                paused
                  ? t("Spill av bildeserie", "Play slideshow")
                  : t("Sett bildeserien på pause", "Pause slideshow")
              }
            >
              <svg
                viewBox="0 0 20 20"
                width="16"
                height="16"
                fill="currentColor"
                aria-hidden="true"
              >
                {paused ? (
                  <path d="m5 3 11 7-11 7z" />
                ) : (
                  <path d="M5 3h3v14H5zm7 0h3v14h-3z" />
                )}
              </svg>
            </button>
          )}
          <button
            type="button"
            onClick={advance}
            aria-label={t("Neste bildepar", "Next image pair")}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
