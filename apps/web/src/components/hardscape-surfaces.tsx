import { useState } from "react";
import Image from "next/image";
import "./designer-interior-controls.css";

const finishes: Record<string, { materials: string[]; patterns: string[] }> = {
  Terrace: { materials: ["Natural stone", "Porcelain", "Concrete slab", "Clay brick"], patterns: ["Running bond", "Herringbone", "Random", "Stack bond"] },
  Path: { materials: ["Natural stone", "Gravel", "Clay brick", "Stepping stones"], patterns: ["Running bond", "Herringbone", "Random"] },
  Driveway: { materials: ["Block paving", "Resin-bound gravel", "Concrete", "Gravel"], patterns: ["Herringbone", "Running bond", "Plain"] },
  Decking: { materials: ["Timber", "Composite"], patterns: ["Straight", "Diagonal", "Picture frame"] },
  Steps: { materials: ["Natural stone", "Timber", "Concrete", "Clay brick"], patterns: ["Solid treads", "Floating"] },
  "Retaining wall": { materials: ["Natural stone", "Gabion", "Rendered block", "Timber sleepers"], patterns: ["Coursed", "Dry-stacked", "Smooth"] },
  Edging: { materials: ["Steel", "Stone setts", "Timber", "Clay brick"], patterns: ["Flush", "Raised"] },
};
const types = Object.keys(finishes);
const norwegian: Record<string, string> = {
  Terrace: "Terrasse", Path: "Gangvei", Driveway: "Innkjørsel", Decking: "Terrassebord", Steps: "Trinn",
  "Retaining wall": "Støttemur", Edging: "Kant", "Natural stone": "Naturstein", Porcelain: "Porselen",
  "Concrete slab": "Betonghelle", "Clay brick": "Teglstein", "Running bond": "Løperforband",
  Herringbone: "Fiskebein", Random: "Uregelmessig", "Stack bond": "Rutemønster",
  Gravel: "Grus", "Stepping stones": "Tråkkheller", "Block paving": "Belegningsstein", "Resin-bound gravel": "Harpiksbundet grus",
  Concrete: "Betong", Plain: "Enkelt", Timber: "Tre", Composite: "Kompositt", Straight: "Rett", Diagonal: "Diagonal",
  "Picture frame": "Innrammet", "Solid treads": "Massive trinn", Floating: "Svevende", Gabion: "Gabion",
  "Rendered block": "Pusset blokk", "Timber sleepers": "Tresviller", Coursed: "Skiftmurt", "Dry-stacked": "Tørrstablet",
  Smooth: "Glatt", Steel: "Stål", "Stone setts": "Smågatestein", Flush: "I flukt", Raised: "Hevet",
};
type Surface = { id: number; x: number; y: number; type: string; material: string; pattern: string };
export function HardscapeSurfaces({ source, english }: { source: string; english: boolean }) {
  const [open, setOpen] = useState(false);
  const [marks, setMarks] = useState<Surface[]>([]);
  const [active, setActive] = useState<number>();
  const current = marks.find(mark => mark.id === active);
  const label = (value: string) => english ? value : norwegian[value] ?? value;
  function add(x: number, y: number) {
    const id = Math.max(0, ...marks.map(mark => mark.id)) + 1;
    setMarks([...marks, { id, x, y, type: "Terrace", material: finishes.Terrace.materials[0], pattern: finishes.Terrace.patterns[0] }]);
    setActive(id);
  }
  function update(changes: Partial<Surface>) {
    setMarks(previous => previous.map(mark => mark.id === active ? { ...mark, ...changes } : mark));
  }
  function choices(title: string, field: "type" | "material" | "pattern", options: string[]) {
    return <fieldset className="surface-choices"><legend>{title}</legend>{options.map(value => <label key={value}>
      <input type="radio" name={"surface-" + field} checked={current?.[field] === value} onChange={() => update(field === "type" ?
        { type: value, material: finishes[value].materials[0], pattern: finishes[value].patterns[0] } : { [field]: value })} />{label(value)}
    </label>)}</fieldset>;
  }
  return <section className="surface-editor">
    <button type="button" disabled={!source} aria-expanded={open} onClick={() => setOpen(!open)}>
      {english ? "Mark surfaces" : "Marker overflater"}{marks.length > 0 && " (" + marks.length + ")"}
    </button>
    {open && <>
      <p>{english ? "Mark positions on the photo for this session. These planning marks do not control the render." : "Marker plasseringer på bildet for denne økten. Planmerkene styrer ikke rendringen."}</p>
      <div className="surface-photo">
        <button type="button" className="surface-backdrop" aria-label={english ? "Add surface at image position" : "Legg til overflate på bildet"}
          onClick={e => {
            const bounds = e.currentTarget.getBoundingClientRect();
            add(e.detail === 0 ? 50 : Math.min(100, Math.max(0, (e.clientX - bounds.left) / bounds.width * 100)),
              e.detail === 0 ? 50 : Math.min(100, Math.max(0, (e.clientY - bounds.top) / bounds.height * 100)));
          }}>
          <Image src={source} alt="" width={500} height={350} unoptimized />
        </button>
        {marks.map((mark, i) => <button type="button" key={mark.id} className="surface-marker" style={{ left: mark.x + "%", top: mark.y + "%" }}
          aria-label={(english ? "Select surface " : "Velg overflate ") + (i + 1)} aria-pressed={active === mark.id}
          onClick={() => setActive(mark.id)}>{i + 1}</button>)}
      </div>
      {current && <>
        {(["x", "y"] as const).map(axis => <label key={axis}>{axis === "x" ? (english ? "Horizontal position" : "Horisontal posisjon") : (english ? "Vertical position" : "Vertikal posisjon")}
          <input type="range" min="0" max="100" value={current[axis]} onChange={e => update({ [axis]: Number(e.target.value) })}/>
        </label>)}
        {choices(english ? "Surface type" : "Overflatetype", "type", types)}
        {choices(english ? "Material" : "Materiale", "material", finishes[current.type].materials)}
        {choices(english ? "Laying pattern" : "Leggemønster", "pattern", finishes[current.type].patterns)}
        <button type="button" onClick={() => {
          const rest = marks.filter(mark => mark.id !== active);
          setMarks(rest); setActive(rest[0]?.id);
        }}>{english ? "Forget surface" : "Fjern overflate"}</button>
      </>}
      <div><button type="button" disabled={!marks.length} onClick={() => { setMarks([]); setActive(undefined); }}>{english ? "Clear" : "Tøm"}</button>
        <button type="button" onClick={() => setOpen(false)}>{english ? "Done" : "Ferdig"}</button></div>
    </>}
  </section>;
}
