"use client";
import Image from "next/image";
import Link from "next/link";
import { tools } from "@vastunord/contracts/tools";
import { StudioChoices } from "./studio-choices";
import { PrivateUpload } from "./private-upload";
import { PrivateRenderGallery } from "./private-render-gallery";
import { useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";
import { studies, translated } from "@/lib/workspace-catalog";
import {
  renderGallery,
  subjects,
  fileExamples,
  type GalleryScene,
} from "@/lib/render-gallery";
import "./workspace.css";

const favoritesKey = "vn-gallery-favorites";
const validScenes = new Set(
  [...renderGallery, ...fileExamples].map((scene) => scene.id),
);
let fallbackFavorites = "[]";
let useMemoryFavorites = false;
const emptyFavorites = () => "[]";
function readFavorites() {
  if (useMemoryFavorites) return fallbackFavorites;
  try {
    return localStorage.getItem(favoritesKey) ?? "[]";
  } catch {
    return fallbackFavorites;
  }
}
function parseFavorites(raw: string): string[] {
  try {
    const values: unknown = JSON.parse(raw);
    return Array.isArray(values)
      ? values.filter(
          (id): id is string => typeof id === "string" && validScenes.has(id),
        )
      : [];
  } catch {
    return [];
  }
}
function followFavorites(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener("vn:favorites", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("vn:favorites", notify);
  };
}
function toggleFavorite(id: string) {
  const values = new Set(parseFavorites(readFavorites()));
  if (values.has(id)) values.delete(id);
  else values.add(id);
  fallbackFavorites = JSON.stringify([...values]);
  try {
    localStorage.setItem(favoritesKey, fallbackFavorites);
    useMemoryFavorites = false;
  } catch {
    useMemoryFavorites = true;
  }
  window.dispatchEvent(new Event("vn:favorites"));
}

export function StudyCards({
  locale,
  album = false,
  overview = false,
}: {
  locale: Locale;
  album?: boolean;
  overview?: boolean;
}) {
  const en = locale === "en";
  const cover = album ? "album" : overview ? "study" : "projects";
  return (
    <div className="vn-study-grid">
      {studies.map((study) => (
        <Link
          className="vn-study"
          href={
            album
              ? "/app/renders?album=" + study.id
              : "/app/studies/" + study.id
          }
          key={study.id}
        >
          <div className="vn-photo">
            <Image
              fill
              src={`/reference/editorial/${cover}-${study.id}.webp`}
              sizes="(max-width: 640px) 92vw, 32vw"
              alt=""
            />
          </div>
          <div className="vn-study-text">
            <p>
              {study.location} ·{" "}
              {album
                ? en
                  ? "Reference album"
                  : "Referansealbum"
                : en
                  ? "Example project"
                  : "Eksempelprosjekt"}
            </p>
            <h3>
              {translated(study.name, locale)} <span aria-hidden="true">↗</span>
            </h3>
            <small>
              {album
                ? renderGallery.filter((s) => s.study === study.id).length +
                  (en ? " images" : " bilder")
                : study.rooms + (en ? " rooms" : " rom")}
            </small>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Gallery({
  locale,
  initialAlbum,
  assets = false,
  privateFilesEnabled = false,
  publicCollection = false,
}: {
  locale: Locale;
  initialAlbum?: string;
  assets?: boolean;
  privateFilesEnabled?: boolean;
  publicCollection?: boolean;
}) {
  const en = locale === "en";
  const [privatePreview, setPrivatePreview] = useState("");
  const [query, setQuery] = useState("");
  const [album, setAlbum] = useState(initialAlbum || "");
  const [kind, setKind] = useState("all");
  const [subject, setSubject] = useState("");
  const favorites = parseFavorites(
    useSyncExternalStore(followFavorites, readFavorites, emptyFavorites),
  );
  const collection = assets && !publicCollection ? fileExamples : renderGallery;
  const [selected, setSelected] = useState<GalleryScene>(collection[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [toolId, setToolId] = useState(tools[0].id);
  const shown = collection.filter(
    (s) =>
      (!album || s.study === album) &&
      (!subject || s.style[1] === subject) &&
      (kind === "all" || (kind === "favorites" && favorites.includes(s.id))) &&
      [translated(s.title, locale), translated(s.style, locale)]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const filters = [
    ["all", en ? "All images" : "Alle bilder"],
    ["favorites", en ? "Favourites" : "Favoritter"],
    ...(!publicCollection ? [["videos", en ? "Films" : "Film"]] : []),
  ];
  return (
    <section className="vn-collection">
      <header className="vn-pagehead">
        {!publicCollection && (
          <p className="eyebrow">
            {en ? "Studio collection" : "Studiosamling"}
          </p>
        )}
        <h1>
          {publicCollection
            ? en
              ? "Gallery"
              : "Galleri"
            : assets
              ? en
                ? "Files and assets"
                : "Filer og ressurser"
              : en
                ? "Render gallery"
                : "Bildegalleri"}
        </h1>
        <p>
          {publicCollection
            ? en
              ? "Explore Vastu Nord’s architectural studies by subject. Open a photo to see its details or use it in Studio."
              : "Utforsk Vastu Nords arkitekturstudier etter tema. Åpne et bilde for å se detaljene eller bruke det i Studio."
            : assets
              ? en
                ? "Browse reference files for your Studio studies."
                : "Se referansefiler til studiene dine i Studio."
              : en
                ? "Open any of the 50 studies, then choose a workflow for its photo."
                : "Åpne en av de 50 bildestudiene og velg en arbeidsflyt for bildet."}
        </p>
      </header>
      {!publicCollection && assets && privateFilesEnabled && (
        <section className="vn-private-files">
          <PrivateUpload
            locale={locale}
            enabled
            onPreview={setPrivatePreview}
          />
          {privatePreview && (
            // Authenticated downloads and local object URLs must stay in this browser.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={privatePreview}
              alt={
                en
                  ? "Selected private project image"
                  : "Valgt privat prosjektbilde"
              }
            />
          )}
        </section>
      )}
      {!publicCollection && !assets && privateFilesEnabled && (
        <PrivateRenderGallery locale={locale} />
      )}
      {!publicCollection && !assets && (
        <h2 className="vn-section-heading">
          {en ? "Explore examples" : "Utforsk eksempler"}
        </h2>
      )}
      {!publicCollection && assets && (
        <h2 className="vn-section-heading">
          {en ? "Reference collection" : "Referansesamling"}
        </h2>
      )}
      <div className="vn-gallery-tools">
        <div className="vn-pills" role="group" aria-label={en ? "Show" : "Vis"}>
          {filters.map(([id, label]) => (
            <button
              key={id}
              aria-pressed={id === kind}
              onClick={() => setKind(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <StudioChoices
          label={publicCollection ? (en ? "Subject" : "Motiv") : "Album"}
          value={publicCollection ? subject : album}
          onChange={publicCollection ? setSubject : setAlbum}
          choices={
            publicCollection
              ? [
                  { value: "", label: en ? "All subjects" : "Alle motiv" },
                  ...Object.values(subjects).map((label) => ({
                    value: label[1],
                    label: translated(label, locale),
                  })),
                ]
              : [
                  { value: "", label: en ? "All albums" : "Alle album" },
                  ...studies.map((study) => ({
                    value: study.id,
                    label: translated(study.name, locale),
                  })),
                ]
          }
        />
        <label>
          <span className="sr-only">
            {en ? "Search images" : "Søk etter bilder"}
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={en ? "Search images…" : "Søk etter bilder …"}
          />
        </label>
      </div>
      {kind === "favorites" && (
        <p className="vn-muted">
          {en
            ? "Your favourites are saved on this device when browser storage is available."
            : "Favoritter lagres på denne enheten når nettleseren tillater lagring."}
        </p>
      )}
      {shown.length ? (
        <div className="vn-study-grid">
          {shown.map((scene) => {
            const title = translated(scene.title, locale);
            const liked = favorites.includes(scene.id);
            return (
              <article className="vn-study vn-tile" key={scene.image}>
                <button
                  className="vn-tile-open"
                  onClick={() => {
                    setSelected(scene);
                    dialog.current?.showModal();
                  }}
                >
                  <span className="vn-photo">
                    <Image
                      src={scene.thumbnail ?? scene.image}
                      unoptimized
                      fill
                      sizes="(max-width:640px) 92vw, 32vw"
                      alt=""
                    />
                  </span>
                  <span className="vn-study-text">
                    <small>{translated(scene.style, locale)}</small>
                    <strong>{title} <span aria-hidden="true">↗</span></strong>
                  </span>
                </button>
                <button
                  aria-pressed={liked}
                  className="vn-favourite"
                  aria-label={(en ? "Favourite " : "Favoritt ") + title}
                  onClick={() => toggleFavorite(scene.id)}
                >
                  <span aria-hidden="true">{liked ? "♥" : "♡"}</span>
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="vn-empty">
          <h2>
            {kind === "videos"
              ? en
                ? "No films in this collection"
                : "Ingen filmer i denne samlingen"
              : en
                ? "No matching images"
                : "Ingen bilder passer søket"}
          </h2>
          <button
            className="button"
            onClick={() => {
              setAlbum("");
              setSubject("");
              setKind("all");
              setQuery("");
            }}
          >
            {en ? "Show the collection" : "Vis samlingen"}
          </button>
        </div>
      )}
      {!publicCollection && (
        <div className="vn-related">
          <Link href="/app/albums">
            {en ? "Browse albums" : "Utforsk album"} <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/app/tools/room-reimagination">
            {en ? "Open Studio" : "Åpne Studio"} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
      <dialog
        className="vn-scene-dialog"
        ref={dialog}
        aria-labelledby="scene-title"
      >
        <div className="vn-section-title">
          <h2 id="scene-title">{translated(selected.title, locale)}</h2>
          <button
            onClick={() => dialog.current?.close()}
            aria-label={en ? "Close preview" : "Lukk forhåndsvisning"}
          >
            ×
          </button>
        </div>
        <div className="vn-dialog-photo">
          <Image
            fill
            src={selected.image}
            unoptimized
            sizes="(max-width: 800px) 92vw, 800px"
            alt={translated(selected.title, locale)}
          />
        </div>
        <div className="vn-related">
          <span>{translated(selected.style, locale)}</span>
          {!publicCollection && (
            <Link href={"/app/studies/" + selected.study}>
              {en ? "View example project" : "Åpne eksempelprosjekt"} <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
        <div className="vn-gallery-studio">
          <StudioChoices
            kind="tool"
            label={
              en ? "Workflow" : "Arbeidsflyt"
            }
            value={toolId}
            onChange={setToolId}
            choices={tools.map((tool) => ({
              value: tool.id,
              label: tool.name,
              image: `/media/tools/${tool.id}.webp`,
            }))}
          />
          <Link
            className="button"
            href={"/app/tools/" + toolId + "?sample=" + selected.id}
          >
            {en ? "Open Studio" : "Åpne Studio"} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </dialog>
    </section>
  );
}
