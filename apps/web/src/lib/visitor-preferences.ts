// These two local records describe independent choices on this device.
export const CONSENT_KEY = "vn-cookie-choices";
export const NEWSLETTER_KEY = "vn-newsletter-display";
export const CONSENT_VERSION = 1;
const NEWSLETTER_VERSION = 1;
const changed = "vn:visitor-preferences";
const memory = new Map<string, string>();

export type CookieChoices = {
  version: number;
  decidedAt: string;
  statistics: boolean;
  marketing: boolean;
};
export type NewsletterDisplay = "minimized" | "confirmed";

export function readPreference(key: string): string | null {
  try {
    return memory.get(key) ?? window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function savePreference(key: string, value: object) {
  const serialized = JSON.stringify(value);
  try {
    window.localStorage.setItem(key, serialized);
    memory.delete(key);
  } catch {
    memory.set(key, serialized);
  }
  window.dispatchEvent(new Event(changed));
}

export function observePreferences(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(changed, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(changed, notify);
  };
}

export function parseCookieChoices(raw: string | null): CookieChoices | null {
  try {
    const data = JSON.parse(raw ?? "null");
    if (
      data?.version === CONSENT_VERSION &&
      typeof data.statistics === "boolean" &&
      typeof data.marketing === "boolean" &&
      typeof data.decidedAt === "string" &&
      Number.isFinite(Date.parse(data.decidedAt))
    )
      return data;
  } catch {
    /* A damaged record requires a new choice. */
  }
  return null;
}

export function saveCookieChoices(statistics: boolean, marketing: boolean) {
  savePreference(CONSENT_KEY, {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    statistics,
    marketing,
  });
}

export function parseNewsletterDisplay(
  raw: string | null,
): NewsletterDisplay | null {
  try {
    const data = JSON.parse(raw ?? "null");
    if (
      data?.version === NEWSLETTER_VERSION &&
      (data.state === "minimized" || data.state === "confirmed")
    ) {
      return data.state;
    }
  } catch {
    /* Unknown invitation states are ignored. */
  }
  return null;
}

export function setNewsletterDisplay(state: NewsletterDisplay) {
  savePreference(NEWSLETTER_KEY, { version: NEWSLETTER_VERSION, state });
}
