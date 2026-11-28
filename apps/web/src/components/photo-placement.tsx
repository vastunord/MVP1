"use client";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_MIB,
} from "@/lib/image-upload-policy";

const materialOptions: Record<string, string[]> = {
  Floor: [
    "Pale oak",
    "Smoked oak",
    "Walnut",
    "Terrazzo",
    "Polished concrete",
    "Travertine",
  ],
  Wall: [
    "Limewash",
    "Matt paint",
    "Microcement",
    "Timber panelling",
    "Zellige tile",
  ],
  Ceiling: ["Matt white", "Timber slats", "Limewash"],
  Worktop: ["Marble", "Terrazzo", "Quartz", "Solid oak", "Stainless steel"],
  "Cabinet fronts": [
    "Painted sage",
    "Painted navy",
    "Oak veneer",
    "Walnut veneer",
    "Matt white",
  ],
};
const materialNb: Record<string, string> = {
  Floor: "Gulv",
  Wall: "Vegg",
  Ceiling: "Tak",
  Worktop: "Benkeplate",
  "Cabinet fronts": "Skapfronter",
  "Pale oak": "Lys eik",
  "Smoked oak": "Røkt eik",
  Walnut: "Valnøtt",
  "Polished concrete": "Polert betong",
  Travertine: "Travertin",
  Limewash: "Kalkmaling",
  "Matt paint": "Matt maling",
  Microcement: "Mikrosement",
  "Timber panelling": "Trepanel",
  "Zellige tile": "Zellige-flis",
  "Matt white": "Matt hvit",
  "Timber slats": "Trespiler",
  Marble: "Marmor",
  Quartz: "Kvarts",
  "Solid oak": "Massiv eik",
  "Stainless steel": "Rustfritt stål",
  "Painted sage": "Salviegrønn",
  "Painted navy": "Marineblå",
  "Oak veneer": "Eikefinér",
  "Walnut veneer": "Valnøttfinér",
};
const sizes = ["Small", "Life-size", "Large"] as const;
type Size = (typeof sizes)[number];
type Pin = {
  id: string;
  x: number;
  y: number;
  size: Size;
  details: string;
  assetId: string;
  surface?: string;
  finish?: string;
  decorAction?: "Add" | "Restyle" | "Clear";
};
type Asset = { id: string; mimeType: string };
const assetUrl = (id: string) =>
  "/api/assets/" + encodeURIComponent(id) + "/download";
const tools = [
  "decor-redefinition",
  "material-refinement",
  "lighting-reimagination",
  "object-placement",
];
export const hasPlacement = (toolId: string) => tools.includes(toolId);

function validPin(value: unknown): value is Pin {
  if (!value || typeof value !== "object") return false;
  const p = value as Partial<Pin>;
  return (
    typeof p.id === "string" &&
    /^[\w-]{1,80}$/.test(p.id) &&
    [p.x, p.y].every(
      (v) => typeof v === "number" && Number.isFinite(v) && v >= 0 && v <= 100,
    ) &&
    sizes.includes(p.size as Size) &&
    typeof p.details === "string" &&
    p.details.length <= 400 &&
    (p.surface === undefined || Object.hasOwn(materialOptions, p.surface)) &&
    (p.finish === undefined ||
      Boolean(p.surface && materialOptions[p.surface]?.includes(p.finish))) &&
    (p.decorAction === undefined ||
      ["Add", "Restyle", "Clear"].includes(p.decorAction)) &&
    typeof p.assetId === "string" &&
    /^[\w-]{0,100}$/.test(p.assetId)
  );
}
// Only private project asset IDs and positions can survive a reload. Device
// images never enter storage or a provider request.
export function PhotoPlacement({
  toolId,
  source,
  projectId,
  sourceId,
  storageKey,
  english,
}: {
  toolId: string;
  source: string;
  projectId: string;
  sourceId: string;
  storageKey?: string;
  english: boolean;
}) {
  const pick = (en: string, nb: string) => (english ? en : nb);
  const surface = toolId === "material-refinement";
  const title = surface
    ? pick("Pick surfaces", "Velg overflater")
    : toolId === "lighting-reimagination"
      ? pick("Place a light", "Plasser en lampe")
      : toolId === "decor-redefinition"
        ? pick("Place decor", "Plasser dekor")
        : pick("Place an object", "Plasser en gjenstand");
  const [pins, setPins] = useState<Pin[]>([]);
  const [active, select] = useState("");
  const [placing, setPlacing] = useState(false);
  const [decorAction, setDecorAction] = useState<"Add" | "Restyle">("Add");
  const [library, setLibrary] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [objectUrls, setObjectUrls] = useState<Record<string, string>>({});
  const objectRefs = useRef(new Map<string, string>());
  const localInput = useRef<HTMLInputElement>(null);
  const picked = pins.find((p) => p.id === active);
  useEffect(() => {
    let live = true;
    queueMicrotask(() => {
      if (!live) return;
      if (storageKey)
        try {
          const value = JSON.parse(
            sessionStorage.getItem(storageKey) || "null",
          );
          if (
            value?.version === 1 &&
            Array.isArray(value.pins) &&
            value.pins.length <= 12 &&
            value.pins.every(validPin)
          )
            setPins(value.pins);
        } catch {
          /* A corrupt draft is ignored. */
        }
      setReady(true);
    });
    const urls = objectRefs.current;
    return () => {
      live = false;
      for (const url of urls.values()) URL.revokeObjectURL(url);
    };
  }, [storageKey]);
  useEffect(() => {
    if (!storageKey || !ready) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ version: 1, pins }));
    } catch {
      /* Optional recovery. */
    }
  }, [storageKey, ready, pins]);
  useEffect(() => {
    if (!projectId) return;
    const abort = new AbortController();
    fetch("/api/projects/" + encodeURIComponent(projectId) + "/assets", {
      signal: abort.signal,
      cache: "no-store",
    })
      .then(async (res) => {
        if (!res.ok) throw Error();
        return res.json() as Promise<Asset[]>;
      })
      .then((rows) => {
        if (!abort.signal.aborted)
          setAssets(
            rows.filter(
              (a) =>
                a.id !== sourceId && IMAGE_TYPES.some((t) => t === a.mimeType),
            ),
          );
      })
      .catch(() => {
        if (!abort.signal.aborted) setFailed(true);
      });
    return () => abort.abort();
  }, [projectId, sourceId]);
  function add(x: number, y: number) {
    if (!source || pins.length >= 12) return;
    const id = crypto.randomUUID();
    setPins((previous) => [
      ...previous,
      {
        id,
        x,
        y,
        size: "Life-size",
        details: "",
        assetId: "",
        ...(surface ? { surface: "Worktop" } : {}),
        ...(toolId === "decor-redefinition" ? { decorAction } : {}),
      },
    ]);
    select(id);
    setPlacing(false);
    setLibrary(false);
    return id;
  }
  function update(id: string, change: Partial<Pin>) {
    setPins((items) =>
      items.map((p) => (p.id === id ? { ...p, ...change } : p)),
    );
  }
  function forgetObject(id: string) {
    const url = objectRefs.current.get(id);
    if (url) URL.revokeObjectURL(url);
    objectRefs.current.delete(id);
    setObjectUrls((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    update(id, { assetId: "" });
  }
  async function chooseLocal(file?: File) {
    if (!file || !source) return;
    if (
      !IMAGE_TYPES.some((t) => t === file.type) ||
      file.size > MAX_IMAGE_BYTES ||
      !file.size
    ) {
      setNotice(
        pick(
          "Choose a JPEG, PNG or WebP image up to ",
          "Velg et JPEG-, PNG- eller WebP-bilde på inntil ",
        ) +
          MAX_IMAGE_MIB +
          " MiB.",
      );
      return;
    }
    const url = URL.createObjectURL(file);
    const testImage = new window.Image();
    testImage.src = url;
    try {
      await testImage.decode();
    } catch {
      URL.revokeObjectURL(url);
      setNotice(pick("Image could not be opened.", "Bildet kunne ikke åpnes."));
      return;
    }
    if (!localInput.current) {
      URL.revokeObjectURL(url);
      return;
    }
    const id = picked?.id ?? add(50, 50);
    if (!id) {
      URL.revokeObjectURL(url);
      return;
    }
    forgetObject(id);
    objectRefs.current.set(id, url);
    setObjectUrls((previous) => ({ ...previous, [id]: url }));
    setNotice("");
  }
  const objectSrc = (p: Pin) =>
    objectUrls[p.id] ||
    (assets.some((a) => a.id === p.assetId) ? assetUrl(p.assetId) : "");
  return (
    <section className="photo-placement" aria-label={title}>
      <h3>{title}</h3>
      <p>
        {pick(
          "Local placement study. Pins and object photos stay outside the rendering request.",
          "Lokal plasseringsstudie. Markører og objektbilder sendes ikke til rendering.",
        )}
      </p>
      <div className="placement-actions">
        <button
          type="button"
          disabled={!source || pins.length >= 12}
          aria-pressed={placing}
          onClick={() => {
            setDecorAction("Restyle");
            setPlacing(!placing);
          }}
        >
          {surface
            ? pick("Pick a surface", "Velg en flate")
            : pick("Pick a spot", "Velg et punkt")}
        </button>
        {toolId === "decor-redefinition" && (
          <button
            type="button"
            disabled={!source || pins.length >= 12}
            onClick={() => {
              setDecorAction("Add");
              setPlacing(true);
            }}
          >
            {pick("Place new decor", "Plasser ny dekor")}
          </button>
        )}
        <button
          type="button"
          disabled={!source || pins.length >= 12}
          onClick={() => add(50, 50)}
        >
          {pick("Add in centre", "Legg til i midten")}
        </button>
        {!surface && (
          <>
            <button
              type="button"
              disabled={!source}
              onClick={() => localInput.current?.click()}
            >
              {pick("Upload object photo", "Velg objektbilde fra enheten")}
            </button>
            <input
              hidden
              type="file"
              accept={IMAGE_TYPES.join(",")}
              ref={localInput}
              onChange={(e) => {
                void chooseLocal(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={!source || !projectId}
              aria-expanded={library}
              onClick={() => setLibrary(!library)}
            >
              {pick("Choose from project assets", "Velg fra prosjektbilder")}
            </button>
          </>
        )}
      </div>
      {library && (
        <div className="placement-library">
          {!assets.length && (
            <p>
              {failed
                ? pick(
                    "Project images unavailable.",
                    "Prosjektbildene er utilgjengelige.",
                  )
                : pick(
                    "No other saved project images.",
                    "Ingen andre lagrede prosjektbilder.",
                  )}
            </p>
          )}
          {assets.map((asset, index) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => {
                const id = picked?.id ?? add(50, 50);
                if (!id) return;
                forgetObject(id);
                update(id, { assetId: asset.id });
                setLibrary(false);
              }}
            >
              <Image
                src={assetUrl(asset.id)}
                width={72}
                height={56}
                unoptimized
                alt={pick("Project image ", "Prosjektbilde ") + (index + 1)}
              />
            </button>
          ))}
        </div>
      )}
      {source && (
        <div className="placement-stage">
          <Image
            src={source}
            alt={pick(
              "Source photograph for placement",
              "Originalbilde for plassering",
            )}
            unoptimized
            width={1000}
            height={700}
            className="placement-photo"
          />
          {placing && (
            <button
              type="button"
              className="placement-target"
              aria-label={pick(
                "Select location on photograph",
                "Velg posisjon på bildet",
              )}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                if (e.detail === 0) add(50, 50);
                else
                  add(
                    Math.max(
                      0,
                      Math.min(
                        100,
                        ((e.clientX - rect.left) * 100) / rect.width,
                      ),
                    ),
                    Math.max(
                      0,
                      Math.min(
                        100,
                        ((e.clientY - rect.top) * 100) / rect.height,
                      ),
                    ),
                  );
              }}
            />
          )}
          {pins.map((p, i) => (
            <button
              type="button"
              key={p.id}
              className="placement-pin"
              aria-label={pick("Edit position ", "Rediger posisjon ") + (i + 1)}
              aria-pressed={p.id === active}
              style={{ left: p.x + "%", top: p.y + "%" }}
              onClick={() => {
                select(p.id);
                setPlacing(false);
              }}
            >
              {objectSrc(p) && (
                <Image
                  src={objectSrc(p)}
                  alt=""
                  unoptimized
                  width={
                    p.size === "Small" ? 42 : p.size === "Large" ? 100 : 68
                  }
                  height={70}
                />
              )}
              <span>{i + 1}</span>
            </button>
          ))}
        </div>
      )}
      {!source && (
        <p>
          {pick("Choose a source photo first.", "Velg et kildebilde først.")}
        </p>
      )}
      {picked && (
        <fieldset>
          <legend>
            {pick("Position ", "Posisjon ") + (pins.indexOf(picked) + 1)}
          </legend>
          {(["x", "y"] as const).map((axis) => (
            <label key={axis}>
              {axis === "x"
                ? pick("Horizontal position", "Vannrett posisjon")
                : pick("Vertical position", "Loddrett posisjon")}{" "}
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(picked[axis])}
                onChange={(e) =>
                  update(picked.id, { [axis]: e.target.valueAsNumber })
                }
              />
            </label>
          ))}
          {surface && (
            <>
              <fieldset>
                <legend>{pick("Surface", "Overflate")}</legend>
                {Object.keys(materialOptions).map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      name={"surface-" + picked.id}
                      checked={(picked.surface ?? "Worktop") === type}
                      onChange={() =>
                        update(picked.id, { surface: type, finish: undefined })
                      }
                    />
                    {english ? type : materialNb[type]}
                  </label>
                ))}
              </fieldset>
              <fieldset>
                <legend>{pick("Material", "Materiale")}</legend>
                {materialOptions[picked.surface ?? "Worktop"].map((finish) => (
                  <label key={finish}>
                    <input
                      type="radio"
                      name={"finish-" + picked.id}
                      checked={picked.finish === finish}
                      onChange={() => update(picked.id, { finish })}
                    />
                    {english ? finish : (materialNb[finish] ?? finish)}
                  </label>
                ))}
              </fieldset>
            </>
          )}
          {toolId === "decor-redefinition" && (
            <fieldset>
              <legend>{pick("Spot action", "Endring på punktet")}</legend>
              {(["Add", "Restyle", "Clear"] as const).map((action, i) => (
                <label key={action}>
                  <input
                    type="radio"
                    name={"decor-" + picked.id}
                    checked={(picked.decorAction ?? "Add") === action}
                    onChange={() => update(picked.id, { decorAction: action })}
                  />
                  {english ? action : ["Legg til", "Endre stil", "Rydd"][i]}
                </label>
              ))}
            </fieldset>
          )}
          {toolId === "object-placement" && (
            <fieldset>
              <legend>{pick("Size", "Størrelse")}</legend>
              {sizes.map((size, i) => (
                <label key={size}>
                  <input
                    type="radio"
                    name={"pin-size-" + picked.id}
                    checked={picked.size === size}
                    onChange={() => update(picked.id, { size })}
                  />
                  {english ? size : ["Liten", "Naturlig størrelse", "Stor"][i]}
                </label>
              ))}
            </fieldset>
          )}
          <label>
            {pick("Details", "Detaljer")}
            <input
              value={picked.details}
              maxLength={400}
              onChange={(e) => update(picked.id, { details: e.target.value })}
            />
          </label>
          <div className="placement-actions">
            {!surface && (
              <button
                type="button"
                disabled={!objectSrc(picked) && !picked.assetId}
                onClick={() => forgetObject(picked.id)}
              >
                {pick("Forget object photo", "Fjern objektbildet")}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                forgetObject(picked.id);
                setPins((items) => items.filter((p) => p.id !== picked.id));
                select("");
              }}
            >
              {pick("Remove position", "Fjern posisjon")}
            </button>
            <button
              type="button"
              onClick={() => {
                select("");
                setLibrary(false);
              }}
            >
              {pick("Done", "Ferdig")}
            </button>
          </div>
        </fieldset>
      )}
      {pins.length > 0 && (
        <button
          type="button"
          onClick={() => {
            for (const p of pins) forgetObject(p.id);
            setPins([]);
            select("");
            setPlacing(false);
          }}
        >
          {pick("Clear positions", "Tøm posisjoner")}
        </button>
      )}
      <p role="status">{notice}</p>
    </section>
  );
}
