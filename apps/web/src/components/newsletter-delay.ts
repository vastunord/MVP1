"use client";

import { useEffect, useEffectEvent, useRef } from "react";

const OFFER_DELAY_MS = 27_000;

export function useNewsletterDelay(
  eligible: boolean,
  pathname: string,
  offer: () => void,
) {
  const remaining = useRef(OFFER_DELAY_MS);
  const show = useEffectEvent(offer);
  useEffect(() => {
    if (!eligible) return;
    let started: number | undefined;
    let timer: number | undefined;
    let disposed = false;
    const editedForms = new Set<HTMLFormElement>();

    function pause() {
      if (started !== undefined)
        remaining.current = Math.max(
          0,
          remaining.current - (Date.now() - started),
        );
      started = undefined;
      window.clearTimeout(timer);
    }
    function busy() {
      for (const form of editedForms)
        if (!form.isConnected) editedForms.delete(form);
      return (
        document.visibilityState !== "visible" ||
        !document.hasFocus() ||
        Boolean(
          document.activeElement?.closest(
            "form, input, textarea, select, [contenteditable=true]",
          ),
        ) ||
        Boolean(
          document.querySelector(
            "dialog[open], [aria-modal=true]:not(dialog), [aria-controls=vg-menu][aria-expanded=true]",
          ),
        ) ||
        editedForms.size > 0
      );
    }
    function update() {
      if (disposed) return;
      if (busy()) {
        pause();
        return;
      }
      if (started !== undefined) return;
      started = Date.now();
      timer = window.setTimeout(() => {
        pause();
        if (!busy()) show();
      }, remaining.current);
    }
    function trackForm(event: Event) {
      if (event.target instanceof Element) {
        const form = event.target.closest("form");
        if (form) {
          if (event.type === "input") editedForms.add(form);
          else editedForms.delete(form);
        }
      }
      update();
    }
    function afterFocusChange() {
      queueMicrotask(update);
    }
    // Native dialogs, expandable navigation and editors can open outside this provider.
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["open", "aria-expanded", "aria-modal"],
    });
    document.addEventListener("visibilitychange", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", afterFocusChange);
    window.addEventListener("focus", update);
    window.addEventListener("blur", pause);
    for (const type of ["input", "submit", "reset"])
      document.addEventListener(type, trackForm);
    update();
    return () => {
      disposed = true;
      pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", afterFocusChange);
      window.removeEventListener("focus", update);
      window.removeEventListener("blur", pause);
      for (const type of ["input", "submit", "reset"])
        document.removeEventListener(type, trackForm);
    };
  }, [eligible, pathname]);
}
