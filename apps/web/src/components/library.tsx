"use client";
import { useState } from "react";
import Link from "next/link";
import { tools, categories } from "@vastunord/contracts/tools";
import { messages, formatNumber, type Locale } from "@/lib/i18n";
import { Input } from "./ui";
export function Library({ locale }: { locale: Locale }) {
  const t = messages(locale);
  const [category, setCategory] = useState("all"),
    [search, setSearch] = useState("");
  const shown = tools.filter(
    (tool) =>
      (category === "all" || tool.category === category) &&
      tool.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="section-heading">
        <p className="eyebrow">
          STUDIO / {formatNumber(tools.length, locale)} {t.tools}
        </p>
        <h1>{t.library}</h1>
        <p>{t.libraryIntro}</p>
      </div>
      <div className="library-toolbar">
        <label className="search-field">
          {t.search}
          <Input
            type="search"
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
      <p className="small" role="status">
        {formatNumber(shown.length, locale)} /{" "}
        {formatNumber(tools.length, locale)} {t.tools}
      </p>
      <div className="tool-grid">
        {shown.map((tool) => (
          <Link className="tool-card" key={tool.id} href={tool.route}>
            <div
              className={"tool-art art-" + categories.indexOf(tool.category)}
              aria-hidden="true"
            >
              <span>{String(tools.indexOf(tool) + 1).padStart(2, "0")}</span>
              <div className="geometry" />
            </div>
            <div className="tool-card-copy">
              <span className="eyebrow">{t[tool.category]}</span>
              <h2>{tool.name}</h2>
              <span>{t.open} ↗</span>
            </div>
          </Link>
        ))}
      </div>
      {shown.length === 0 && <p>{t.noResults}</p>}
    </>
  );
}
