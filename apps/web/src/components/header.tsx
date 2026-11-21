"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  messages,
  publicHref,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";
import { Dialog } from "./ui";
export type Theme = "light" | "dark" | "system";
export function Header({
  locale,
  theme,
  workspace = false,
}: {
  locale: Locale;
  theme: Theme;
  workspace?: boolean;
}) {
  const t = messages(locale),
    router = useRouter(),
    path = usePathname();
  const [selection, setSelection] = useState(theme);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const links = workspace
    ? (["home", "tools", "files", "projects", "shared", "settings"] as const)
    : (["features", "about", "pricing", "resources", "contact"] as const);
  const href = (key: string) =>
    workspace
      ? key === "home"
        ? "/app"
        : key === "tools"
          ? "/app/library"
          : "/app/" + key
      : publicHref("/" + key, locale);
  return (
    <>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <header className="header">
        <Link
          href={workspace ? "/app" : publicHref("/", locale)}
          className="identity"
          aria-label="Vastu Nord"
        >
          Vastu Nord
          <span className="identity-note">
            {workspace ? "STUDIO" : "DESIGN · KNOWLEDGE"}
          </span>
        </Link>
        <nav className="desktop-nav" aria-label={t.menu}>
          {!workspace &&
            links.map((k) => (
              <Link
                key={k}
                href={href(k)}
                aria-current={path === href(k) ? "page" : undefined}
              >
                {t[k]}
              </Link>
            ))}
        </nav>
        <div className="preferences">
          <label className="sr-only" htmlFor="language">
            {t.language}
          </label>
          <select
            id="language"
            value={locale}
            onChange={(e) => {
              const next = e.target.value as Locale;
              document.cookie =
                "vn-locale=" + next + ";path=/;max-age=31536000;samesite=lax";
              const target = switchLocalePath(path, next);
              if (target === path) router.refresh();
              else router.push(target);
            }}
          >
            <option value="nb-NO">Norsk</option>
            <option value="en">English</option>
          </select>
          <label className="sr-only" htmlFor="theme">
            {t.theme}
          </label>
          <select
            id="theme"
            value={selection}
            onChange={(e) => {
              const next = e.target.value as Theme;
              setSelection(next);
              document.documentElement.dataset.theme = next;
              document.cookie =
                "vn-theme=" + next + ";path=/;max-age=31536000;samesite=lax";
            }}
          >
            <option value="system">{t.system}</option>
            <option value="light">{t.light}</option>
            <option value="dark">{t.dark}</option>
          </select>
        </div>
        <details className="mobile-nav">
          <summary>{t.menu}</summary>
          <nav aria-label={t.menu}>
            {links.map((k) => (
              <Link
                key={k}
                href={href(k)}
                onClick={(e) =>
                  e.currentTarget.closest("details")?.removeAttribute("open")
                }
              >
                {t[k]}
              </Link>
            ))}
            <Link href={workspace ? publicHref("/", locale) : "/app/library"}>
              {workspace ? t.home : "Studio"}
            </Link>
          </nav>
        </details>
      </header>
      <div className="notice">
        <span>{t.foundation}</span>
        <Dialog label={t.info} close={t.close}>
          <p>{t.status}</p>
          <p>{t.privacy}</p>
        </Dialog>
      </div>
    </>
  );
}
