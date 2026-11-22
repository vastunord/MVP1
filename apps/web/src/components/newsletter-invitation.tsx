"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { publicHref, type Locale } from "@/lib/i18n";

export function NewsletterInvitation({
  locale,
  available,
  dismiss,
}: {
  locale: Locale;
  available: boolean;
  dismiss: () => void;
}) {
  const en = locale === "en";
  const [status, setStatus] = useState<
    "idle" | "sending" | "received" | "limited" | "unavailable" | "error"
  >("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!available || status === "sending") return;
    const form = new FormData(event.currentTarget);
    if (form.get("permission") !== "yes") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          consent: true,
          locale,
        }),
      });
      if (
        response.status === 202 &&
        (await response.json()).status === "check-email"
      ) {
        setStatus("received");
      } else if (response.status === 429) {
        setStatus("limited");
      } else if (response.status === 503) {
        setStatus("unavailable");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "received")
    return (
      <div className="vn-visitor-content">
        <p role="status">
          {en
            ? "If this address is eligible, you’ll receive a confirmation email. Open the link to subscribe."
            : "Hvis adressen kan registreres, får du en e-post. Åpne lenken for å bekrefte påmeldingen."}
        </p>
        <button type="button" className="vn-panel-action" onClick={dismiss}>
          {en ? "Close" : "Lukk"}
        </button>
      </div>
    );
  const disabled = !available || status === "unavailable";
  return (
    <form className="vn-visitor-content vn-newsletter-form" onSubmit={submit}>
      <p>
        {en
          ? "Get room ideas, renovation advice and selected design studies from Vastu Nord in your inbox."
          : "Få romidéer, oppussingsråd og utvalgte designstudier fra Vastu Nord på e-post."}
      </p>
      <div className="vn-newsletter-fields">
        <label htmlFor="vn-news-email">
          {en ? "Email address" : "E-postadresse"}
        </label>
        <input
          id="vn-news-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          disabled={disabled || status === "sending"}
        />
        <label className="vn-checkbox-row">
          <input
            type="checkbox"
            name="permission"
            value="yes"
            required
            disabled={disabled || status === "sending"}
          />
          <span>
            {en
              ? "I agree to receive Vastu Nord’s newsletter by email."
              : "Jeg samtykker til å motta nyhetsbrev fra Vastu Nord på e-post."}
          </span>
        </label>
      </div>
      <p className="vn-fine-print">
        {en
          ? "Unsubscribe using the link in each email."
          : "Du kan melde deg av via lenken i hver e-post."}{" "}
        <Link href={publicHref("/privacy", locale)} onClick={dismiss}>
          {en ? "Privacy policy" : "Personvern"}
        </Link>
      </p>
      {!available && (
        <p className="vn-service-note" role="status">
          {en
            ? "Email sign-up is currently unavailable. Your address is not collected here."
            : "Påmelding er foreløpig stengt. E-postadressen din blir ikke samlet inn her."}
        </p>
      )}
      {available && status === "unavailable" && (
        <p className="vn-service-note" role="alert">
          {en
            ? "The newsletter service could not complete your request. Please try again later."
            : "Nyhetsbrevtjenesten kunne ikke fullføre forespørselen. Prøv igjen senere."}
        </p>
      )}
      {status === "limited" && (
        <p role="alert">
          {en
            ? "Please wait before trying again."
            : "Vent litt før du prøver igjen."}
        </p>
      )}
      {status === "error" && (
        <p role="alert">
          {en
            ? "We couldn’t confirm your request. Check the address and try again."
            : "Vi kunne ikke bekrefte forespørselen. Kontroller adressen og prøv igjen."}
        </p>
      )}
      <div className="vn-panel-actions">
        <button
          type="submit"
          className="vn-panel-action"
          disabled={disabled || status === "sending"}
        >
          {status === "sending"
            ? en
              ? "Sending…"
              : "Sender…"
            : en
              ? "Request confirmation"
              : "Be om bekreftelse"}
        </button>
        <button type="button" className="vn-panel-secondary" onClick={dismiss}>
          {en ? "Not now" : "Ikke nå"}
        </button>
      </div>
    </form>
  );
}
