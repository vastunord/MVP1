"use client";
import { StudioChoices } from "./studio-choices";
import { AssetSharingConsent } from "./asset-sharing-consent";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { Locale } from "@/lib/i18n";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_MIB,
} from "@/lib/image-upload-policy";
import type { RenderSelection } from "@/lib/studio-render";

type Project = { id: string; name: string };
type Asset = { id: string; createdAt: string; mimeType: string };
const isPhoto = (asset: Asset) =>
  ["image/jpeg", "image/png", "image/webp"].includes(asset.mimeType);

export function RoomReferences({
  assets,
  locale,
  enabled,
  onChange,
}: {
  assets: Asset[];
  locale: Locale;
  enabled: boolean;
  onChange?: (ids: string[]) => void;
}) {
  const en = locale === "en";
  const [references, setReferences] = useState(["", ""]);
  return (
    <details className="room-drawer room-reference">
      <summary>{en ? "Reference images" : "Referansebilder"}</summary>
      <div>
        <div className="room-reference-pair">
          {(en
            ? ["First reference", "Second reference"]
            : ["Første referanse", "Andre referanse"]
          ).map((label, index) => {
            const id = assets.some((asset) => asset.id === references[index])
              ? references[index]
              : "";
            return (
              <StudioChoices
                key={label}
                label={label}
                kind="reference"
                value={id}
                disabled={!enabled || !assets.length}
                choices={[
                  { value: "", label: en ? "None" : "Ingen" },
                  ...assets.map((asset, n) => ({
                    value: asset.id,
                    label: (en ? "Image " : "Bilde ") + (n + 1),
                    image:
                      "/api/assets/" +
                      encodeURIComponent(asset.id) +
                      "/download",
                    disabled: asset.id === references[1 - index],
                  })),
                ]}
                onChange={(v) => {
                  const next = references.map((item, slot) =>
                    slot === index ? v : item,
                  );
                  setReferences(next);
                  onChange?.(next);
                }}
              />
            );
          })}
        </div>
        {(!enabled || assets.length === 0) && (
          <p className="inspector-help">
            {enabled
              ? en
                ? "Save a project image to use it as a reference."
                : "Lagre et prosjektbilde for å bruke det som referanse."
              : en
                ? "Private project references are unavailable in this demo."
                : "Private prosjektreferanser er utilgjengelige i denne demoen."}
          </p>
        )}
      </div>
    </details>
  );
}

export function PrivateUpload({
  locale,
  enabled,
  onPreview,
  withRoomReferences = false,
  onSelection,
}: {
  locale: Locale;
  enabled: boolean;
  onPreview: (url: string) => void;
  withRoomReferences?: boolean;
  onSelection?: (selection: RenderSelection) => void;
}) {
  const en = locale === "en";
  const [projects, setProjects] = useState<Project[]>([]);
  const [project, setProject] = useState("");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [referenceIds, setReferenceIds] = useState<string[]>([]);
  useEffect(() => {
    onSelection?.({
      projectId: project,
      sourceAssetId: selectedAsset,
      referenceIds: referenceIds.filter(
        (id) =>
          id && id !== selectedAsset && assets.some((asset) => asset.id === id),
      ),
    });
  }, [project, selectedAsset, referenceIds, assets, onSelection]);
  const [file, setFile] = useState<File | null>(null);
  const [localUrl, setLocalUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [projectName, setProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const createKey = useRef("");
  const createInFlight = useRef(false);
  const uploadInput = useRef<HTMLInputElement>(null);
  const focusUploadAfterCreate = useRef(false);
  const checkedReloadHint = useRef(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active || checkedReloadHint.current) return;
      checkedReloadHint.current = true;
      try {
        if (sessionStorage.getItem("vn-unsaved-studio-image") === "yes") {
          sessionStorage.removeItem("vn-unsaved-studio-image");
          setStatus(en ? "Your unsaved image was not retained. Choose it again." : "Det ulagrede bildet ble ikke beholdt. Velg det på nytt.");
        }
      } catch { /* Storage may be unavailable in private browsing. */ }
    });
    return () => { active = false; };
  }, [en]);
  useEffect(() => {
    if (focusUploadAfterCreate.current && project && !creating) {
      focusUploadAfterCreate.current = false;
      uploadInput.current?.focus();
    }
  }, [project, creating]);
  async function createProject() {
    const name = projectName.trim();
    if (name.length < 2 || createInFlight.current || busy) return;
    createInFlight.current = true;
    setCreating(true);
    createKey.current ||= crypto.randomUUID();
    try {
      // A first-time user may not have a personal workspace yet. Create it
      // only after their explicit project action, using the idempotent API.
      const workspace = await fetch("/api/workspaces/personal", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: en ? "My workspace" : "Mitt arbeidsområde" }),
      });
      if (!workspace.ok) throw new Error("Workspace unavailable");
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "idempotency-key": createKey.current },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) throw new Error("Project creation failed");
      const created = await response.json() as Project;
      setProjects((items) => items.some((item) => item.id === created.id) ? items : [...items, created]);
      setAssets([]);
      setSelectedAsset("");
      setReferenceIds([]);
      if (!file) onPreview("");
      focusUploadAfterCreate.current = true;
      setProject(created.id);
      setProjectName("");
      createKey.current = "";
      setStatus(en ? "Project created. Choose an image." : "Prosjektet er opprettet. Velg et bilde.");
    } catch {
      setStatus(en ? "Could not create the project. Try again." : "Kunne ikke opprette prosjektet. Prøv igjen.");
    } finally { createInFlight.current = false; setCreating(false); }
  }
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetch("/api/projects")
      .then(async (response) => {
        if (response.status === 403) return [] as Project[];
        if (!response.ok) throw Error();
        return response.json() as Promise<Project[]>;
      })
      .then((rows) => {
        if (active) {
          setProjects((current) => [...rows, ...current.filter((item) => !rows.some((row) => row.id === item.id))]);
          setProject((current) => current || rows[0]?.id || "");
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
        if (active) setAssets(rows.filter(isPhoto));
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
    try { sessionStorage.setItem("vn-unsaved-studio-image", "yes"); } catch { /* Optional reload hint only. */ }
    setSelectedAsset("");
    setLocalUrl(url);
    onPreview(url);
    setFile(next);
    setStatus("");
  }
  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!busy && !creating) choose(event.dataTransfer.files[0]);
  }
  async function upload() {
    if (!file || !project || busy || creating) return;
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
      if (list.ok) setAssets(((await list.json()) as Asset[]).filter(isPhoto));
      onPreview(`/api/assets/${encodeURIComponent(result.assetId)}/download`);
      try { sessionStorage.removeItem("vn-unsaved-studio-image"); } catch { /* Optional reload hint only. */ }
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
      busy || creating ||
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
      <StudioChoices
        label={en ? "Project" : "Prosjekt"}
        value={project}
        disabled={busy || creating || !projects.length}
        choices={projects.map((item) => ({ value: item.id, label: item.name }))}
        onChange={(id) => {
          setAssets([]);
          setProject(id);
          setSelectedAsset("");
          setReferenceIds([]);
          // An unsaved local image belongs to the draft, not the old project.
          // Saved assets, however, must be selected again in their own project.
          if (!file) onPreview("");
        }}
      />
      <details>
        <summary>{en ? "Create project" : "Opprett prosjekt"}</summary>
        <label>{en ? "Project name" : "Prosjektnavn"}
          <input disabled={creating} value={projectName} maxLength={100} onChange={(event) => { setProjectName(event.target.value); createKey.current = ""; }} />
        </label>
        <p className="small">{en ? "Use at least two characters." : "Bruk minst to tegn."}</p>
        <button type="button" disabled={projectName.trim().length < 2 || creating || busy} onClick={createProject}>
          {creating ? (en ? "Creating…" : "Oppretter…") : (en ? "Create project and continue" : "Opprett prosjekt og fortsett")}
        </button>
      </details>
      <label>
        {en ? "Choose or drop an image" : "Velg eller slipp et bilde"}
        <input
          ref={uploadInput}
          type="file"
          accept={IMAGE_TYPES.join(",")}
          disabled={busy || creating || !project}
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
        disabled={!file || !project || busy || creating}
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
        <StudioChoices
          label={en ? "Saved images" : "Lagrede bilder"}
          disabled={busy || creating}
          kind="reference"
          value={selectedAsset}
          choices={assets.map((asset, n) => ({
            value: asset.id,
            label: (en ? "Image " : "Bilde ") + (n + 1),
            image: "/api/assets/" + encodeURIComponent(asset.id) + "/download",
          }))}
          onChange={(id) => {
            setSelectedAsset(id);
            onPreview("/api/assets/" + encodeURIComponent(id) + "/download");
            try { sessionStorage.removeItem("vn-unsaved-studio-image"); } catch { /* Optional reload hint only. */ }
            setFile(null);
            setLocalUrl("");
          }}
        />
      )}
      {selectedAsset && (
        <button
          type="button"
          className="button"
          disabled={busy || creating}
          onClick={remove}
        >
          {en ? "Delete selected image" : "Slett valgt bilde"}
        </button>
      )}
      {selectedAsset && (
        <AssetSharingConsent
          key={selectedAsset}
          assetId={selectedAsset}
          locale={locale}
        />
      )}
      {withRoomReferences && (
        <RoomReferences
          key={project}
          assets={assets.filter((asset) => asset.id !== selectedAsset)}
          locale={locale}
          enabled={!busy && !creating}
          onChange={setReferenceIds}
        />
      )}
    </div>
  );
}
