"use client";
import { useEffect, useRef, useState } from "react";
import type { BriefValues } from "@/lib/studio-render";

// Only pixel copies are edited. The source can be an authenticated same-origin
// download, a local object URL, or the selected Studio sample.
function paint(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  values: BriefValues,
  limit: number,
) {
  const n = (key: string) => Number(values[key] ?? 0);
  const originalRatio = image.naturalWidth / image.naturalHeight;
  const [a, b] = String(values.crop ?? "Original")
    .split(":")
    .map(Number);
  const ratio = a && b ? a / b : originalRatio;
  const w = Math.min(image.naturalWidth, image.naturalHeight * ratio);
  const h = w / ratio;
  const scale = Math.min(1, limit / Math.max(w, h));
  canvas.width = Math.max(1, Math.round(w * scale));
  canvas.height = Math.max(1, Math.round(h * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw Error("Canvas unavailable");
  const angle = (n("straighten") * Math.PI) / 180;
  const c = Math.abs(Math.cos(angle)),
    s = Math.abs(Math.sin(angle));
  const fill = Math.max(
    (w * c + h * s) / image.naturalWidth,
    (h * c + w * s) / image.naturalHeight,
  );
  const zoom = Math.max(1, fill) * scale;
  const looks: Record<string, string> = {
    Natural: "contrast(1.04) saturate(1.08)",
    Warm: "sepia(.25)",
    Cool: "sepia(.13) hue-rotate(145deg)",
    Matte: "contrast(.83) brightness(1.08)",
    Mono: "grayscale(1)",
  };
  ctx.filter = [
    "brightness(" + (1 + n("adjust-2") / 100) + ")",
    "contrast(" + (1 + n("adjust-3") / 100) + ")",
    "saturate(" + (1 + n("adjust-4") / 100) + ")",
    looks[String(values.look)] ?? "",
  ]
    .join(" ")
    .trim();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(values["flip-h"] ? -1 : 1, values["flip-v"] ? -1 : 1);
  ctx.rotate(angle);
  const dw = image.naturalWidth * zoom,
    dh = image.naturalHeight * zoom;
  ctx.drawImage(image, -dw / 2, -dh / 2, dw, dh);
  const noise = n("adjust-0") / 100,
    sharp = n("adjust-1") / 100;
  if (!noise && !sharp) return;
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const input = new Uint8ClampedArray(pixels.data);
  const row = canvas.width * 4;
  for (let y = 1; y < canvas.height - 1; y++)
    for (let x = 1; x < canvas.width - 1; x++) {
      const pos = y * row + x * 4;
      for (let k = pos; k < pos + 3; k++) {
        const mean =
          (input[k - row] + input[k + row] + input[k - 4] + input[k + 4]) / 4;
        const delta = input[k] - mean;
        const smoothed = input[k] - noise * (Math.abs(delta) < 28 ? delta : 0);
        pixels.data[k] = smoothed + sharp * (smoothed - mean);
      }
    }
  ctx.putImageData(pixels, 0, 0);
}
export function LocalPhotoAdjustments({
  source,
  values,
  english,
}: {
  source: string;
  values: BriefValues;
  english: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState<{
    url: string;
    image: HTMLImageElement;
  } | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    const im = new Image();
    im.onload = () => {
      if (active) {
        setError(false);
        setLoaded({ url: source, image: im });
      }
    };
    im.onerror = () => {
      if (active) setError(true);
    };
    im.src = source;
    return () => {
      active = false;
    };
  }, [source]);
  useEffect(() => {
    if (!canvas.current || loaded?.url !== source) return;
    const frame = requestAnimationFrame(() => {
      try {
        paint(canvas.current!, loaded.image, values, 960);
        setError(false);
      } catch {
        setError(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [loaded, source, values]);
  async function download() {
    if (loaded?.url !== source) return;
    try {
      const output = document.createElement("canvas");
      paint(output, loaded.image, values, 4096);
      const blob = await new Promise<Blob | null>((resolve) =>
        output.toBlob(resolve, "image/png"),
      );
      if (!blob) throw Error("Encoding failed");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vastunord-adjustments.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      setError(true);
    }
  }
  return (
    <figure className="designer-local-preview">
      <canvas
        hidden={error || loaded?.url !== source}
        ref={canvas}
        aria-label={english ? "Adjusted photograph" : "Justert fotografi"}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <figcaption>
        {error
          ? english
            ? "Image unavailable"
            : "Bildet er utilgjengelig"
          : english
            ? "On-device preview · PNG export up to 4096 px"
            : "Lokal forhåndsvisning · PNG-eksport inntil 4096 px"}
      </figcaption>
      <button
        type="button"
        className="button"
        disabled={error || loaded?.url !== source}
        onClick={download}
      >
        {english
          ? "Apply adjustments and download"
          : "Bruk justeringer og last ned"}
      </button>
    </figure>
  );
}
