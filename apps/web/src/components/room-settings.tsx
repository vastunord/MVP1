import { visibleControls, type Control, type ToolDefinition } from "@vastunord/contracts/tools";
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
  "Design direction": "Designretning", "Quiet retreat": "Rolig fristed",
  "Family living": "Familieliv", "Social space": "Sosialt rom",
  Random: "Tilfeldig", "New random seed": "Ny tilfeldig startverdi",
  "Time of day": "Tid på døgnet", "Site context": "Omgivelser", Greenery: "Vegetasjon",
  Vehicles: "Kjøretøy", "Numbered location pins": "Nummererte plasseringsmerker",
};
export function roomLabel(label: string, locale: Locale) {
  return locale === "en" ? label : (bokmal[label] ?? label);
}

const directions = [
  { name: "Quiet retreat", values: { style: "Japandi", furnishing: "Minimal", plants: "A few", lighting: "Window light", safe: false } },
  { name: "Family living", values: { style: "Scandinavian", furnishing: "Balanced", plants: "A few", lighting: "Layered", safe: true } },
  { name: "Social space", values: { style: "Modern luxury", furnishing: "Full", plants: "Lush", lighting: "Layered", safe: false } },
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
  if (["room", "style", "palette"].includes(control.id)) return (
    <label className="room-select">
      {title}
      <select value={String(value)} onChange={(event) => change(event.target.value)}>
        {control.options?.map(option => <option key={option} value={option}>{roomLabel(option, locale)}</option>)}
      </select>
    </label>
  );
  const medium = control.id === "medium";
  return (
    <fieldset className="room-choices">
      <legend>{title}</legend>
      <div className={medium ? "room-media-grid" : "room-chip-list"}>
        {control.options?.map((option) => (
          <label key={option} className={medium ? "room-medium" : "room-chip"}>
            <input type="radio" aria-label={roomLabel(option, locale)} name={"room-" + control.id} value={option}
              checked={value === option} onChange={() => change(option)} />
            {medium && <span aria-hidden="true" data-medium={option} className="room-material-art">
              <i className="material-slab" /><i className="material-arch" /><i className="material-sphere" />
            </span>}
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
      {fields("medium")}
      <div className="room-selects">{fields("room", "style")}</div>
      <details className="room-drawer" open>
        <summary>{roomLabel("Camera and light", locale)}</summary>
        <div>{fields("camera", "viewpoint", "time", "lighting")}</div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Room details", locale)}</summary>
        <div>
          <fieldset className="room-choices">
            <legend>{roomLabel("Design direction", locale)}</legend>
            <div className="room-directions">{directions.map(direction =>
              <button type="button" key={direction.name}
                aria-pressed={Object.entries(direction.values).every(([id, value]) => values[id] === value)}
                onClick={() => update(direction.values)}>{roomLabel(direction.name, locale)}</button>
            )}</div>
          </fieldset>
          {fields("palette", "furnishing", "plants", "accessories", "floor", "safe", "people", "markings")}
        </div>
      </details>
      <details className="room-drawer">
        <summary>{roomLabel("Output settings", locale)}</summary>
        <div>{fields("ratio", "seed")}</div>
      </details>
    </section>
  );
}
