"use client";
import { useEffect, useState, type ChangeEvent, type DragEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_IMAGE_MIB } from "@/lib/image-upload-policy";

type Project = { id: string; name: string };
type Asset = { id: string; createdAt: string };

export function PrivateUpload({
  locale,
  enabled,
  onPreview,
}: {
  locale: Locale;
  enabled: boolean;
  onPreview: (url: string) => void;
}) {
  const en = locale === "en";
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [localUrl, setLocalUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetch("/api/projects")
      .then(async (response) => {
        if (!response.ok) throw Error();
        return response.json() as Promise<Project[]>;
      })
      .then((rows) => {
        if (active) {
          setProjects(rows);
          setProject(rows[0]?.id || "");
        }
      })
      .catch(() => {
        if (active)
          setStatus(
            en ? "Could not load projects." : "Kunne ikke laste prosjekter.",
          );
      });
    return () => {
      active = false;
    };
  }, [enabled, en]);
  useEffect(() => {
    if (!enabled || !project) return;
    let active = true;
    fetch(`/api/projects/${encodeURIComponent(project)}/assets`)
      .then(async (response) => {
        if (!response.ok) throw Error();
        return response.json() as Promise<Asset[]>;
      })
      .then((rows) => {
        if (active) setAssets(rows);
      })
      .catch(() => {
        if (active)
          setStatus(
            en
              ? "Could not load saved images."
              : "Kunne ikke laste lagrede bilder.",
          );
      });
    return () => {
      active = false;
    };
  }, [project, enabled, en]);
  useEffect(
    () => () => {
      if (localUrl) URL.revokeObjectURL(localUrl);
    },
    [localUrl],
  );
  function choose(next: File | undefined) {
    if (!next) return;
    if (
      !IMAGE_TYPES.some((type) => type === next.type) ||
      next.size < 1 ||
      next.size > MAX_IMAGE_BYTES
    ) {
      setStatus(
        en
          ? `Choose a JPEG, PNG or WebP image up to ${MAX_IMAGE_MIB} MiB.`
          : `Velg et JPEG-, PNG- eller WebP-bilde på opptil ${MAX_IMAGE_MIB} MiB.`,
      );
      return;
    }
    const url = URL.createObjectURL(next);
    setSelectedAsset("");
    setLocalUrl(url);
    onPreview(url);
    setFile(next);
    setStatus("");
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!busy) choose(event.dataTransfer.files[0]);
  }
  async function upload() {
    if (!file || !project || busy) return;
    setBusy(true);
    setStatus(en ? "Uploading…" : "Laster opp…");
    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(project)}/assets`,
        { method: "POST", headers: { "Content-Type": file.type }, body: file },
      );
      if (!response.ok) throw Error();
      const result = (await response.json()) as { assetId: string };
      setSelectedAsset(result.assetId);
      const list = await fetch(
        `/api/projects/${encodeURIComponent(project)}/assets`,
      );
      if (list.ok) setAssets((await list.json()) as Asset[]);
      onPreview(`/api/assets/${encodeURIComponent(result.assetId)}/download`);
      setFile(null);
      setLocalUrl("");
      setStatus(en ? "Saved privately." : "Lagret privat.");
    } catch {
      setStatus(
        en
          ? "Upload failed. Please try again."
          : "Opplastingen feilet. Prøv igjen.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (
      !selectedAsset ||
      busy ||
      !window.confirm(
        en ? "Delete this private image?" : "Slette dette private bildet?",
      )
    )
      return;
    setBusy(true);
    try {
      const response = await fetch(
        `/api/assets/${encodeURIComponent(selectedAsset)}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw Error();
      setAssets((items) => items.filter((item) => item.id !== selectedAsset));
      setSelectedAsset("");
      onPreview("");
      setStatus(en ? "Image deleted." : "Bildet er slettet.");
    } catch {
      setStatus(
        en
          ? "Deletion failed. Please try again."
          : "Slettingen feilet. Prøv igjen.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!enabled)
    return (
      <p className="small">
        {en
          ? "Private uploads are unavailable."
          : "Privat opplasting er ikke tilgjengelig."}
      </p>
    );
  return (
    <div
      className="upload-box"
      onDragOver={(event) => event.preventDefault()}
      onDrop={drop}
    >
      <h2>{en ? "Private image" : "Privat bilde"}</h2>
      <label>
        {en ? "Project" : "Prosjekt"}
        <select
          value={project}
          onChange={(event) => {
            setAssets([]);
            setProject(event.target.value);
            setSelectedAsset("");
            onPreview("");
          }}
          disabled={busy || !projects.length}
        >
          <option value="">
            {en ? "Choose a project" : "Velg et prosjekt"}
          </option>
          {projects.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {!projects.length && (
        <p className="small">
          {en
            ? "Create a project before uploading."
            : "Opprett et prosjekt før du laster opp."}{" "}
          <Link href="/app/projects">
            {en ? "Open projects" : "Åpne prosjekter"}
          </Link>
        </p>
      )}
      <label>
        {en ? "Choose or drop an image" : "Velg eller slipp et bilde"}
        <input
          type="file"
          accept={IMAGE_TYPES.join(",")}
          disabled={busy || !project}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            choose(event.target.files?.[0])
          }
        />
      </label>
      <p className="small">JPEG, PNG, WebP · {MAX_IMAGE_MIB} MiB</p>
      {file && <p className="small">{file.name}</p>}
      <button
        type="button"
        className="button"
        disabled={!file || !project || busy}
        onClick={upload}
      >
        {busy
          ? en
            ? "Uploading…"
            : "Laster opp…"
          : en
            ? "Upload image"
            : "Last opp bilde"}
      </button>
      {status && <p role="status">{status}</p>}
      {assets.length > 0 && (
        <label>
          {en ? "Saved images" : "Lagrede bilder"}
          <select
            value={selectedAsset}
            onChange={(event) => {
              if (event.target.value) {
                setSelectedAsset(event.target.value);
                onPreview(
                  `/api/assets/${encodeURIComponent(event.target.value)}/download`,
                );
                setFile(null);
                setLocalUrl("");
              }
            }}
          >
            <option value="">{en ? "Select an image" : "Velg et bilde"}</option>
            {assets.map((asset, index) => (
              <option key={asset.id} value={asset.id}>
                {en ? "Image" : "Bilde"} {index + 1} ·{" "}
                {new Date(asset.createdAt).toLocaleDateString(
                  en ? "en-GB" : "nb-NO",
                )}
              </option>
            ))}
          </select>
        </label>
      )}
      {selectedAsset && (
        <button
          type="button"
          className="button"
          disabled={busy}
          onClick={remove}
        >
          {en ? "Delete selected image" : "Slett valgt bilde"}
        </button>
      )}
    </div>
  );
}
