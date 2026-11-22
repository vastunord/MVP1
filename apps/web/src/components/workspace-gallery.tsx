"use client";
import Image from "next/image";
import Link from "next/link";
import { PrivateUpload } from "./private-upload";
import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { studies, translated } from "@/lib/workspace-catalog";
import { renderGallery, fileExamples, type GalleryScene } from "@/lib/render-gallery";

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
}: {
  locale: Locale;
  initialAlbum?: string;
  assets?: boolean;
  privateFilesEnabled?: boolean;
}) {
  const en = locale === "en";
  const [privatePreview, setPrivatePreview] = useState("");
  const [query, setQuery] = useState("");
  const [album, setAlbum] = useState(initialAlbum || "");
  const [kind, setKind] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const collection = assets ? fileExamples : renderGallery;
  const [selected, setSelected] = useState<GalleryScene>(collection[0]);
  const dialog = useRef<HTMLDialogElement>(null);
  const shown = collection.filter(
    (s) =>
      (!album || s.study === album) &&
      (kind === "all" ||
        (kind === "favorites" && favorites.includes(s.image))) &&
      [translated(s.title, locale), translated(s.style, locale)]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const filters = [
    ["all", en ? "All images" : "Alle bilder"],
    ["favorites", en ? "Favourites" : "Favoritter"],
    ["videos", en ? "Films" : "Film"],
  ];
  return (
    <section className="vn-collection">
      <header className="vn-pagehead">
        <p className="eyebrow">{en ? "Studio collection" : "Studiosamling"}</p>
        <h1>
          {assets
            ? en
              ? "Files and assets"
              : "Filer og ressurser"
            : en
              ? "Render gallery"
              : "Bildegalleri"}
        </h1>
        <p>
          {assets
            ? en ? "Browse reference files for your Studio studies." : "Se referansefiler til studiene dine i Studio."
            : en ? "Explore 50 architectural and interior studies from the Vastu Nord collection." : "Utforsk 50 arkitektur- og interiørstudier fra Vastu Nords samling."}
        </p>
      </header>
      {assets && privateFilesEnabled && (
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
      {assets && (
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
        <label>
          <span className="sr-only">{en ? "Album" : "Album"}</span>
          <select value={album} onChange={(e) => setAlbum(e.target.value)}>
            <option value="">{en ? "All albums" : "Alle album"}</option>
            {studies.map((s) => (
              <option key={s.id} value={s.id}>
                {translated(s.name, locale)}
              </option>
            ))}
          </select>
        </label>
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
            ? "Selections last while this gallery is open."
            : "Valgene beholdes mens galleriet er åpent."}
        </p>
      )}
      {shown.length ? (
        <div className="vn-study-grid">
          {shown.map((scene) => {
            const title = translated(scene.title, locale);
            const liked = favorites.includes(scene.image);
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
                    <strong>{title} ↗</strong>
                  </span>
                </button>
                <button
                  aria-pressed={liked}
                  className="vn-favourite"
                  aria-label={(en ? "Favourite " : "Favoritt ") + title}
                  onClick={() =>
                    setFavorites((list) =>
                      list.includes(scene.image)
                        ? list.filter((i) => i !== scene.image)
                        : [...list, scene.image],
                    )
                  }
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
              setKind("all");
              setQuery("");
            }}
          >
            {en ? "Show the collection" : "Vis samlingen"}
          </button>
        </div>
      )}
      <div className="vn-related">
        <Link href="/app/albums">
          {en ? "Browse albums" : "Utforsk album"} ↗
        </Link>
        <Link href="/app/tools/room-reimagination">
          {en ? "Open Studio" : "Åpne Studio"} ↗
        </Link>
      </div>
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
          <Link href={"/app/studies/" + selected.study}>
            {en ? "View example project" : "Åpne eksempelprosjekt"} ↗
          </Link>
        </div>
      </dialog>
    </section>
  );
}
