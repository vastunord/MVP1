"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { tools } from "@vastunord/contracts/tools";
import type { Locale } from "@/lib/i18n";
import { destinations, translated } from "@/lib/workspace-catalog";
import "./workspace.css";

const shapes = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  folder: "M3 7V5h6l2 3h10v12H3z",
  tools: "M4 7h9m4 0h3M4 17h3m4 0h9M13 4v6m-6 4v6",
  image: "M3 4h18v16H3z M4 18l5-6 4 3 3-5 5 7 M9 8h.1",
  layers: "M2 8l10-5 10 5-10 5z M3 12l9 5 9-5M3 16l9 5 9-5",
  file: "M5 3h9l5 5v13H5z M14 3v6h5 M8 14h8 M8 17h6",
  home: "M2 11l10-8 10 8 M5 10v11h14V10 M10 21v-7h4v7",
  book: "M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2z M12 6v15",
  spark: "M12 2l2.7 7.3L22 12l-7.3 2.7L12 22l-2.7-7.3L2 12l7.3-2.7z",
  chart: "M3 3v18h18 M7 17v-4m5 4V8m5 9V5",
  users:
    "M3 20v-2a5 5 0 0110 0v2 M11 8a3 3 0 11-6 0 3 3 0 016 0 M16 5a3 3 0 010 6 M16 14a5 5 0 015 5",
  wallet: "M3 6l15-3v3 M3 6h18v14H3z M16 10h5v6h-5z",
  search: "M16 10a6 6 0 11-12 0 6 6 0 0112 0 M15 15l6 6",
} as const;

function openWorkspaceSearch(dialog: HTMLDialogElement | null) {
  if (!dialog || dialog.open) return;
  dialog.showModal();
  dialog.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
}

export function WorkspaceIcon({ name }: { name: keyof typeof shapes }) {
  return (
    <svg
      aria-hidden="true"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={shapes[name]} />
    </svg>
  );
}

export function Directory({
  locale,
  onChoose,
}: {
  locale: Locale;
  onChoose?: () => void;
}) {
  const en = locale === "en";
  const [query, setQuery] = useState("");
  const entries = [
    ...destinations.map((d) => ({
      label: translated(d.title, locale),
      href: d.href,
      caption: translated(d.description, locale),
    })),
    ...tools.map((tool) => ({
      label: tool.name,
      href: tool.route,
      caption: en ? "Workflow" : "Arbeidsflyt",
    })),
  ].filter((d) =>
    (d.label + " " + d.href + " " + d.caption)
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <div className="vn-directory">
      <label>
        <span>
          {en ? "Find a screen or workflow" : "Finn en side eller en arbeidsflyt"}
        </span>
        <input
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={en ? "Search Studio…" : "Søk i Studio …"}
        />
      </label>
      <p className="vn-muted" role="status">
        {entries.length} {en ? "matches" : "treff"}
      </p>
      <div className="vn-search-results">
        {entries.map((d) => (
          <Link key={d.href} href={d.href} onClick={onChoose}>
            <span>{d.label}</span>
            <small>{d.caption} <span aria-hidden="true">↗</span></small>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function StudioShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const en = locale === "en";
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const groups = en
    ? ["Studio", "Resources", "Account"]
    : ["Studio", "Ressurser", "Konto"];
  const active =
    destinations.find((d) => d.href === path) ??
    (path.startsWith("/app/tools/")
      ? destinations.find((d) => d.href === "/app/library")
      : destinations.find(
          (d) => d.href !== "/app" && path.startsWith(d.href + "/"),
        ));
  useEffect(() => {
    function shortcut(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else openWorkspaceSearch(dialog.current);
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  return (
    <div className="workspace vn-workspace">
      <aside className="sidebar vn-side">
        <nav aria-label="Studio">
          {groups.map((group, i) => (
            <div key={group} className="vn-nav-group">
              <h2>{group}</h2>
              {destinations
                .filter((d) => d.group === i)
                .map((d) => (
                  <Link
                    key={d.href}
                    aria-current={d.href === active?.href ? (d.href === path ? "page" : "location") : undefined}
                    href={d.href}
                    aria-label={translated(d.title, locale)}
                    aria-describedby={"nav-" + d.icon + "-" + d.href.split("/").pop()}
                  >
                    <WorkspaceIcon name={d.icon} />
                    <span className="vn-nav-copy">{translated(d.title, locale)}
                      <small id={"nav-" + d.icon + "-" + d.href.split("/").pop()}>{translated(d.description, locale)}</small>
                    </span>
                  </Link>
                ))}
            </div>
          ))}
        </nav>
      </aside>
      <main id="main" className="workspace-main vn-main">
        <div className="vn-workspace-bar">
          <span>
            <Link href="/app">Studio</Link>
            {active && active.href !== "/app" && <> / {translated(active.title, locale)}</>}
          </span>
          <button
            className="vn-search-button"
            ref={trigger}
            onClick={() => openWorkspaceSearch(dialog.current)}
          >
            <WorkspaceIcon name="search" />
            {en ? "Search" : "Søk"} <kbd>⌘ / Ctrl K</kbd>
          </button>
        </div>
        {children}
      </main>
      <dialog
        className="vn-search-dialog"
        aria-labelledby="workspace-search-title"
        ref={dialog}
        onKeyDownCapture={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            event.currentTarget.close();
          }
        }}
        onClose={() => trigger.current?.focus()}
      >
        <div className="vn-section-title">
          <h2 id="workspace-search-title">
            {en ? "Search Studio" : "Søk i Studio"}
          </h2>
          <button
            aria-label={en ? "Close" : "Lukk"}
            onClick={() => dialog.current?.close()}
          >
            ×
          </button>
        </div>
        <Directory locale={locale} onChoose={() => dialog.current?.close()} />
      </dialog>
    </div>
  );
}
