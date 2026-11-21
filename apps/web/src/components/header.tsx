"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  messages,
  publicHref,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";
import { Dialog } from "./ui";
import { destinations, translated } from "@/lib/workspace-catalog";
export type Theme = "light" | "dark" | "system";
export function Header({
  locale,
  theme,
  workspace = false,
  authReady = false,
}: {
  locale: Locale;
  theme: Theme;
  workspace?: boolean;
  authReady?: boolean;
}) {
  const t = messages(locale),
    router = useRouter(),
    path = usePathname();
  const [selection, setSelection] = useState(theme);
  useEffect(() => {
    document.documentElement.lang = locale;
    if (!workspace) {
      document.cookie =
        "vn-locale=" + locale + ";path=/;max-age=31536000;samesite=lax";
    }
  }, [locale, workspace]);
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
      <header
        className={workspace ? "header vn-app-header" : "header mk-header"}
      >
        <Link
          href={workspace ? "/app" : publicHref("/", locale)}
          className="identity"
          aria-label="Vastu Nord"
        >
          {["teal", "ivory"].map((tone, i) => (
            <Image
              unoptimized
              key={tone}
              className={i ? "mk-brand-dark" : "mk-brand-light"}
              src={"/reference/logo-" + tone + ".png"}
              alt=""
              width={170}
              height={16}
            />
          ))}
          {workspace && <span className="identity-note">STUDIO</span>}
        </Link>
        <nav className="desktop-nav" aria-label={t.menu}>
          {workspace && (
            <Link href={publicHref("/", locale)}>
              {locale === "en" ? "Vastu Nord website" : "Vastu Nords nettsted"}{" "}
              ↗
            </Link>
          )}
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
        {!workspace && (
          <>
            <Link className="mk-head-login" href={publicHref("/login", locale)}>
              {t.login}
            </Link>
            <Link className="mk-head-cta" href="/app/library">
              {locale === "en"
                ? "Visualize my space"
                : "Visualiser rommet mitt"}
            </Link>
          </>
        )}
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
            {(workspace
              ? destinations.map((d) => ({
                  url: d.href,
                  label: translated(d.title, locale),
                }))
              : links.map((k) => ({ url: href(k), label: t[k] }))
            ).map(({ url, label }) => (
              <Link
                key={url}
                href={url}
                onClick={(e) =>
                  e.currentTarget.closest("details")?.removeAttribute("open")
                }
              >
                {label}
              </Link>
            ))}
            {!workspace && <Link href="/app/library">Studio</Link>}
            {workspace && (
              <Link href={publicHref("/", locale)}>
                {locale === "en"
                  ? "Vastu Nord website"
                  : "Vastu Nords nettsted"}{" "}
                ↗
              </Link>
            )}
            {!workspace && (
              <Link href={publicHref("/login", locale)}>{t.login}</Link>
            )}
          </nav>
        </details>
      </header>
      <div className="notice">
        <span>{t.foundation}</span>
        <Dialog label={t.info} close={t.close}>
          <p>
            {authReady
              ? locale === "en"
                ? "Accounts and private projects are available for testing. AI generation is disabled."
                : "Kontoer og private prosjekter er tilgjengelige for testing. AI-generering er deaktivert."
              : t.status}
          </p>
          <p>{t.privacy}</p>
        </Dialog>
      </div>
    </>
  );
}
