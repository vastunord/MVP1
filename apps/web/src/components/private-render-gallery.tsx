"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { RenderStatus } from "@/lib/studio-render";

type Project = { id: string; name: string };

export function PrivateRenderGallery({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState("");
  const [renders, setRenders] = useState<RenderStatus[]>([]);
  const [selected, setSelected] = useState<RenderStatus | null>(null);
  const [divider, setDivider] = useState(50);
  const [sourceError, setSourceError] = useState(false);
  const [outputError, setOutputError] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "ready" | "signin" | "error"
  >("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/projects", { signal: abort.signal, cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          setProjects([]);
          setProject("");
          setRenders([]);
          setSelected(null);
          setStatus("signin");
          return;
        }
        // A verified first-time user has no personal workspace yet; the
        // projects API reports that case as 403. Offer the empty state.
        if (response.status === 403) {
          setProjects([]);
          setProject("");
          setRenders([]);
          setSelected(null);
          setStatus("ready");
          return;
        }
        if (!response.ok) throw new Error("Projects unavailable");
        const rows = (await response.json()) as Project[];
        setProjects(rows);
        setProject((current) =>
          rows.some((item) => item.id === current)
            ? current
            : rows[0]?.id || "",
        );
        if (!rows.length) setStatus("ready");
      })
      .catch(() => {
        if (!abort.signal.aborted) {
          setRenders([]);
          setSelected(null);
          setStatus("error");
        }
      });
    return () => abort.abort();
  }, [attempt]);

  useEffect(() => {
    if (!project) return;
    const abort = new AbortController();
    fetch(
      `/api/studio/renders?${new URLSearchParams({ projectId: project })}`,
      { signal: abort.signal, cache: "no-store" },
    )
      .then(async (response) => {
        if (response.status === 401) {
          setProjects([]);
          setProject("");
          setRenders([]);
          setSelected(null);
          setStatus("signin");
          return;
        }
        if (!response.ok) throw new Error("Renders unavailable");
        const rows = (await response.json()) as RenderStatus[];
        setRenders(
          rows.filter((row) => row.state === "SUCCEEDED" && row.outputAssetId),
        );
        setStatus("ready");
      })
      .catch(() => {
        if (!abort.signal.aborted) {
          setRenders([]);
          setSelected(null);
          setStatus("error");
        }
      });
    return () => abort.abort();
  }, [project, attempt]);

  const url = (id: string) => `/api/assets/${encodeURIComponent(id)}/download`;
  return (
    <section
      className="vn-private-renders"
      aria-labelledby="private-renders-title"
    >
      <h2 id="private-renders-title">
        {en ? "Your private renders" : "Dine private bilder"}
      </h2>
      <p>
        {en
          ? "Saved results are visible only to you."
          : "Lagrede resultater er bare synlige for deg."}
      </p>
      {status === "loading" && (
        <p role="status">{en ? "Loading projects…" : "Laster prosjekter…"}</p>
      )}
      {status === "signin" && (
        <p>
          <Link href="/login">
            {en
              ? "Sign in to see your renders"
              : "Logg inn for å se bildene dine"}
          </Link>
        </p>
      )}
      {status === "error" && (
        <p role="alert">
          {en
            ? "Could not load saved renders."
            : "Kunne ikke laste lagrede bilder."}{" "}
          <button
            onClick={() => {
              setStatus("loading");
              setAttempt((n) => n + 1);
            }}
          >
            {en ? "Try again" : "Prøv igjen"}
          </button>
        </p>
      )}
      {status === "ready" && !projects.length && (
        <p>
          {en
            ? "Create a project to save renders."
            : "Opprett et prosjekt for å lagre bilder."}
        </p>
      )}
      {projects.length > 0 && (
        <div role="group" aria-label={en ? "Project" : "Prosjekt"}>
          {projects.map((item) => (
            <button
              key={item.id}
              aria-pressed={project === item.id}
              onClick={() => {
                if (item.id === project) return;
                setProject(item.id);
                setRenders([]);
                setSelected(null);
                setStatus("loading");
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
      {status === "ready" && project && !renders.length && (
        <p>
          {en
            ? "No saved renders in this project yet."
            : "Ingen lagrede bilder i dette prosjektet ennå."}
        </p>
      )}
      <div className="vn-private-render-grid">
        {renders.map((row) => (
          <button
            key={row.id}
            onClick={() => {
              setSelected(row);
              setDivider(50);
              setSourceError(false);
              setOutputError(false);
            }}
          >
            {row.media === "image" && row.outputAssetId ? (
              <Image
                unoptimized
                width={768}
                height={512}
                src={url(row.outputAssetId)}
                alt={en ? "Saved private render" : "Lagret privat bilde"}
              />
            ) : (
              <span>{en ? "Saved video" : "Lagret video"}</span>
            )}
            <span>{en ? "View result" : "Se resultat"}</span>
          </button>
        ))}
      </div>
      {selected?.outputAssetId && (
        <div className="vn-private-result">
          <h3>{en ? "Saved result" : "Lagret resultat"}</h3>
          {outputError && (
            <p role="alert">
              {en
                ? "The saved result could not be loaded. Try opening it again."
                : "Det lagrede resultatet kunne ikke lastes. Prøv å åpne det igjen."}
            </p>
          )}
          {sourceError && (
            <p role="alert">
              {en
                ? "The original image is unavailable, so comparison is temporarily unavailable. You can still view the saved result."
                : "Originalbildet er ikke tilgjengelig, så sammenligning er midlertidig utilgjengelig. Du kan fortsatt se det lagrede resultatet."}
            </p>
          )}
          {selected.media === "image" && !selected.sourceAssetId && (
            <p role="status">
              {en
                ? "No original image is recorded for this result, so comparison is unavailable."
                : "Det finnes ikke noe registrert originalbilde for dette resultatet, så sammenligning er utilgjengelig."}
            </p>
          )}
          {selected.media === "image" ? (
            <div className="vn-private-comparison">
              <Image
                unoptimized
                width={768}
                height={512}
                src={url(selected.outputAssetId)}
                alt={en ? "Generated image" : "Generert bilde"}
                onError={() => setOutputError(true)}
              />
              {selected.sourceAssetId && !sourceError && !outputError && (
                <div
                  className="vn-private-comparison-before"
                  style={{ clipPath: `inset(0 ${100 - divider}% 0 0)` }}
                >
                  <Image
                    unoptimized
                    width={768}
                    height={512}
                    src={url(selected.sourceAssetId)}
                    alt={en ? "Original image" : "Originalbilde"}
                    onError={() => setSourceError(true)}
                  />
                </div>
              )}
            </div>
          ) : (
            <video controls src={url(selected.outputAssetId)} />
          )}
          {selected.media === "image" && selected.sourceAssetId && !sourceError && !outputError && (
            <label>
              {en
                ? "Compare original and result"
                : "Sammenlign original og resultat"}
              <input
                type="range"
                min="0"
                max="100"
                value={divider}
                onChange={(event) => setDivider(Number(event.target.value))}
              />
            </label>
          )}
          <p>
            {!outputError && <><a href={url(selected.outputAssetId)} download>
              {en ? "Download result" : "Last ned resultat"}
            </a>{" "}·{" "}</>}
            <Link href={`/app/tools/${encodeURIComponent(selected.toolId)}`}>
              {en ? "Open Studio" : "Åpne Studio"}
            </Link>
          </p>
        </div>
      )}
    </section>
  );
}
