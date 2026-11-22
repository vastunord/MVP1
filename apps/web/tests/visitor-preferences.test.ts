import test from "node:test";
import assert from "node:assert/strict";
import {
  CONSENT_KEY,
  NEWSLETTER_KEY,
  observePreferences,
  parseCookieChoices,
  parseNewsletterDisplay,
  readPreference,
  saveCookieChoices,
  setNewsletterDisplay,
} from "../src/lib/visitor-preferences.ts";

test("fresh, damaged or outdated records require a new explicit choice", () => {
  for (const raw of [
    null,
    "{",
    "null",
    "{}",
    JSON.stringify({ version: 0, statistics: true, marketing: true }),
    JSON.stringify({
      version: 1,
      statistics: "yes",
      marketing: false,
      decidedAt: new Date().toISOString(),
    }),
    JSON.stringify({
      version: 1,
      statistics: true,
      marketing: false,
      decidedAt: "wrong",
    }),
  ]) {
    assert.equal(parseCookieChoices(raw), null);
  }
  for (const raw of [
    null,
    "{",
    "true",
    '{"version":2,"state":"confirmed"}',
    '{"version":1,"state":"subscribed"}',
  ]) {
    assert.equal(parseNewsletterDisplay(raw), null);
  }
});

test("consent revocation and newsletter display choices persist independently", () => {
  const values = new Map<string, string>();
  const browser = Object.assign(new EventTarget(), {
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: browser,
  });
  let changes = 0;
  const unsubscribe = observePreferences(() => {
    changes++;
  });
  try {
    saveCookieChoices(true, false);
    const first = parseCookieChoices(readPreference(CONSENT_KEY));
    assert.deepEqual([first?.statistics, first?.marketing], [true, false]);
    assert.equal(parseNewsletterDisplay(readPreference(NEWSLETTER_KEY)), null);
    assert.ok(Date.parse(first!.decidedAt) <= Date.now());
    setNewsletterDisplay("minimized");
    assert.deepEqual(parseCookieChoices(readPreference(CONSENT_KEY)), first);
    saveCookieChoices(false, false);
    assert.equal(
      parseCookieChoices(readPreference(CONSENT_KEY))?.statistics,
      false,
    );
    assert.equal(
      parseNewsletterDisplay(readPreference(NEWSLETTER_KEY)),
      "minimized",
    );
    setNewsletterDisplay("confirmed");
    assert.equal(
      parseNewsletterDisplay(readPreference(NEWSLETTER_KEY)),
      "confirmed",
    );
    assert.equal(changes, 4);
    unsubscribe();
    setNewsletterDisplay("minimized");
    assert.equal(changes, 4);
  } finally {
    unsubscribe();
    Reflect.deleteProperty(globalThis, "window");
  }
});
