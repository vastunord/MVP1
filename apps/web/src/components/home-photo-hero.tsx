"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { homeComparisons } from "@/lib/home-comparisons";
import type { Locale } from "@/lib/i18n";
import { translated } from "@/lib/workspace-catalog";
import { Action } from "./marketing-elements";
import "./home-photo-hero.css";

type Scene = (typeof homeComparisons)[number];
const sweepPerSecond = 8;
const edgeHoldMs = 350;
const initialSplit = 50;

async function loadPair(scene: Scene) {
  await Promise.all(
    [scene.before, scene.after].map((src) => {
      const image = new window.Image();
      image.src = src;
      return image.decode();
    }),
  );
}

function ComparisonWindow({
  scene,
  locale,
  moving,
  nextScene,
  advance,
  children,
}: {
  scene: Scene;
  locale: Locale;
  moving: boolean;
  nextScene: Scene;
  advance: () => void;
  children: React.ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const position = useRef(initialSplit);
  const direction = useRef(1);
  const pointing = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [manualAdvance, setManualAdvance] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  function paint(value: number) {
    position.current = value;
    frame.current?.style.setProperty("--comparison-split", value + "%");
    const input = range.current;
    const rounded = String(Math.round(value));
    if (input && input.value !== rounded) input.value = rounded;
  }

  useEffect(() => {
    if (!manualAdvance && (!moving || hovered || dragging || keyboardFocus))
      return;
    let active = true;
    let animation = 0;
    let delay = 0;
    let previous = performance.now();

    function finishSweep(edge: number) {
      paint(edge);
      delay = window.setTimeout(
        async () => {
          if (
            !manualAdvance &&
            (document.hidden || document.querySelector("dialog[open]"))
          ) {
            if (active) finishSweep(edge);
            return;
          }
          try {
            await loadPair(nextScene);
            if (!active) return;
            direction.current = edge === 100 ? -1 : 1;
            advance();
          } catch {
            // Keep a readable pair and let the next sweep or manual action retry.
            if (active && !manualAdvance) {
              direction.current = edge === 100 ? -1 : 1;
              previous = performance.now();
              animation = requestAnimationFrame(tick);
            }
          } finally {
            if (active && manualAdvance) setManualAdvance(false);
          }
        },
        manualAdvance ? 0 : edgeHoldMs,
      );
    }

    function tick(time: number) {
      const elapsed = Math.min(Math.max(0, time - previous), 100);
      previous = time;
      const next =
        position.current +
        (direction.current * sweepPerSecond * elapsed) / 1000;
      if (next >= 100 || next <= 0) {
        finishSweep(next >= 100 ? 100 : 0);
        return;
      }
      paint(next);
      animation = requestAnimationFrame(tick);
    }
    if (manualAdvance) finishSweep(direction.current === 1 ? 100 : 0);
    else animation = requestAnimationFrame(tick);
    return () => {
      active = false;
      cancelAnimationFrame(animation);
      window.clearTimeout(delay);
    };
  }, [
    moving,
    hovered,
    dragging,
    keyboardFocus,
    manualAdvance,
    nextScene,
    advance,
  ]);

  return (
    <>
      <div
        className="photo-hero-mat"
        onPointerEnter={(event) => {
          if (event.pointerType !== "touch") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
      >
        <div
          className="photo-hero-stage"
          data-scene={scene.id}
          ref={frame}
          style={{ "--scene-ratio": scene.aspectRatio } as CSSProperties}
        >
          <div className="hero-images">
            <Image
              unoptimized
              src={scene.before}
              alt={translated(scene.beforeAlt, locale)}
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 899px) 95vw, 68vw"
            />
            <div className="hero-after">
              <Image
                unoptimized
                src={scene.after}
                alt={translated(scene.afterAlt, locale)}
                fill
                loading="eager"
                sizes="(max-width: 899px) 95vw, 68vw"
              />
            </div>
          </div>
          <span className="photo-hero-line" aria-hidden="true">
            <span>
              <svg
                viewBox="0 0 24 16"
                width="23"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m8 3-5 5 5 5m8-10 5 5-5 5" />
              </svg>
            </span>
          </span>
          <input
            ref={range}
            className="photo-hero-range"
            type="range"
            min="0"
            max="100"
            defaultValue={initialSplit}
            aria-label={
              locale === "en"
                ? "Compare before and after"
                : "Sammenlign før og etter"
            }
            onChange={(e) => paint(e.currentTarget.valueAsNumber)}
            onPointerDown={(e) => {
              pointing.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              setKeyboardFocus(false);
              setDragging(true);
            }}
            onPointerUp={() => {
              pointing.current = false;
              setDragging(false);
            }}
            onLostPointerCapture={() => {
              pointing.current = false;
              setDragging(false);
            }}
            onPointerCancel={() => {
              pointing.current = false;
              setDragging(false);
            }}
            onFocus={(e) =>
              setKeyboardFocus(
                !pointing.current && e.currentTarget.matches(":focus-visible"),
              )
            }
            onKeyDown={() => setKeyboardFocus(true)}
            onBlur={() => {
              setKeyboardFocus(false);
              setDragging(false);
            }}
          />
        </div>
      </div>
      <div className="hero-sequence">
        {children}
        <button
          type="button"
          onClick={() => setManualAdvance(true)}
          aria-label={locale === "en" ? "Next image pair" : "Neste bildepar"}
        >
          <svg
            viewBox="0 0 24 16"
            width="23"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 8h19m-7-6 7 6-7 6" />
          </svg>
        </button>
      </div>
    </>
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
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [choosingSample, setChoosingSample] = useState(false);
  const visual = useRef<HTMLDivElement>(null);
  const next = (index + 1) % homeComparisons.length;
  const scene = homeComparisons[index];
  const playing = visible && !paused && !reduceMotion;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(query.matches);
    let inView = false;
    const syncVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncVisibility();
    });
    syncMotion();
    if (visual.current) observer.observe(visual.current);
    query.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
      query.removeEventListener("change", syncMotion);
    };
  }, []);

  const advance = useCallback(() => setIndex(next), [next]);

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
    <section className="photo-hero" aria-labelledby="home-title">
      <div className="photo-hero-copy">
        <p className="mk-label">
          {t("Visuell design og forvandling", "Visual design & transformation")}
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
        <div
          className="photo-hero-actions"
          onFocusCapture={() => setChoosingSample(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget))
              setChoosingSample(false);
          }}
        >
          <Action href={primary.href}>{primary.label}</Action>
          <Action secondary href={secondary.href}>
            {secondary.label}
          </Action>
        </div>
      </div>
      <div className="photo-hero-visual" ref={visual}>
        <ComparisonWindow
          scene={scene}
          locale={locale}
          moving={playing && !choosingSample}
          nextScene={homeComparisons[next]}
          advance={advance}
        >
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
        </ComparisonWindow>
      </div>
    </section>
  );
}
