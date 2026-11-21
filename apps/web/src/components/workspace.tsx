import Link from "next/link";
import type { ReactNode } from "react";
import { messages, type Locale } from "@/lib/i18n";
export function StudioShell({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const t = messages(locale);
  return (
    <div className="workspace">
      <aside className="sidebar">
        <p className="eyebrow">STUDIO</p>
        <nav aria-label="Studio">
          {(
            [
              "home",
              "tools",
              "files",
              "projects",
              "shared",
              "search",
              "settings",
            ] as const
          ).map((k, i) => (
            <Link
              key={k}
              href={
                k === "home"
                  ? "/app"
                  : k === "tools"
                    ? "/app/library"
                    : "/app/" + k
              }
            >
              <span aria-hidden="true" className="nav-index">
                0{i + 1}
              </span>
              {t[k]}
            </Link>
          ))}
        </nav>
        <p className="small">{t.privacy}</p>
      </aside>
      <main id="main" className="workspace-main">
        {children}
      </main>
    </div>
  );
}
