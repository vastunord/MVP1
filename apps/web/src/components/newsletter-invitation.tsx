"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { publicHref, type Locale } from "@/lib/i18n";
import "./newsletter-ticket.css";

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

  const disabled = !available || status === "unavailable";
  return (
    <div className="vn-cinema-ticket">
      <div className="vn-ticket-body">
        <Image
          className="vn-ticket-wordmark"
          src="/brand/vastunord-primary-ivory.svg"
          alt="Vastu Nord"
          width={146}
          height={14}
        />
        <h3>{en ? "Room for new ideas." : "Rom for nye ideer."}</h3>
        {status === "received" ? (
          <>
            <p role="status">
              {en
                ? "If this address is eligible, you’ll receive a confirmation email. Open the link to subscribe."
                : "Hvis adressen kan registreres, får du en e-post. Åpne lenken for å bekrefte påmeldingen."}
            </p>
            <button
              type="button"
              className="vn-ticket-action"
              onClick={dismiss}
            >
              {en ? "Close" : "Lukk"}
            </button>
          </>
        ) : (
          <form className="vn-newsletter-form" onSubmit={submit}>
            <p className="vn-ticket-intro">
              {en
                ? "Get room ideas, renovation advice and selected design studies from Vastu Nord in your inbox."
                : "Få romidéer, oppussingsråd og utvalgte designstudier fra Vastu Nord på e-post."}
            </p>
            <div className="vn-ticket-email-row">
              <label className="vn-visually-hidden" htmlFor="vn-news-email">
                {en ? "Email address" : "E-postadresse"}
              </label>
              <svg
                aria-hidden="true"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <input
                id="vn-news-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={en ? "Email address" : "E-post"}
                required
                maxLength={254}
                disabled={disabled || status === "sending"}
              />
              <button
                type="submit"
                className="vn-ticket-action"
                disabled={disabled || status === "sending"}
              >
                {status === "sending"
                  ? en
                    ? "Sending…"
                    : "Sender…"
                  : en
                    ? "Sign up"
                    : "Meld meg på"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </div>
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
                  ? "I agree to receive Vastu Nord’s newsletter by email. I can unsubscribe at any time."
                  : "Jeg samtykker til å motta nyhetsbrev fra Vastu Nord på e-post. Jeg kan melde meg av når som helst."}
              </span>
            </label>
            <div className="vn-ticket-links">
              <Link href={publicHref("/privacy", locale)} onClick={dismiss}>
                {en ? "Privacy policy" : "Personvern"}
              </Link>
              <button type="button" onClick={dismiss}>
                {en ? "Not now" : "Ikke nå"}
              </button>
            </div>
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
          </form>
        )}
      </div>
      <div className="vn-ticket-stub" aria-hidden="true">
        <svg
          width="38"
          height="38"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        >
          <path d="M3 8h26v5a3 3 0 0 0 0 6v5H3v-5a3 3 0 0 0 0-6z" />
          <path d="M21 9v3m0 2.5v3m0 2.5v3" />
        </svg>
        <span>{en ? "Design newsletter" : "Designbrev"}</span>
        <i className="vn-ticket-bars" />
      </div>
    </div>
  );
}
