"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { publicHref, type Locale } from "@/lib/i18n";
import {
  CONSENT_KEY,
  NEWSLETTER_KEY,
  observePreferences,
  parseCookieChoices,
  parseNewsletterDisplay,
  readPreference,
  saveCookieChoices,
  setNewsletterDisplay,
  type CookieChoices,
} from "@/lib/visitor-preferences";
import { useNewsletterDelay } from "./newsletter-delay";
import { NewsletterInvitation } from "./newsletter-invitation";
import { PranaPanel } from "./prana-panel";
import "./visitor-overlays.css";

const VisitorContext = createContext<{
  ready: boolean;
  choices: CookieChoices | null;
  customize: () => void;
} | null>(null);
type Layer = "preferences" | "newsletter" | "prana";
const serverPreference = (): undefined => undefined;

function observeLanguage(notify: () => void) {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
  return () => observer.disconnect();
}
const readLanguage = (): Locale =>
  document.documentElement.lang === "en" ? "en" : "nb-NO";

function focusMain() {
  const main = document.querySelector("main");
  if (!main) return;
  if (!main.hasAttribute("tabindex")) main.tabIndex = -1;
  main.focus({ preventScroll: true });
}

export function CookieNotice({ locale }: { locale: Locale }) {
  const context = useContext(VisitorContext);
  if (!context?.ready || context.choices) return null;
  const en = locale === "en";
  function choose(value: boolean) {
    saveCookieChoices(value, value);
    requestAnimationFrame(() =>
      document
        .getElementById("vn-cookie-launcher")
        ?.focus({ preventScroll: true }),
    );
  }
  return (
    <aside className="vn-cookie-notice" aria-labelledby="vn-cookie-title">
      <div className="vn-notice-content">
        <div>
          <h2 id="vn-cookie-title">
            {en ? "Your cookie choices" : "Dine valg for informasjonskapsler"}
          </h2>
          <p>
            {en
              ? "We remember your privacy choices. Optional statistics and marketing are off until you choose."
              : "Vi husker personvernvalgene dine. Valgfri statistikk og markedsføring er avslått til du tar et valg."}
          </p>
          <Link href={publicHref("/privacy", locale)}>
            {en ? "Privacy and cookies" : "Personvern og informasjonskapsler"}
          </Link>
        </div>
        <div className="vn-consent-actions">
          <button type="button" onClick={() => choose(false)}>
            {en ? "Reject optional" : "Avvis valgfrie"}
          </button>
          <button type="button" onClick={() => choose(true)}>
            {en ? "Accept all" : "Godta alle"}
          </button>
        </div>
        <button
          className="vn-notice-details"
          type="button"
          onClick={context.customize}
        >
          {en ? "Customize" : "Tilpass"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </aside>
  );
}

export function CookieSettingsButton({ locale }: { locale: Locale }) {
  const context = useContext(VisitorContext);
  return (
    <button
      type="button"
      className="vn-footer-cookie"
      onClick={context?.customize}
    >
      {locale === "en"
        ? "Cookie settings"
        : "Innstillinger for informasjonskapsler"}
    </button>
  );
}

function CookiePreferences({
  locale,
  choices,
  close,
}: {
  locale: Locale;
  choices: CookieChoices | null;
  close: () => void;
}) {
  const en = locale === "en";
  const [statistics, setStatistics] = useState(choices?.statistics ?? false);
  const [marketing, setMarketing] = useState(choices?.marketing ?? false);
  return (
    <form
      className="vn-visitor-content vn-cookie-form"
      onSubmit={(event) => {
        event.preventDefault();
        saveCookieChoices(statistics, marketing);
        close();
      }}
    >
      <p>
        {en
          ? "Choose what this site may store on your device. Use the cookie button to change these choices at any time."
          : "Velg hva nettstedet kan lagre på enheten din. Bruk knappen med informasjonskapselen for å endre valgene når du vil."}
      </p>
      <div className="vn-choice-list">
        <div className="vn-choice-row">
          <div>
            <strong>{en ? "Strictly necessary" : "Strengt nødvendig"}</strong>
            <small>
              {en
                ? "Language, appearance, your choices and secure sessions where available."
                : "Språk, utseende, valgene dine og sikre økter der tjenesten er tilgjengelig."}
            </small>
          </div>
          <span>{en ? "Always on" : "Alltid på"}</span>
        </div>
        <label className="vn-choice-row">
          <span>
            <strong id="vn-stat-label">
              {en ? "Statistics" : "Statistikk"}
            </strong>
            <small id="vn-stat-notes">
              {en
                ? "Allow optional audience measurement."
                : "Tillat valgfri måling av bruk."}
            </small>
          </span>
          <input
            type="checkbox"
            aria-labelledby="vn-stat-label"
            aria-describedby="vn-stat-notes"
            checked={statistics}
            onChange={(event) => setStatistics(event.target.checked)}
          />
        </label>
        <label className="vn-choice-row">
          <span>
            <strong id="vn-mkt-label">
              {en ? "Marketing" : "Markedsføring"}
            </strong>
            <small id="vn-mkt-notes">
              {en
                ? "Allow optional marketing tracking."
                : "Tillat valgfri sporing for markedsføring."}
            </small>
          </span>
          <input
            type="checkbox"
            aria-labelledby="vn-mkt-label"
            aria-describedby="vn-mkt-notes"
            checked={marketing}
            onChange={(event) => setMarketing(event.target.checked)}
          />
        </label>
      </div>
      <p className="vn-fine-print">
        {en
          ? "This site currently runs no optional analytics or advertising trackers."
          : "Nettstedet bruker for tiden ingen valgfrie analyse- eller annonsesporere."}{" "}
        <Link href={publicHref("/privacy", locale)} onClick={close}>
          {en ? "Privacy and cookies" : "Personvern og informasjonskapsler"}
        </Link>
      </p>
      <button type="submit" className="vn-panel-action">
        {en ? "Save choices" : "Lagre valg"}
      </button>
    </form>
  );
}

function DockIcon({ kind }: { kind: "cookie" | "ticket" }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {kind === "ticket" ? (
        <>
          <path d="M3 5.5h18v4a2.5 2.5 0 0 0 0 5v4H3v-4a2.5 2.5 0 0 0 0-5z" />
          <path d="M15 6v2m0 3v2m0 3v2" />
        </>
      ) : (
        <>
          <path d="M20.7 12.5A8.8 8.8 0 1 1 11.4 3.2a4 4 0 0 0 4.4 5.2 4.1 4.1 0 0 0 4.9 4.1Z" />
          <g fill="currentColor" stroke="none">
            <circle cx="8.6" cy="9.1" r="1" />
            <circle cx="7.5" cy="14" r="1.3" />
            <circle cx="12.7" cy="12.4" r=".9" />
            <circle cx="14" cy="16.6" r="1.15" />
          </g>
        </>
      )}
    </svg>
  );
}

function VisitorDialog({
  layer,
  title,
  closeLabel,
  dismiss,
  children,
}: {
  layer: Layer;
  title: string;
  closeLabel: string;
  dismiss: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    if (layer === "prana") dialog.show();
    else dialog.showModal();
    return () => dialog.close();
  }, [layer]);
  useEffect(() => {
    if (layer !== "prana") return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); dismiss(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [layer, dismiss]);
  return (
    <dialog
      ref={ref}
      className={"vn-visitor-dialog vn-" + layer + "-dialog"}
      aria-labelledby="vn-panel-title"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onKeyDown={(event) => {
        if (layer === "prana") return;
        if (event.key !== "Tab") return;
        const stops = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href],button,input,textarea,select,[tabindex]",
          ),
        ).filter(
          (el) =>
            !el.matches(":disabled") &&
            el.tabIndex >= 0 &&
            el.getClientRects().length > 0,
        );
        const first = stops[0],
          last = stops.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <div className="vn-panel-heading">
        <h2 id="vn-panel-title">
          {layer === "prana" && (
            <Image alt="" src="/brand/prana.svg" width={37} height={37} />
          )}
          {title}
        </h2>
        <button
          type="button"
          className="vn-panel-close"
          aria-label={closeLabel}
          onClick={dismiss}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {children}
    </dialog>
  );
}

function allowsNewsletter(path: string) {
  const segment = path.replace(/^\/en(?=\/|$)/, "").split("/")[1] || "";
  return ["", "features", "about", "pricing", "resources", "contact"].includes(
    segment,
  );
}

export function VisitorExperience({
  children,
  initialLocale,
  newsletterEnabled,
  pranaEnabled,
  filmId,
}: {
  children: ReactNode;
  initialLocale: Locale;
  newsletterEnabled: boolean;
  pranaEnabled: boolean;
  filmId?: string;
}) {
  const pathname = usePathname();
  const language = useSyncExternalStore(
    observeLanguage,
    readLanguage,
    () => initialLocale,
  );
  const locale =
    pathname === "/app" || pathname.startsWith("/app/")
      ? language
      : pathname === "/en" || pathname.startsWith("/en/")
        ? "en"
        : "nb-NO";
  const en = locale === "en";
  const rawConsent = useSyncExternalStore(
    observePreferences,
    () => readPreference(CONSENT_KEY),
    serverPreference,
  );
  const rawOffer = useSyncExternalStore(
    observePreferences,
    () => readPreference(NEWSLETTER_KEY),
    serverPreference,
  );
  const choices = parseCookieChoices(rawConsent ?? null);
  const display = parseNewsletterDisplay(rawOffer ?? null);
  const [open, setOpen] = useState<{ layer: Layer; pathname: string } | null>(
    null,
  );
  if (open && open.pathname !== pathname) setOpen(null);
  const newsletterRoute = allowsNewsletter(pathname);
  const dockRoute =
    newsletterRoute || pathname === "/privacy" || pathname === "/en/privacy";
  const level = open?.pathname === pathname ? open.layer : null;
  const layer =
    level === "newsletter" &&
    (!choices || !dockRoute || display === "confirmed")
      ? null
      : level;
  const newsletterDock = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    let pointerDown = false;
    let pointerReset: ReturnType<typeof setTimeout> | undefined;
    const endPointer = () => { clearTimeout(pointerReset); pointerDown = false; };
    const beginPointer = () => { clearTimeout(pointerReset); pointerDown = true; };
    // Touch focus may arrive after pointerup but before its synthesized click.
    const releasePointer = () => { clearTimeout(pointerReset); pointerReset = setTimeout(endPointer, 0); };
    const keyboardInput = endPointer;
    function keepFocusedControlVisible(event: FocusEvent) {
      if (pointerDown || window.matchMedia("(min-width: 768px)").matches) return;
      const focused = event.target;
      if (!(focused instanceof HTMLElement) || !focused.matches("a[href], button, input, select, textarea, summary")) return;
      // Dialogs manage their own focus and should not trigger page scrolling.
      if (focused.closest('[role="dialog"]')) return;
      const target = focused instanceof HTMLInputElement && (focused.type === "radio" || focused.type === "checkbox")
        ? focused.closest("label") ?? focused : focused;
      const rect = target.getBoundingClientRect();
      const overlap = [...document.querySelectorAll(".vn-cookie-dock, .vn-prana-dock, .vn-newsletter-dock")].some((dock) => {
        if (dock === target || dock.contains(target)) return false;
        const obstacle = dock.getBoundingClientRect();
        return rect.left < obstacle.right && rect.right > obstacle.left && rect.top < obstacle.bottom && rect.bottom > obstacle.top;
      });
      if (overlap) target.scrollIntoView({ block: "center", inline: "nearest" });
    }
    document.addEventListener("pointerdown", beginPointer, true);
    document.addEventListener("pointerup", releasePointer, true);
    document.addEventListener("pointercancel", endPointer, true);
    document.addEventListener("keydown", keyboardInput, true);
    window.addEventListener("blur", endPointer);
    document.addEventListener("focusin", keepFocusedControlVisible);
    return () => {
      document.removeEventListener("pointerdown", beginPointer, true);
      document.removeEventListener("pointerup", releasePointer, true);
      document.removeEventListener("pointercancel", endPointer, true);
      document.removeEventListener("keydown", keyboardInput, true);
      window.removeEventListener("blur", endPointer);
      clearTimeout(pointerReset);
      document.removeEventListener("focusin", keepFocusedControlVisible);
    };
  }, []);
  const launch = (kind: Layer) => {
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setOpen({ layer: kind, pathname });
  };
  const openPrana = useEffectEvent(() => launch("prana"));
  useEffect(() => {
    const fromHeader = () => openPrana();
    window.addEventListener("vn:open-prana", fromHeader);
    const url = new URL(window.location.href);
    const frame =
      url.searchParams.get("assistant") === "prana"
        ? requestAnimationFrame(() => {
            url.searchParams.delete("assistant");
            window.history.replaceState(window.history.state, "", url);
            openPrana();
          })
        : undefined;
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("vn:open-prana", fromHeader);
    };
  }, [pathname]);
  function openOffer() {
    // Mark the automatic offer as seen before presenting it, including a reload mid-dialog.
    setNewsletterDisplay("minimized");
    launch("newsletter");
  }
  function close() {
    setOpen(null);
    requestAnimationFrame(() => {
      if (window.location.pathname !== pathname) return;
      const invoker = previousFocus.current;
      const next =
        layer === "newsletter"
          ? newsletterDock.current
          : layer === "preferences" && !invoker?.isConnected
            ? document.getElementById("vn-cookie-launcher")
            : invoker;
      if (next?.isConnected) next.focus({ preventScroll: true });
      else focusMain();
    });
  }
  useNewsletterDelay(
    rawOffer !== undefined &&
      newsletterEnabled &&
      Boolean(choices) &&
      !display &&
      !layer &&
      newsletterRoute,
    pathname,
    openOffer,
  );
  return (
    <VisitorContext.Provider
      value={{
        ready: rawConsent !== undefined,
        choices,
        customize: () => launch("preferences"),
      }}
    >
      {children}
      <div className="vn-visitor-dock">
        {choices && (
          <button
            id="vn-cookie-launcher"
            type="button"
            className="vn-dock-button vn-cookie-dock"
            aria-label={
              en
                ? "Change cookie preferences"
                : "Endre valg for informasjonskapsler"
            }
            aria-haspopup="dialog"
            aria-expanded={layer === "preferences"}
            onClick={() => launch("preferences")}
          >
            <DockIcon kind="cookie" />
          </button>
        )}
        {newsletterEnabled && dockRoute && display === "minimized" && choices && (
          <button
            ref={newsletterDock}
            type="button"
            className="vn-dock-button vn-newsletter-dock"
            aria-haspopup="dialog"
            aria-expanded={layer === "newsletter"}
            onClick={openOffer}
          >
            <DockIcon kind="ticket" />
            {en ? "Newsletter" : "Nyhetsbrev"}
          </button>
        )}
        <button
          type="button"
          className="vn-dock-button vn-prana-dock"
          aria-label={en ? "Open Prana assistant" : "Åpne Prana-assistenten"}
          aria-haspopup="dialog"
          aria-expanded={layer === "prana"}
          onClick={() => launch("prana")}
        >
          <Image alt="" src="/brand/prana.svg" width={33} height={33} />
          Prana
        </button>
      </div>
      {layer && (
        <VisitorDialog
          key={layer}
          layer={layer}
          title={
            layer === "prana"
              ? "VastuNord Prana"
              : layer === "newsletter"
                ? en
                  ? "Vastu Nord newsletter"
                  : "Nyhetsbrev fra Vastu Nord"
                : en
                  ? "Cookie settings"
                  : "Innstillinger for informasjonskapsler"
          }
          closeLabel={en ? "Close" : "Lukk"}
          dismiss={close}
        >
          {layer === "prana" ? (
            <PranaPanel locale={locale} enabled={pranaEnabled} filmId={filmId} />
          ) : layer === "newsletter" ? (
            <NewsletterInvitation
              locale={locale}
              available={newsletterEnabled}
              dismiss={close}
            />
          ) : (
            <CookiePreferences
              choices={choices}
              locale={locale}
              close={close}
            />
          )}
        </VisitorDialog>
      )}
    </VisitorContext.Provider>
  );
}
