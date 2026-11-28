import type { CSSProperties } from "react";
import type { BriefValues } from "@/lib/studio-render";
export function photoAppearance(
  tool: string,
  values: BriefValues,
): CSSProperties | undefined {
  if (tool === "perspective-correction" && values.mode !== "Camera angle") {
    return {
      transform:
        "perspective(900px) rotateX(" +
        Number(values.vertical ?? 0) * 0.18 +
        "deg) rotateY(" +
        Number(values.horizontal ?? 0) * 0.18 +
        "deg)",
    };
  }
  if (!values.preview) return;
  if (tool === "lighting-reimagination") {
    const warmth = (5000 - Number(values.temperature ?? 2700)) / 2800;
    return {
      filter:
        "brightness(" +
        (0.52 + Number(values.brightness ?? 60) / 100) +
        ") sepia(" +
        warmth * 0.34 +
        ") saturate(" +
        (1 + warmth * 0.18) +
        ")",
    };
  }
  if (tool === "seasonal-transformation") {
    const grades: Record<string, string> = {
      Spring: "saturate(1.12) brightness(1.04)",
      Summer: "saturate(1.24) sepia(.08)",
      Autumn: "sepia(.34) saturate(1.2)",
      Winter: "saturate(.56) brightness(1.1)",
    };
    return { filter: grades[String(values.season ?? "Spring")] };
  }
}
export function skyWash(values: BriefValues): CSSProperties {
  const times: Record<string, string> = {
    Morning: "#8bcde8",
    Midday: "#56a8de",
    "Golden hour": "#eaa673",
    "Blue hour": "#6576a1",
    Night: "#1c2944",
  };
  const weather: Record<string, string> = {
    Clear: "transparent",
    Overcast: "#adb6bf",
    Hazy: "#e1daca",
    Rain: "#5e7183",
    Snow: "#eef3f8",
  };
  return {
    backgroundImage:
      "linear-gradient(to bottom, " +
      (weather[String(values.weather)] ?? "transparent") +
      ", transparent),linear-gradient(to bottom," +
      (times[String(values.time)] ?? times.Morning) +
      ",transparent)",
    filter: "saturate(" + Number(values.saturation ?? 50) / 50 + ")",
    opacity: 0.3 + Number(values.clouds ?? 45) * 0.006,
  };
}
export function PoolPlan({
  values,
  english,
}: {
  values: BriefValues;
  english: boolean;
}) {
  const pool = values.mode !== "Spa",
    spa = values.mode !== "Pool",
    together = values.placement === "Attached/spillover";
  const shape = String(values["pool-option-2"] ?? "Rectangular");
  const shapeStyle = (name: string): CSSProperties => ({
    borderRadius: ["Round", "Circular"].includes(name)
      ? "50%"
      : name === "Freeform"
        ? "58% 32% 54% 25%"
        : "4px",
    clipPath:
      name === "L-shape"
        ? "polygon(0 0, 46% 0, 46% 55%, 100% 55%, 100% 100%, 0 100%)"
        : undefined,
  });
  return (
    <figure className="designer-pool-plan">
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: together
            ? 0
            : values.placement === "Separate area"
              ? "20%"
              : "5%",
          padding: "1.5rem",
          background: "var(--surface)",
          minHeight: 100,
        }}
      >
        {pool && (
          <span
            style={{
              width: shape === "Circular" ? 82 : "52%",
              height: 82,
              background: "#518ca4",
              ...shapeStyle(shape),
            }}
          />
        )}
        {spa && (
          <span
            style={{
              width: 54,
              height: 54,
              background: "#72a9b5",
              ...shapeStyle(String(values["spa-option-1"] ?? "Round")),
            }}
          />
        )}
      </div>
      <figcaption>
        {english ? "Plan, not to scale" : "Planskjema uten målestokk"} ·{" "}
        {[
          pool && values.pool,
          pool && shape,
          spa && values["spa-option-0"],
          pool && spa && values.placement,
        ]
          .filter(Boolean)
          .join(" · ")}
      </figcaption>
    </figure>
  );
}
