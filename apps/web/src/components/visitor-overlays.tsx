"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
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
    requestAnimationFrame(focusMain);
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
              ? "Necessary storage remembers your settings. Optional categories are off. "
              : "Nødvendig lagring husker innstillingene dine. Valgfrie kategorier er slått av. "}
            <Link href={publicHref("/privacy", locale)}>
              {en ? "Privacy and cookies" : "Personvern og informasjonskapsler"}
            </Link>
          </p>
        </div>
        <div className="vn-consent-actions">
          <button type="button" onClick={() => choose(true)}>
            {en ? "Accept all" : "Godta alle"}
          </button>
          <button type="button" onClick={() => choose(false)}>
            {en ? "Reject optional" : "Avvis valgfrie"}
          </button>
          <button type="button" onClick={context.customize}>
            {en ? "Customize" : "Tilpass"}
          </button>
        </div>
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
          ? "Choose what this site may store on your device. You can change your choices in the footer at any time."
          : "Velg hva nettstedet kan lagre på enheten din. Du kan endre valgene nederst på siden når som helst."}
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

function Mark({ mail = false }: { mail?: boolean }) {
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
      {mail ? (
        <>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </>
      ) : (
        <path d="M12 2.5c1.2 5.9 3.6 8.3 9.5 9.5-5.9 1.2-8.3 3.6-9.5 9.5C10.8 15.6 8.4 13.2 2.5 12c5.9-1.2 8.3-3.6 9.5-9.5Z" />
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
    dialog.showModal();
    return () => dialog.close();
  }, []);
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
          {layer !== "preferences" && <Mark mail={layer === "newsletter"} />}
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
}: {
  children: ReactNode;
  initialLocale: Locale;
  newsletterEnabled: boolean;
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
  const launch = (kind: Layer) => {
    previousFocus.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setOpen({ layer: kind, pathname });
  };
  function openOffer() {
    // Mark the automatic offer as seen before presenting it, including a reload mid-dialog.
    setNewsletterDisplay("minimized");
    launch("newsletter");
  }
  function close() {
    setOpen(null);
    requestAnimationFrame(() => {
      if (window.location.pathname !== pathname) return;
      const next =
        layer === "newsletter" ? newsletterDock.current : previousFocus.current;
      if (next?.isConnected) next.focus({ preventScroll: true });
      else focusMain();
    });
  }
  useNewsletterDelay(
    rawOffer !== undefined &&
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
        {dockRoute && display === "minimized" && choices && (
          <button
            ref={newsletterDock}
            type="button"
            className="vn-dock-button vn-newsletter-dock"
            aria-haspopup="dialog"
            aria-expanded={layer === "newsletter"}
            onClick={openOffer}
          >
            <Mark mail />
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
          <Mark />
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
            <PranaPanel locale={locale} />
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
