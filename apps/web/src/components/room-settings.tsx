import {
  visibleControls,
  type ToolDefinition,
} from "@vastunord/contracts/tools";
import { StudioChoices } from "./studio-choices";
import type { Locale } from "@/lib/i18n";
import "./room-settings.css";

type Values = Record<string, string | number | boolean>;

const bokmal: Record<string, string> = {
  "Render style": "Bildestil",
  Photography: "Fotografi",
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
        "palette",
        "medium",
      ].includes(id);
      return (
        <StudioChoices
          key={id}
          kind={illustrated ? id : "compact"}
          label={roomLabel(c.label, locale)}
          value={String(values[id] ?? "")}
          choices={(c.options ?? []).map((value) => ({
            value,
            label: roomLabel(value, locale),
          }))}
          onChange={(v) => update({ [id]: v })}
        />
      );
    });
  }
  const en = locale === "en";
  return (
    <section
      className="inspector-group room-settings"
      id="room-settings"
      aria-label={en ? "Room design settings" : "Innstillinger for romdesign"}
    >
      <details className="room-drawer" open>
        <summary>
          {en ? "Room type and style" : "Romtype og interiørstil"}
        </summary>
        <div>{fields("room", "style")}</div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Camera and light", locale)}</summary>
        <div>{fields("camera", "viewpoint", "time", "lighting")}</div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Room details", locale)}</summary>
        <div>
          {fields(
            "palette",
            "furnishing",
            "plants",
            "accessories",
            "floor",
            "safe",
            "people",
            "markings",
          )}
        </div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Output settings", locale)}</summary>
        <div>{fields("medium", "ratio")}</div>
      </details>
    </section>
  );
}
