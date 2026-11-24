"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

const channel = "https://www.youtube.com/@VastuNord";

export function PranaFilm({ locale, featured }: { locale: Locale; featured?: string }) {
  const en = locale === "en";
  const [video, setVideo] = useState<string | null | undefined>(featured);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (featured) return;
    const controller = new AbortController();
    async function readChannel() {
      try {
        const response = await fetch("/api/prana/film", { signal: controller.signal });
        const data = response.ok ? await response.json() : null;
        if (!controller.signal.aborted) setVideo(typeof data?.videoId === "string" && /^[\w-]{11}$/.test(data.videoId) ? data.videoId : null);
      } catch {
        if (!controller.signal.aborted) setVideo(null);
      }
    }
    void readChannel();
    return () => controller.abort();
  }, [featured]);

  return (
    <>
      <h2>{en ? "Vastu Nord films" : "Filmer fra Vastu Nord"}</h2>
      {video ? <>
        {play ? (
          <iframe className="prana-film" title={en ? "Vastu Nord film" : "Film fra Vastu Nord"}
            src={`https://www.youtube-nocookie.com/embed/${video}?autoplay=1&mute=0&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        ) : <>
          <p>{en ? "Play the film with sound using YouTube’s player." : "Spill filmen med lyd i YouTubes avspiller."}</p>
          <button className="prana-action prana-play" type="button" onClick={() => setPlay(true)}>
            {en ? "Play here" : "Spill av her"}
          </button>
        </>}
        <a className="prana-text-link" href={`https://www.youtube.com/watch?v=${video}`} target="_blank" rel="noreferrer">
          {en ? "Watch on YouTube" : "Se på YouTube"} <span aria-hidden="true">↗</span>
        </a>
      </> : <p aria-live="polite">{video === undefined
        ? (en ? "Checking for a film…" : "Henter filmoversikten …")
        : (en ? "There’s no film available to play here right now." : "Det er ingen film tilgjengelig for avspilling her akkurat nå.")}</p>}
      <a className="prana-text-link" href={channel} target="_blank" rel="noreferrer">@VastuNord {en ? "on YouTube" : "på YouTube"} <span aria-hidden="true">↗</span></a>
    </>
  );
}
