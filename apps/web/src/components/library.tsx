"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { tools, categories } from "@vastunord/contracts/tools";
import { messages, formatNumber, type Locale } from "@/lib/i18n";
import { toolDescription } from "./tool-presentation";
import "./studio-tools.css";

const photos: Record<string, string> = {
  "room-reimagination": "soft",
  "virtual-home-staging": "warm",
  "furniture-refresh": "cover",
  "seasonal-styling": "soft-moss",
  "visual-cleanup": "soft-bright",
  "resolution-enhancement": "soft-day",
  "perspective-correction": "cover",
  "decor-redefinition": "warm",
  "material-refinement": "cover",
  "lighting-reimagination": "soft-evening",
};

function ToolArt({ id }: { id: string }) {
  const photo = photos[id];
  if (photo)
    return (
      <div className={"tool-picture picture-" + id}>
        <Image
          src={"/reference/" + photo + ".webp"}
          alt=""
          fill
          sizes="(max-width: 680px) 90vw, 24vw"
        />
      </div>
    );
  const diagram = {
    "outdoor-visualization": "land",
    "hardscape-design": "paving",
    "garden-design": "garden",
    "pool-redesign": "pool",
    "sky-transformation": "sky",
    "seasonal-transformation": "season",
    "object-placement": "placement",
  }[id];
  return (
    <div
      className={"tool-picture tool-diagram diagram-" + diagram}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
    </div>
  );
}

export function Library({ locale }: { locale: Locale }) {
  const t = messages(locale);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const shown = tools.filter(
    (tool) =>
      (category === "all" || tool.category === category) &&
      [tool.name, t[tool.category], toolDescription(tool.id, locale)]
        .join(" ")
        .toLocaleLowerCase(locale)
        .includes(search.trim().toLocaleLowerCase(locale)),
  );
  return (
    <div className="studio-library">
      <div className="section-heading">
        <Link href="/app">Studio</Link>
        <h1>{t.library}</h1>
        <p>
          {locale === "en"
            ? "Choose the change you want to explore, starting with a photograph of your space."
            : "Ta utgangspunkt i et bilde av rommet eller uterommet ditt. Velg endringen du vil utforske."}
        </p>
      </div>
      <div className="library-toolbar">
        <label className="tool-search">
          <span aria-hidden="true" className="search-mark" />
          <input
            type="search"
            aria-label={t.search}
            placeholder={locale === "en" ? "Search tools" : "Søk etter verktøy"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="filters" role="group" aria-label={t.tools}>
          {["all", ...categories].map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {t[c as keyof typeof t]}
            </button>
          ))}
        </div>
      </div>
      <h2 className="studio-tool-count" role="status">
        {category === "all"
          ? locale === "en"
            ? "All tools"
            : "Alle verktøy"
          : t[category as keyof typeof t]}{" "}
        <span>{formatNumber(shown.length, locale)}</span>
      </h2>
      <div className="tool-grid">
        {shown.map((tool) => (
          <Link className="tool-card" key={tool.id} href={tool.route}>
            <ToolArt id={tool.id} />
            <div className="tool-card-copy">
              <h3 lang="en">{tool.name}</h3>
              <p>{toolDescription(tool.id, locale)}</p>
              <span>
                {t.open} <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!shown.length && (
        <div className="studio-no-tools">
          <p>{t.noResults}</p>
          <button
            className="button"
            onClick={() => {
              setCategory("all");
              setSearch("");
            }}
          >
            {t.clear}
          </button>
        </div>
      )}
    </div>
  );
}
