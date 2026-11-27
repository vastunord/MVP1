"use client";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

export function StudioPrompt({
  value,
  change,
  locale,
  enabled,
  label,
  help,
}: {
  value: string;
  change: (v: string) => void;
  locale: Locale;
  enabled: boolean;
  label: string;
  help: string;
}) {
  const en = locale === "en";
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [proposal, setProposal] = useState("");
  const [previous, setPrevious] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function improve() {
    if (!enabled || busy || controller.current || !value.trim()) return;
    const request = new AbortController();
    controller.current = request;
    setBusy(true);
    setMessage("");
    setProposal("");
    try {
      const response = await fetch("/api/studio/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: value.trim(), language: locale }),
        signal: request.signal,
      });
      if (request.signal.aborted) return;
      if (response.status === 422) {
        const result = await response.json();
        if (request.signal.aborted) return;
        setMessage(
          typeof result.answer === "string"
            ? result.answer
            : en
              ? "Describe a design change."
              : "Beskriv en designendring.",
        );
        return;
      }
      if (!response.ok) throw Error();
      const result = await response.json();
      if (request.signal.aborted) return;
      if (
        typeof result.answer !== "string" ||
        !result.answer.trim() ||
        result.answer.length > 4000
      )
        throw Error();
      setProposal(result.answer.trim());
    } catch {
      if (!request.signal.aborted)
        setMessage(
          en
            ? "Prompt improvement is unavailable. Your text is saved in the editor."
            : "Tekstforbedring er utilgjengelig. Teksten din ligger fortsatt i feltet.",
        );
    } finally {
      if (!request.signal.aborted) {
        controller.current = null;
        setBusy(false);
      }
    }
  }
  return (
    <div className="studio-prompt">
      <label className="studio-kicker" htmlFor="prompt">
        {label}
      </label>
      <p className="inspector-help">{help}</p>
      <textarea
        id="prompt"
        maxLength={4000}
        value={value}
        rows={3}
        onChange={(e) => {
          controller.current?.abort();
          controller.current = null;
          setBusy(false);
          setProposal("");
          setMessage("");
          change(e.target.value);
        }}
      />
      <div className="prompt-tools">
        <button
          type="button"
          disabled={!enabled || !value.trim() || busy}
          onClick={improve}
        >
          {busy
            ? en
              ? "Improving…"
              : "Forbedrer …"
            : en
              ? "Improve with Prana"
              : "Forbedre med Prana"}
        </button>
        <small>{value.length} / 4000</small>
      </div>
      {proposal && (
        <div className="prompt-proposal" role="status">
          <p>{proposal}</p>
          <button
            type="button"
            onClick={() => {
              change(proposal);
              setPrevious(value);
              setProposal("");
            }}
          >
            {en ? "Use suggestion" : "Bruk forslaget"}
          </button>
          <button type="button" onClick={() => setProposal("")}>
            {en ? "Keep my text" : "Behold min tekst"}
          </button>
        </div>
      )}
      {previous !== null && <button type="button" onClick={() => { change(previous); setPrevious(null); }}>{en ? "Undo suggestion" : "Angre forslag"}</button>}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
