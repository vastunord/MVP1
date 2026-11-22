"use client";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";

export function PranaConsultation({
  locale,
  enabled,
}: {
  locale: Locale;
  enabled: boolean;
}) {
  const en = locale === "en";
  const id = useId();
  const pending = useRef<AbortController | null>(null);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  useEffect(() => () => pending.current?.abort(), []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current || !enabled || question.trim().length < 3) return;
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true);
    setError("");
    setAnswer("");
    try {
      const response = await fetch("/api/prana", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), language: locale }),
        signal: controller.signal,
      });
      if (response.status === 429) {
        setError(
          en
            ? "Today’s question limit has been reached. You can still explore Quick Tips."
            : "Dagens spørsmålsgrense er nådd. Du kan fortsatt utforske Quick Tips.",
        );
        return;
      }
      if (!response.ok) throw new Error("Unavailable");
      const data = await response.json();
      if (typeof data.answer !== "string" || !data.answer)
        throw new Error("Unavailable");
      setAnswer(data.answer);
    } catch {
      if (!controller.signal.aborted)
        setError(
          en
            ? "Prana couldn’t answer this time. Please try again later."
            : "Prana kunne ikke svare denne gangen. Prøv igjen senere.",
        );
    } finally {
      pending.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }
  return (
    <>
      <h2>{en ? "Ask Prana" : "Spør Prana"}</h2>
      <p>
        {en
          ? "Ask a question about interiors, homes or real estate."
          : "Still et spørsmål om interiør, bolig eller eiendom."}
      </p>
      {enabled ? (
        <form onSubmit={submit} className="prana-question">
          <label htmlFor={id}>{en ? "Your question" : "Ditt spørsmål"}</label>
          <textarea
            id={id}
            required
            minLength={3}
            maxLength={600}
            rows={3}
            aria-describedby={id + "-privacy"}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={
              en
                ? "How can I bring daylight into a narrow hall?"
                : "Hvordan kan jeg få mer dagslys inn i en smal gang?"
            }
          />
          <small id={id + "-privacy"}>
            {en
              ? "Your question goes to OpenAI. Leave out addresses and personal details."
              : "Spørsmålet sendes til OpenAI. Utelat adresser og personopplysninger."}
          </small>
          <button
            className="prana-action"
            type="submit"
            disabled={busy || question.trim().length < 3}
          >
            {busy
              ? en
                ? "Thinking…"
                : "Tenker …"
              : en
                ? "Ask Prana"
                : "Spør Prana"}
          </button>
          <div aria-live="polite">
            {answer && <p className="prana-answer">{answer}</p>}
            {error && <p>{error}</p>}
          </div>
        </form>
      ) : (
        <p>
          {en
            ? "Live answers are currently unavailable. Quick Tips is open below."
            : "Direktesvar er ikke tilgjengelige nå. Du finner Quick Tips nedenfor."}
        </p>
      )}
    </>
  );
}
