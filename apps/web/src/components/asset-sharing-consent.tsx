"use client";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  permittedChannels,
  sharingPolicy,
  type PublicationChannel,
  type SharingVersion,
} from "@/lib/publication-consent";

export function AssetSharingConsent({
  assetId,
  locale,
}: {
  assetId: string;
  locale: Locale;
}) {
  const en = locale === "en";
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<SharingVersion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saved, setSaved] = useState(false);
  const url = `/api/assets/${encodeURIComponent(assetId)}/consent`;
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    fetch(url, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw Error();
        const rows = (await response.json()) as SharingVersion[];
        if (!controller.signal.aborted) {
          setVersions(rows);
          setLoaded(true);
          setError(false);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [url, open, attempt]);
  async function choose(
    versionId: string,
    channel: PublicationChannel,
    grant: boolean,
  ) {
    if (busy) return;
    setBusy(true);
    setSaved(false);
    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          versionId,
          channel,
          grant,
          policy: sharingPolicy,
        }),
      });
      if (!response.ok) throw Error();
      setVersions(await response.json());
      setSaved(true);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  const names = {
    GALLERY: en
      ? "Vastu Nord public gallery"
      : "Vastu Nords offentlige galleri",
    PINTEREST: "Pinterest",
    YOUTUBE: "YouTube",
  };
  return (
    <details
      className="room-drawer"
      onToggle={(event) => {
        setOpen(event.currentTarget.open);
        if (event.currentTarget.open) {
          setLoaded(false);
          setSaved(false);
        }
      }}
    >
      <summary>{en ? "Sharing permissions" : "Samtykke til deling"}</summary>
      {open && (
        <div>
          <p>
            {en
              ? "Choose where Vastu Nord may feature this exact version. Each choice is optional and needs editorial review before publication. You can withdraw it here."
              : "Velg hvor Vastu Nord kan vise akkurat denne versjonen. Hvert valg er frivillig og krever redaksjonell vurdering før publisering. Du kan trekke samtykket her."}
          </p>
          {!error && (!loaded || !versions.length) && (
            <p>
              {loaded
                ? en
                  ? "There are no versions available for sharing."
                  : "Ingen versjoner er tilgjengelige for deling."
                : en
                  ? "Loading permissions�"
                  : "Laster samtykker�"}
            </p>
          )}
          {versions.map((version) => (
            <fieldset key={version.id} disabled={busy || error || !loaded}>
              <legend>
                {en ? "Version" : "Versjon"} {version.version} ·{" "}
                {new Date(version.createdAt).toLocaleDateString(
                  en ? "en-GB" : "nb-NO",
                )}
              </legend>
              {version.current &&
                (version.mimeType === "video/mp4" ? (
                  <video
                    src={`/api/assets/${encodeURIComponent(assetId)}/download`}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={en ? "Selected video" : "Valgt video"}
                    style={{ maxWidth: "100%", maxHeight: 150 }}
                  />
                ) : (
                  // The authenticated download endpoint serves this private preview.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/assets/${encodeURIComponent(assetId)}/download`}
                    alt={
                      en
                        ? "Selected image for publication permission"
                        : "Valgt bilde for delingssamtykke"
                    }
                    style={{ maxWidth: "100%", maxHeight: 150 }}
                  />
                ))}
              {!version.current && (
                <p>
                  {en
                    ? "Earlier version. Existing permissions can be withdrawn here."
                    : "Tidligere versjon. Eksisterende samtykker kan trekkes tilbake her."}
                </p>
              )}
              {(version.current
                ? permittedChannels(version.mimeType)
                : version.grants
              ).map((channel) => (
                <label className="render-consent" key={channel}>
                  <input
                    type="checkbox"
                    checked={version.grants.includes(channel)}
                    onChange={(e) =>
                      void choose(version.id, channel, e.target.checked)
                    }
                  />
                  {names[channel]}
                </label>
              ))}
            </fieldset>
          ))}
          {error && (
            <p role="alert">
              {en
                ? "Could not confirm the saved permissions."
                : "Kunne ikke bekrefte lagrede samtykker."}{" "}
              <button
                type="button"
                disabled={busy}
                onClick={() => setAttempt((value) => value + 1)}
              >
                {en ? "Reload" : "Last på nytt"}
              </button>
            </p>
          )}
          {saved && !error && (
            <p role="status">
              {en ? "Permission saved." : "Samtykkevalget er lagret."}
            </p>
          )}
        </div>
      )}
    </details>
  );
}
