import Image from "next/image";
import "./room-settings.css";
import { useId, type CSSProperties } from "react";

const photos: Record<string, string> = {
  design: "from-photo",
  masterplan: "masterplan",
  style: "reference-style",
  concept: "written-concept",
  video: "walkthrough",
  "Living room": "living-room",
  Bedroom: "bedroom",
  Dining: "dining",
  Kitchen: "kitchen",
  Office: "office",
  Bathroom: "bathroom",
  Scandinavian: "scandinavian",
  Japandi: "japandi",
  "Modern luxury": "modern-luxury",
  Minimalist: "minimalist",
  Industrial: "style-industrial",
  Biophilic: "biophilic",
  "Soft daylight": "soft-daylight",
  "Direct sun": "direct-sun",
  "Golden hour": "golden-hour",
  "Blue hour": "blue-hour",
  "As photographed": "as-photographed",
  "Window light": "window-light",
  Layered: "layered-light",
  "Eye level": "camera-level",
  "Low angle": "camera-low",
  Elevated: "camera-high",
};
const graphic: Record<string, string> = {
  plan: "⌗",
  sketch: "✎",
  "Auto-detect": "⌾",
  Auto: "⌾",
  Hallway: "⇥",
  Night: "☾",
  "Task lighting": "◒",
  "Keep framing": "⊡",
  Reframe: "⌖",
  upscale: "⤢",
  Photography: "◉",
  "Clay model": "⬡",
  Architectural: "▦",
  Pencil: "✎",
  Watercolor: "◒",
  Illustration: "◇",
  Diagram: "⌗",
  CAD: "⌖",
  "Material study": "▧",
};
const swatches: Record<string, string> = {
  "Pale oak": "linear-gradient(100deg,#d2b58c,#f1dec7,#c5a47c)",
  "Ink & cream": "linear-gradient(110deg,#193542 50%,#f2e6d7 50%)",
  Ember: "linear-gradient(110deg,#b95738 52%,#e3aa7c 52%)",
  "Sea glass": "linear-gradient(110deg,#7e9f92 55%,#c2d6cf 55%)",
  Clay: "linear-gradient(110deg,#a46a55 50%,#e0bda0 50%)",
  "Deep forest": "linear-gradient(110deg,#334d45 50%,#738372 50%)",
};
type Choice = {
  value: string;
  label: string;
  image?: string;
  disabled?: boolean;
};
export function StudioChoices({
  label,
  choices,
  value,
  onChange,
  kind = "compact",
  disabled = false,
}: {
  label: string;
  choices: readonly Choice[];
  value: string;
  onChange: (value: string) => void;
  kind?: string;
  disabled?: boolean;
}) {
  const name = useId();
  return (
    <fieldset className={"studio-choices choices-" + kind} disabled={disabled}>
      <legend>{label}</legend>
      <div>
        {choices.map((choice, index) => {
          const slug = photos[choice.value];
          const source =
            choice.image ??
            (slug ? "/media/options/" + slug + ".webp" : undefined);
          const artwork = kind !== "compact";
          const swatch =
            kind === "palette" ? swatches[choice.value] : undefined;
          return (
            <label key={choice.value} className="studio-choice">
              <input
                type="radio"
                aria-label={choice.label}
                name={name}
                value={choice.value}
                checked={value === choice.value}
                disabled={choice.disabled}
                onChange={() => onChange(choice.value)}
              />
              {artwork && (
                <span
                  aria-hidden="true"
                  className={"choice-art art-" + kind}
                  style={
                    {
                      "--choice-index": index,
                      ...(swatch ? { background: swatch } : {}),
                    } as CSSProperties
                  }
                >
                  {kind === "level" ? (
                    <span className={"level-bars level-" + choice.value}>
                      {[1, 2, 3, 4].map((i) => (
                        <i key={i} />
                      ))}
                    </span>
                  ) : source ? (
                    <Image
                      src={source}
                      alt=""
                      width={120}
                      height={64}
                      unoptimized
                    />
                  ) : (
                    <span className="choice-mark">
                      {swatch ? "" : graphic[choice.value] || "◇"}
                    </span>
                  )}
                </span>
              )}
              <span className="choice-label">{choice.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
