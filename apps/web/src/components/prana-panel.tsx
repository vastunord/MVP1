"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { guides } from "./workspace-experience-data";
import { PranaConsultation } from "./prana-consultation";
import { PranaFilm } from "./prana-film";
import { TopicChoices } from "./topic-choices";
import "./prana-panel.css";

const tabs = ["Prana", "Quick Tips", "Film"] as const;

export function PranaPanel({ locale, enabled, filmId }: { locale: Locale; enabled: boolean; filmId?: string }) {
  const t = (nb: string, en: string) => (locale === "en" ? en : nb);
  const [tab, setTab] = useState(0);
  const [topic, setTopic] = useState(0);
  const guide = guides[topic];
  const id = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  function activate(next: number) {
    setTab(next);
    buttons.current[next]?.focus();
  }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const target = {
      ArrowRight: (index + 1) % tabs.length,
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    activate(target);
  }
  return (
    <div className="prana-content">
      <div className="prana-reader">
        <div
          role="tablist"
          aria-label={t("Visning i Prana", "Prana view")}
          className="prana-tabs"
        >
          {tabs.map((name, index) => (
            <button
              key={name}
              ref={(node) => {
                buttons.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={tab === index}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={tab === index ? 0 : -1}
              onClick={() => setTab(index)}
              onKeyDown={(e) => navigate(e, index)}
            >
              {name}
            </button>
          ))}
        </div>
        {tabs.map((name, index) => (
          <section
            key={name}
            role="tabpanel"
            hidden={tab !== index}
            tabIndex={0}
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
          >
            {index === 0 && (
              <>
                <PranaConsultation key={locale} locale={locale} enabled={enabled} />
                <button
                  className="prana-action"
                  type="button"
                  onClick={() => activate(1)}
                >
                  {t("Utforsk tips", "Explore tips")}{" "}
                  <span aria-hidden="true">→</span>
                </button>
              </>
            )}
            {index === 1 && (
              <>
                <TopicChoices
                  label={t("Velg tema", "Choose a topic")}
                  options={guides.map((guide, id) => ({ id, name: t(...guide.topic) }))}
                  value={topic}
                  onChange={setTopic}
                />
                <h2>{t(...guide.title)}</h2>
                <p>{t(...guide.body)}</p>
                <Link className="prana-text-link" href="/app/knowledge">
                  {t("Se alle guider", "Browse guides")}{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
              </>
            )}
            {index === 2 && tab === 2 && (
              <>
                <PranaFilm locale={locale} featured={filmId} />
                <Link className="prana-text-link" href="/app/home-experience">
                  {t("Åpne boligopplevelsen", "Open Home Experience")}{" "}
                  <span aria-hidden="true">↗</span>
                </Link>
              </>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
