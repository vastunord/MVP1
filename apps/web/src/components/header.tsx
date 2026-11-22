"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  messages,
  publicHref,
  switchLocalePath,
  type Locale,
} from "@/lib/i18n";
import { destinations, translated } from "@/lib/workspace-catalog";
import { Dialog } from "./ui";
import "./header-v7.css";

export type Theme = "light" | "dark" | "system";
type HeaderLink = { href: string; label: string };
const schemeQuery = "(prefers-color-scheme: dark)";
const toolEntry = "/app/tools/room-reimagination";

function subscribeToScheme(notify: () => void) {
  const query = window.matchMedia(schemeQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

function saveLocale(locale: Locale) {
  document.cookie = `vn-locale=${locale};path=/;max-age=31536000;samesite=lax`;
}

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  document.cookie = `vn-theme=${theme};path=/;max-age=31536000;samesite=lax`;
}

function Preferences({ locale, theme }: { locale: Locale; theme: Theme }) {
  const t = messages(locale);
  const path = usePathname();
  const router = useRouter();
  const [selection, setSelection] = useState(theme);
  const systemDark = useSyncExternalStore(
    subscribeToScheme,
    () => window.matchMedia(schemeQuery).matches,
    () => false,
  );
  const effectiveTheme =
    selection === "system" ? (systemDark ? "dark" : "light") : selection;
  function chooseLocale(next: Locale) {
    if (locale === next) return;
    saveLocale(next);
    const target = switchLocalePath(path, next);
    if (target === path) router.refresh();
    else
      router.push(target + window.location.search + window.location.hash, {
        scroll: false,
      });
  }
  function chooseTheme(next: "light" | "dark") {
    setSelection(next);
    applyTheme(next);
  }
  return (
    <div className="vg-preferences">
      <div
        className="vg-segment"
        role="group"
        aria-label={t.language}
        id="language"
        tabIndex={-1}
      >
        {(["nb-NO", "en"] as const).map((language) => (
          <button
            key={language}
            type="button"
            lang={language}
            aria-label={
              language === "en" ? "EN – English" : "NO – Norsk bokmål"
            }
            aria-pressed={locale === language}
            onClick={() => chooseLocale(language)}
          >
            {language === "en" ? "EN" : "NO"}
          </button>
        ))}
      </div>
      <div
        className="vg-segment"
        role="group"
        aria-label={t.theme}
        id="theme"
        tabIndex={-1}
      >
        {(["light", "dark"] as const).map((value) => (
          <button
            key={value}
            type="button"
            lang="en"
            aria-pressed={effectiveTheme === value}
            onClick={() => chooseTheme(value)}
          >
            {value === "light" ? "Light" : "Dark"}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Header({
  locale,
  theme,
  workspace = false,
  authReady = false,
  signedIn = false,
}: {
  locale: Locale;
  theme: Theme;
  workspace?: boolean;
  authReady?: boolean;
  signedIn?: boolean;
}) {
  const t = messages(locale);
  const en = locale === "en";
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    document.documentElement.lang = locale;
    if (!workspace) saveLocale(locale);
  }, [locale, workspace]);
  useEffect(() => {
    if (!menuOpen) return;
    const dismissOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !header.current?.contains(event.target)
      )
        setMenuOpen(false);
    };
    const closeAtDesktop = window.matchMedia("(min-width: 75rem)");
    const onResize = () => {
      if (closeAtDesktop.matches) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", dismissOutside);
    closeAtDesktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      closeAtDesktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  const marketingLinks: HeaderLink[] = [
    { href: publicHref("/features", locale), label: t.features },
    { href: publicHref("/about", locale), label: t.about },
    { href: publicHref("/pricing", locale), label: t.pricing },
    { href: "/app/renders", label: en ? "Gallery" : "Galleri" },
    { href: publicHref("/resources", locale), label: t.resources },
    { href: publicHref("/contact", locale), label: t.contact },
  ];
  const studioLinks = destinations
    .filter((d) => d.href !== "/app/prana")
    .map((d) => ({
      href: d.href,
      label: translated(d.title, locale),
    }));
  const primaryLinks = workspace
    ? studioLinks.filter((d) =>
        ["/app", "/app/library", "/app/renders", "/app/knowledge"].includes(
          d.href,
        ),
      )
    : marketingLinks;
  const account = signedIn
    ? { href: "/app/settings", label: en ? "My account" : "Min konto" }
    : { href: publicHref("/login", locale), label: t.login };
  const compactLinks = workspace
    ? studioLinks.filter((d) => d.href !== account.href)
    : [...marketingLinks, { href: "/app/library", label: t.library }];
  function link(item: HeaderLink) {
    const active =
      path === item.href ||
      (item.href !== "/app" && path.startsWith(item.href + "/")) ||
      (item.href === "/app/library" && path.startsWith("/app/tools/")) ||
      (item.href === "/app" && path === "/app/dashboard");
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={() => setMenuOpen(false)}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <>
      <a className="skip" href="#main">
        {t.skip}
      </a>
      <header
        ref={header}
        className="vg-header"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setMenuOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            event.preventDefault();
            setMenuOpen(false);
            menuButton.current?.focus();
          }
        }}
      >
        <div className="vg-bar">
          <Link
            href={publicHref("/", locale)}
            className="vg-brand"
            aria-label={en ? "Vastu Nord home" : "Vastu Nord hjem"}
          >
            {(["teal", "ivory"] as const).map((tone) => (
              <Image
                key={tone}
                unoptimized
                className={"vg-logo-" + tone}
                src={"/brand/vastunord-primary-" + tone + ".svg"}
                alt=""
                width={217}
                height={20}
              />
            ))}
          </Link>
          <nav
            aria-label={en ? "Primary navigation" : "Hovednavigasjon"}
            className="vg-primary"
          >
            {primaryLinks.map(link)}
          </nav>
          <Link
            className="vg-prana"
            href="/app/prana"
            aria-label="VastuNord Prana"
            aria-current={path === "/app/prana" ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            >
              <path d="M12 2.5c1.2 5.9 3.6 8.3 9.5 9.5-5.9 1.2-8.3 3.6-9.5 9.5C10.8 15.6 8.4 13.2 2.5 12c5.9-1.2 8.3-3.6 9.5-9.5Z" />
            </svg>
            Prana
          </Link>
          <Preferences locale={locale} theme={theme} />
          <div className="vg-account">{link(account)}</div>
          <Link
            className="vg-create"
            href={toolEntry}
            onClick={() => setMenuOpen(false)}
          >
            {en ? "Open Studio" : "Åpne Studio"}{" "}
            <span aria-hidden="true">↗</span>
          </Link>
          <button
            className="vg-menu-toggle"
            type="button"
            ref={menuButton}
            aria-expanded={menuOpen}
            aria-controls="vg-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            >
              <path
                d={
                  menuOpen ? "M5 5l14 14M19 5 5 19" : "M3 6h18M3 12h18M3 18h18"
                }
              />
            </svg>
            <span>{t.menu}</span>
          </button>
          <nav
            hidden={!menuOpen}
            id="vg-menu"
            className="vg-panel"
            aria-label={t.menu}
          >
            {compactLinks.map(link)}
            {link(account)}
          </nav>
        </div>
      </header>
      <div className="notice">
        <span>{t.foundation}</span>
        <Dialog label={t.info} close={t.close}>
          <p>
            {authReady
              ? en
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
