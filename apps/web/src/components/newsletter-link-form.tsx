"use client";
import { useState, type FormEvent } from "react";
import { setNewsletterDisplay } from "@/lib/visitor-preferences";
import type { NewsletterAction, NewsletterLocale } from "@/server/newsletter";

export function NewsletterLinkForm({
  action,
  locale,
}: {
  action: NewsletterAction;
  locale: NewsletterLocale;
}) {
  const en = locale === "en";
  const confirm = action === "confirm";
  const [state, setState] = useState<
    "idle" | "busy" | "done" | "invalid" | "error"
  >("idle");
  const label = confirm
    ? en
      ? "Confirm my subscription"
      : "Bekreft påmeldingen"
    : en
      ? "Unsubscribe"
      : "Meld meg av";

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (state === "busy" || state === "done") return;
    const token = window.location.hash.slice(1);
    if (!token) {
      setState("invalid");
      return;
    }
    setState("busy");
    try {
      const response = await fetch("/api/newsletter/" + action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      });
      const result = await response.json();
      if (
        response.ok &&
        result.status === (confirm ? "confirmed" : "unsubscribed")
      ) {
        setState("done");
        window.history.replaceState(null, "", window.location.pathname);
        setNewsletterDisplay(confirm ? "confirmed" : "minimized");
      } else setState(response.status === 400 ? "invalid" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {state !== "done" && (
        <button
          type="submit"
          className="button primary"
          disabled={state === "busy"}
        >
          {label}
        </button>
      )}
      <p role="status" aria-live="polite">
        {state === "busy" && (en ? "Saving…" : "Lagrer…")}
        {state === "done" &&
          (confirm
            ? en
              ? "Your newsletter subscription is confirmed."
              : "Du er nå påmeldt nyhetsbrevet."
            : en
              ? "You have unsubscribed from the newsletter."
              : "Du er avmeldt nyhetsbrevet.")}
        {state === "invalid" &&
          (en
            ? "This link is invalid or has expired."
            : "Lenken er ugyldig eller har utløpt.")}
        {state === "error" &&
          (en
            ? "Newsletter preferences are unavailable right now. Please try again later."
            : "Nyhetsbrevinnstillingene er utilgjengelige akkurat nå. Prøv igjen senere.")}
      </p>
    </form>
  );
}
