import { visibleControls, type Control, type ToolDefinition } from "@vastunord/contracts/tools";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import "./room-settings.css";

type Values = Record<string, string | number | boolean>;

const bokmal: Record<string, string> = {
  "Render style": "Bildestil", Photography: "Fotografi", "Clay model": "Leirmodell",
  Architectural: "Arkitektur", Pencil: "Blyant", Watercolor: "Akvarell",
  Illustration: "Illustrasjon", Diagram: "Diagram", "Material study": "Materialstudie",
  Camera: "Kamera", "Keep framing": "Behold utsnitt", Reframe: "Nytt utsnitt",
  Viewpoint: "Synsvinkel", "Eye level": "Øyehøyde", "Low angle": "Lav vinkel", Elevated: "Høyt ståsted",
  "Room type": "Romtype", "Auto-detect": "Automatisk", "Living room": "Stue",
  Bedroom: "Soverom", Kitchen: "Kjøkken", Bathroom: "Bad", Dining: "Spisestue",
  Office: "Kontor", Hallway: "Gang", "Room style": "Interiørstil", Scandinavian: "Skandinavisk",
  "Modern luxury": "Moderne luksus", Minimalist: "Minimalistisk", Industrial: "Industriell",
  Biophilic: "Naturinspirert", Palette: "Palett", "Pale oak": "Lys eik",
  "Ink & cream": "Blekk og krem", Ember: "Glød", "Sea glass": "Sjøglass", Clay: "Leire",
  "Deep forest": "Skoggrønn", Daylight: "Dagslys", "As photographed": "Som på bildet",
  "Soft daylight": "Mykt dagslys", "Direct sun": "Direkte sol", "Golden hour": "Gylden time",
  "Blue hour": "Blåtime", Night: "Natt", Lighting: "Belysning", "Window light": "Vinduslys",
  "Task lighting": "Arbeidslys", Layered: "Flere lyskilder", Furnishing: "Møblering", Empty: "Tomt",
  Minimal: "Sparsom", Balanced: "Balansert", Full: "Full", "Indoor plants": "Planter",
  None: "Ingen", "A few": "Noen få", Lush: "Frodig", Accessories: "Tilbehør",
  Curated: "Utvalgt", "Floor finish": "Gulv", "Keep existing": "Behold", "Pale timber": "Lyst tre",
  "Natural stone": "Naturstein", Polished: "Polert", "Child-friendly layout": "Barnevennlig innredning",
  People: "Personer", Many: "Mange", Annotations: "Bildetekst", "Remove text": "Fjern tekst",
  "Output ratio": "Bildeformat", Seed: "Startverdi", "Room details": "Romdetaljer",
  "Camera and light": "Kamera og lys", "Output settings": "Bildeinnstillinger",
  "Start with a room brief": "Velg et romkonsept",
  "Forest stillness": "Skogens ro", "Everyday rhythm": "Hverdagsrytme", "By the hearth": "Rundt ildstedet",
  "Window light and pale timber": "Vinduslys og lyst tre",
  "Open space for family life": "Åpen plass til familieliv",
  "Full seating in the evening light": "Flere sitteplasser i kveldslys",
  Random: "Tilfeldig", "New random seed": "Ny tilfeldig startverdi",
  "Time of day": "Tid på døgnet", "Site context": "Omgivelser", Greenery: "Vegetasjon",
  Vehicles: "Kjøretøy", "Numbered location pins": "Nummererte plasseringsmerker",
};
export function roomLabel(label: string, locale: Locale) {
  return locale === "en" ? label : (bokmal[label] ?? label);
}

const directions = [
  { name: "Forest stillness", photo: "forest-stillness", detail: "Window light and pale timber",
    values: { style: "Japandi", furnishing: "Minimal", plants: "A few", lighting: "Window light", palette: "Pale oak", time: "Soft daylight", safe: false } },
  { name: "Everyday rhythm", photo: "everyday-rhythm", detail: "Open space for family life",
    values: { style: "Scandinavian", furnishing: "Balanced", plants: "A few", lighting: "Layered", palette: "Sea glass", time: "As photographed", safe: true } },
  { name: "By the hearth", photo: "by-the-hearth", detail: "Full seating in the evening light",
    values: { style: "Scandinavian", furnishing: "Full", plants: "A few", lighting: "Layered", palette: "Ember", time: "Golden hour", safe: false } },
] as const;

function RoomField({ control, locale, value, change }: {
  control: Control; locale: Locale; value?: string | number | boolean;
  change: (value: string | number | boolean) => void;
}) {
  const title = roomLabel(control.label, locale);
  if (control.kind === "toggle") return (
    <label className="room-check">
      <input type="checkbox" checked={value === true} onChange={(event) => change(event.target.checked)} />
      {title}
    </label>
  );
  if (control.kind === "integer") return (
    <div className="room-seed">
      <label htmlFor="room-seed">{title}</label>
      <input id="room-seed" type="text" inputMode="numeric" placeholder={roomLabel("Random", locale)}
        value={String(value ?? "")} onChange={(event) => {
          const input = event.target.value;
          if (input === "" || (/^\d{1,10}$/.test(input) && Number(input) <= control.max!)) change(input);
        }} />
      <button type="button" aria-label={roomLabel("New random seed", locale)}
        onClick={() => change(crypto.getRandomValues(new Uint32Array(1))[0])}>⤨</button>
    </div>
  );
  if (["room", "style", "palette", "medium"].includes(control.id)) return (
    <label className="room-select">
      {title}
      <select value={String(value)} onChange={(event) => change(event.target.value)}>
        {control.options?.map(option => <option key={option} value={option}>{roomLabel(option, locale)}</option>)}
      </select>
    </label>
  );
  return (
    <fieldset className="room-choices">
      <legend>{title}</legend>
      <div className="room-chip-list">
        {control.options?.map((option) => (
          <label key={option} className="room-chip">
            <input type="radio" aria-label={roomLabel(option, locale)} name={"room-" + control.id} value={option}
              checked={value === option} onChange={() => change(option)} />
            <span>{roomLabel(option, locale)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function RoomSettings({ tool, values, locale, update }: {
  tool: ToolDefinition; values: Values; locale: Locale; update: (values: Values) => void;
}) {
  const controls = visibleControls(tool, values);
  const fields = (...ids: string[]) => ids.map(id => {
    const control = controls.find(item => item.id === id);
    return control && <RoomField key={id} control={control} locale={locale} value={values[id]}
      change={value => update({ [id]: value })} />;
  });
  return (
    <section className="inspector-group room-settings" id="room-settings" aria-label={locale === "en" ? "Room design settings" : "Innstillinger for romdesign"}>
      <fieldset className="room-choices">
        <legend>{roomLabel("Start with a room brief", locale)}</legend>
        <div className="room-directions">{directions.map(direction => {
          const selected = Object.entries(direction.values).every(([id, value]) => values[id] === value);
          return (
            <button type="button" key={direction.photo} aria-pressed={selected}
              onClick={() => update(direction.values)}>
              <Image src={"/media/briefs/" + direction.photo + ".webp"} alt="" unoptimized width={112} height={80} />
              <span className="room-direction-copy">
                <strong>{roomLabel(direction.name, locale)}</strong>
                <small>{roomLabel(direction.detail, locale)}</small>
              </span>
              {selected && <span className="room-direction-check" aria-hidden="true">✓</span>}
            </button>
          );
        })}</div>
      </fieldset>
      <div className="room-selects">{fields("room", "style")}</div>
      <details className="room-drawer">
        <summary>{roomLabel("Camera and light", locale)}</summary>
        <div>{fields("camera", "viewpoint", "time", "lighting")}</div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Room details", locale)}</summary>
        <div>
          {fields("palette", "furnishing", "plants", "accessories", "floor", "safe", "people", "markings")}
        </div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Output settings", locale)}</summary>
        <div>{fields("medium", "ratio", "seed")}</div>
      </details>
    </section>
  );
}
