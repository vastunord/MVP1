"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { homeComparisons } from "@/lib/home-comparisons";
import { publicHref, type Locale } from "@/lib/i18n";
import { translated } from "@/lib/workspace-catalog";
import { Action } from "./marketing-elements";
import "./home-photo-hero.css";

type Scene = (typeof homeComparisons)[number];
const sweepPerSecond = 8;
const edgeHoldMs = 350;
const initialSplit = 0;

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
  pause,
  previousScene,
  nextScene,
  advance,
  children,
}: {
  scene: Scene;
  locale: Locale;
  moving: boolean;
  pause: () => void;
  previousScene: Scene;
  nextScene: Scene;
  advance: (step: -1 | 1) => void;
  children: React.ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const range = useRef<HTMLInputElement>(null);
  const position = useRef(initialSplit);
  const [retryStep, setRetryStep] = useState<-1 | 0 | 1>(0);
  const pointing = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [manualStep, setManualStep] = useState<-1 | 0 | 1>(0);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  function paint(value: number) {
    position.current = value;
    frame.current?.style.setProperty("--comparison-split", value + "%");
    const input = range.current;
    const rounded = String(Math.round(value));
    if (input && input.value !== rounded) input.value = rounded;
  }

  useLayoutEffect(() => {
    paint(0);
  }, [scene.id]);

  // Start decoding the next pair while the current photographs are visible.
  useEffect(() => { void loadPair(nextScene).catch(() => {}); }, [nextScene]);

  useEffect(() => {
    if (!manualStep && (!moving || hovered || dragging || keyboardFocus || retryStep)) return;
    let active = true;
    let animation = 0;
    let timer = 0;
    let previous = 0;

    async function changePair(step: -1 | 1) {
      if (!manualStep && (document.hidden || document.querySelector("dialog[open]"))) {
        timer = window.setTimeout(() => void changePair(step), edgeHoldMs);
        return;
      }
      try {
        await loadPair(step === -1 ? previousScene : nextScene);
        if (!active) return;
        setRetryStep(0);
        setManualStep(0);
        advance(step);
      } catch {
        if (!active) return;
        setManualStep(0);
        setRetryStep(step);
        pause();
      }
    }

    function tick(time: number) {
      const elapsed = previous ? Math.min(100, time - previous) : 0;
      previous = time;
      if (!document.hidden && !document.querySelector("dialog[open]")) {
        paint(Math.min(100, position.current + sweepPerSecond * elapsed / 1000));
      }
      if (position.current < 100) animation = requestAnimationFrame(tick);
      else timer = window.setTimeout(() => void changePair(1), edgeHoldMs);
    }
    if (manualStep) void changePair(manualStep);
    else timer = window.setTimeout(() => { animation = requestAnimationFrame(tick); }, position.current === 0 ? edgeHoldMs : 0);
    return () => {
      active = false;
      cancelAnimationFrame(animation);
      window.clearTimeout(timer);
    };
  }, [moving, hovered, dragging, keyboardFocus, manualStep, retryStep, previousScene, nextScene, advance, pause]);

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
            onChange={(e) => { pause(); paint(e.currentTarget.valueAsNumber); }}
            onPointerDown={(e) => {
              pause();
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
            onKeyDown={(event) => {
              setKeyboardFocus(true);
              if (["Home", "End", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key)) pause();
            }}
            onBlur={() => {
              setKeyboardFocus(false);
              setDragging(false);
            }}
          />
        </div>
      </div>
      {retryStep !== 0 && <p role="status">{locale === "en" ? "The next image pair could not load." : "Det neste bildeparet kunne ikke lastes."} <button type="button" onClick={() => setManualStep(retryStep)}>{locale === "en" ? "Try again" : "Prøv igjen"}</button></p>}
      <div className="hero-sequence">
        <button
          type="button"
          onClick={() => setManualStep(-1)}
          aria-label={locale === "en" ? "Previous image pair" : "Forrige bildepar"}
        >
          <svg viewBox="0 0 24 16" width="23" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 8H3m7-6L3 8l7 6" />
          </svg>
        </button>
        {children}
        <button
          type="button"
          onClick={() => setManualStep(1)}
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

  const pause = useCallback(() => setPaused(true), []);
  const advance = useCallback((step: -1 | 1) => {
    setIndex(current => (current + step + homeComparisons.length) % homeComparisons.length);
  }, []);

  const sample = {
    href: `/app/tools/room-reimagination?sample=hero-${scene.id}`,
    label: t("Åpne Studio", "Open Studio"),
  };

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
          <Action href={sample.href}>{sample.label}</Action>
          {uploadsEnabled ? (
            <Action secondary href="/app/tools/room-reimagination#source-image">
              {t("Last opp ditt bilde", "Upload your photo")}
            </Action>
          ) : (
            <Action secondary href={publicHref("/gallery", locale)}>{t("Se bildegalleriet", "View gallery")}</Action>
          )}
        </div>
      </div>
      <div className="photo-hero-visual" ref={visual}>
        <ComparisonWindow
          scene={scene}
          locale={locale}
          moving={playing && !choosingSample}
          pause={pause}
          previousScene={homeComparisons[(index - 1 + homeComparisons.length) % homeComparisons.length]}
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
