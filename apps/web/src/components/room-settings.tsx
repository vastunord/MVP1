import {
  visibleControls,
  type ToolDefinition,
} from "@vastunord/contracts/tools";
import { StudioChoices } from "./studio-choices";
import type { Locale } from "@/lib/i18n";

type Values = Record<string, string | number | boolean>;

const bokmal: Record<string, string> = {
  "Season’s own": "Sesongens egen",
  Morning: "Morgen", Midday: "Midt på dagen",
  "Natural only": "Bare naturlig lys", "Warm lamps": "Varme lamper", Bright: "Lyst", Moody: "Stemningsfullt",
  Light: "Lett", Generous: "Frodig", Considered: "Gjennomtenkt", Walnut: "Valnøtt", Concrete: "Betong", Stone: "Stein",
  "Cleanup method": "Ryddemetode", "Clean up the room": "Rydd rommet",
  "Enhancement mode": "Forbedringsmåte", "Manual controls": "Manuelle justeringer", "Auto enhance": "Automatisk forbedring",
  "Noise reduction": "Støyreduksjon", Sharpness: "Skarphet", Brightness: "Lysstyrke", Contrast: "Kontrast", Saturation: "Fargemetning",
  Upscale: "Oppskalering", "Original size": "Originalstørrelse", Look: "Bildeuttrykk", Crop: "Beskjæring",
  Straighten: "Rett opp", "Flip horizontal": "Speil vannrett", "Flip vertical": "Speil loddrett",
  "Correction mode": "Korreksjonsmåte", "Fix distortion": "Korriger forvrengning", "Camera angle": "Kameravinkel",
  Vertical: "Loddrett", Horizontal: "Vannrett", "Show guides": "Vis hjelpelinjer",
  "Preview on my photo": "Forhåndsvis på bildet mitt", "Colour temperature": "Fargetemperatur",
  "Decor style": "Dekorstil", "Garden area": "Hageområde", "Just tidy it up": "Rydd opp i hagen",
  "Render style": "Bildestil",
  Photography: "Fotorealistisk",
  "Clean 3D": "Ren 3D",
  "Line drawing": "Strektegning",
  "Neutral clay": "Nøytral leire",
  "Clay model": "Leirmodell",
  Architectural: "Arkitektur",
  Pencil: "Blyant",
  Watercolor: "Akvarell",
  Illustration: "Illustrasjon",
  Diagram: "Diagram",
  "Material study": "Materialstudie",
  Camera: "Kamera",
  "Keep framing": "Behold utsnitt",
  Reframe: "Nytt utsnitt",
  Viewpoint: "Synsvinkel",
  "Eye level": "Øyehøyde",
  "Low angle": "Lav vinkel",
  Elevated: "Høyt ståsted",
  "Room type": "Romtype",
  "Auto-detect": "Automatisk",
  "Living room": "Stue",
  Bedroom: "Soverom",
  Kitchen: "Kjøkken",
  Bathroom: "Bad",
  Dining: "Spisestue",
  Office: "Kontor",
  Hallway: "Gang",
  "Room style": "Interiørstil",
  Scandinavian: "Skandinavisk",
  "Modern luxury": "Moderne luksus",
  Minimalist: "Minimalistisk",
  Industrial: "Industriell",
  Biophilic: "Naturinspirert",
  Palette: "Palett",
  "Pale oak": "Lys eik",
  "Ink & cream": "Blekk og krem",
  Ember: "Glød",
  "Sea glass": "Sjøglass",
  Clay: "Leire",
  "Deep forest": "Skoggrønn",
  Daylight: "Dagslys",
  "As photographed": "Som på bildet",
  "Soft daylight": "Mykt dagslys",
  "Direct sun": "Direkte sol",
  "Golden hour": "Gylden time",
  "Blue hour": "Blåtime",
  Night: "Natt",
  Lighting: "Belysning",
  "Window light": "Vinduslys",
  "Task lighting": "Arbeidslys",
  Layered: "Flere lyskilder",
  Furnishing: "Møblering",
  Empty: "Tomt",
  Minimal: "Sparsom",
  Balanced: "Balansert",
  Full: "Full",
  "Indoor plants": "Planter",
  None: "Ingen",
  "A few": "Noen få",
  Lush: "Frodig",
  Accessories: "Tilbehør",
  Curated: "Utvalgt",
  "Floor finish": "Gulv",
  "Keep existing": "Behold",
  "Pale timber": "Lyst tre",
  "Natural stone": "Naturstein",
  Polished: "Polert",
  "Child-friendly layout": "Barnevennlig innredning",
  People: "Personer",
  Many: "Mange",
  Annotations: "Bildetekst",
  "Remove text": "Fjern tekst",
  "Output ratio": "Bildeformat",
  "Room details": "Romdetaljer",
  "Camera and light": "Kamera og lys",
  "Output settings": "Bildeinnstillinger",
  "Time of day": "Tid på døgnet",
  "Site context": "Omgivelser",
  Greenery: "Vegetasjon",
  Vehicles: "Kjøretøy",
  "Numbered location pins": "Nummererte plasseringsmerker",
};
export function roomLabel(label: string, locale: Locale) {
  return locale === "en" ? label : (bokmal[label] ?? label);
}

export function RoomSettings({
  tool,
  values,
  locale,
  update,
}: {
  tool: ToolDefinition;
  values: Values;
  locale: Locale;
  update: (values: Values) => void;
}) {
  const controls = visibleControls(tool, values);
  function reset(ids: string[]) {
    update(Object.fromEntries(tool.controls.filter((c) => ids.includes(c.id) && c.defaultValue !== undefined).map((c) => [c.id, c.defaultValue!])));
  }
  const resetButton = (ids: string[]) => <button type="button" className="room-reset" onClick={() => reset(ids)}>{locale === "en" ? "Reset section" : "Tilbakestill seksjonen"}</button>;
  function fields(...ids: string[]) {
    return ids.map((id) => {
      const c = controls.find((item) => item.id === id);
      if (!c) return null;
      if (c.kind === "toggle")
        return (
          <label key={id} className="room-check">
            <input
              type="checkbox"
              checked={values[id] === true}
              onChange={(e) => update({ [id]: e.target.checked })}
            />
            {roomLabel(c.label, locale)}
          </label>
        );
      const illustrated = [
        "room",
        "style",
        "time",
        "viewpoint",
        "camera",
        "lighting",
        "medium",
        "palette",
      ].includes(id);
      return (
        <StudioChoices
          key={id}
          kind={illustrated ? id : "compact"}
          label={roomLabel(c.label, locale)}
          value={String(values[id] ?? "")}
          choices={(c.options ?? []).filter((value) => id !== "medium" || !["Clay model", "CAD", "Material study"].includes(value) || values[id] === value).map((value) => ({
            value,
            label: value === "Photography" && locale === "en" ? "Photorealistic" : value === "Pencil" && locale === "en" ? "Pencil sketch" : value === "Diagram" && locale === "en" ? "Spatial diagram" : roomLabel(value, locale),
          }))}
          onChange={(v) => update({ [id]: v })}
        />
      );
    });
  }
  const en = locale === "en";
  const changed = controls.filter((control) => control.defaultValue !== undefined && values[control.id] !== undefined && values[control.id] !== control.defaultValue && !["room", "style", "medium"].includes(control.id));
  return (
    <section
      className="inspector-group room-settings"
      id="room-settings"
      aria-label={en ? "Room design settings" : "Innstillinger for romdesign"}
    >
      <details className="room-drawer" open>
        <summary>{roomLabel("Render style", locale)}</summary>
        <div>{fields("medium")}{resetButton(["medium"])}</div>
      </details>
      <details className="room-drawer" open>
        <summary>
          {en ? "Room type and style" : "Romtype og interiørstil"}
        </summary>
        <div>{fields("room", "style", "palette")}{resetButton(["room", "style", "palette"])}</div>
      </details>
      <details className="room-drawer">
        <summary>{en ? "More options" : "Flere valg"} {changed.length ? `(${changed.length})` : ""}</summary>
        <div>
      <p className="inspector-help">{changed.length ? changed.map((control) => `${roomLabel(control.label, locale)}: ${roomLabel(String(values[control.id]), locale)}`).join(" · ") : (en ? "Using tool defaults" : "Bruker standardvalg")}</p>
      <details className="room-drawer">
        <summary>{roomLabel("Camera and light", locale)}</summary>
        <div>{fields("camera", "viewpoint", "time", "lighting")}{resetButton(["camera", "viewpoint", "time", "lighting"])}</div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Room details", locale)}</summary>
        <div>
          {fields(
            "floor",
            "furnishing",
            "plants",
            "accessories",
            "safe",
            "people",
            "markings",
          )}
          <p className="inspector-help">{en ? "Child-friendly layout guides the design. A safety inspection requires an on-site assessment." : "Barnevennlig innredning gir føringer for designet. En sikkerhetsvurdering krever befaring."}</p>
          {resetButton(["furnishing", "plants", "accessories", "floor", "safe", "people", "markings"])}
        </div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Output settings", locale)}</summary>
        <div>{fields("ratio")}{resetButton(["ratio"])}</div>
      </details>
        </div>
      </details>
    </section>
  );
}
