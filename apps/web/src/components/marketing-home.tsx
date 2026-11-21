"use client";
import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { Action, Closing, FAQ, Photo, Section } from "./marketing-elements";
import { HomePhotoHero } from "./home-photo-hero";

const directions = [
  [
    "Gi rommet ny form",
    "Reimagine a space",
    "Utforsk møblering, stil og stemning.",
    "Explore layout, style and atmosphere.",
    "room-reimagination",
    "Room Reimagination",
    "⌂",
  ],
  [
    "Forvandle uterommet",
    "Transform outdoors",
    "Prøv en retning for hage og landskap.",
    "Find a direction for gardens and landscapes.",
    "garden-design",
    "Garden Design",
    "☼",
  ],
  [
    "Finjuster detaljene",
    "Refine the details",
    "Se materialer og overflater i sammenheng.",
    "Consider materials and finishes together.",
    "material-refinement",
    "Material Refinement",
    "◈",
  ],
  [
    "Forbedre et bilde",
    "Perfect an image",
    "Utforsk utsnitt, perspektiv og renere linjer.",
    "Explore framing, perspective and cleaner lines.",
    "perspective-correction",
    "Perspective Correction",
    "⌗",
  ],
] as const;
const steps = [
  [
    "Velg",
    "Choose",
    "Begynn med et rom og en idé.",
    "Start with a space and an idea.",
    "cover",
  ],
  [
    "Skap",
    "Create",
    "Velg verktøy, stil og detaljer i Studio.",
    "Choose your tool, style and details in the Studio.",
    "soft-day",
  ],
  [
    "Utforsk",
    "Explore",
    "Se varianter ved siden av hverandre.",
    "View alternatives alongside each other.",
    "soft-moss",
  ],
  [
    "Bestem",
    "Decide",
    "Ta med den retningen du liker videre.",
    "Carry your preferred direction into the next decision.",
    "warm",
  ],
] as const;

function StudyCompare({ en }: { en: boolean }) {
  const [variant, setVariant] = useState(0);
  const [split, setSplit] = useState(48);
  const names = en
    ? ["Daylight", "Evening", "Moss"]
    : ["Dagslys", "Kveld", "Mose"];
  return (
    <div>
      <div className="mk-compare">
        <Photo name="soft" />
        <div
          className="mk-compare-layer"
          style={{ clipPath: "inset(0 0 0 " + split + "%)" }}
        >
          <Photo name={["soft-bright", "soft-evening", "soft-moss"][variant]} />
        </div>
        <span className="mk-image-tag left">
          {en ? "Original" : "Original"}
        </span>
        <span className="mk-image-tag right">{names[variant]}</span>
        <span className="mk-divider" style={{ left: split + "%" }}>
          <b>↔</b>
        </span>
        <input
          aria-label={en ? "Compare image studies" : "Sammenlign bildestudier"}
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
        />
      </div>
      <div className="mk-variants">
        {names.map((name, i) => (
          <button
            key={name}
            aria-pressed={variant === i}
            onClick={() => setVariant(i)}
          >
            <Photo name={["soft-bright", "soft-evening", "soft-moss"][i]} />
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MarketingHome({
  locale,
  uploadsEnabled,
}: {
  locale: Locale;
  uploadsEnabled: boolean;
}) {
  const en = locale === "en";
  const t = (nb: string, english: string) => (en ? english : nb);
  const [direction, setDirection] = useState(0);
  const [step, setStep] = useState(0);
  const item = directions[direction];
  return (
    <>
      <HomePhotoHero locale={locale} uploadsEnabled={uploadsEnabled} />
      <section className="home-start" aria-labelledby="home-goal">
        <div className="mk-start">
          <h2 id="home-goal">{t("Hva vil du forvandle?", "What do you want to transform?")}</h2>
            <div className="mk-quick">
              {directions.map((d, i) => (
                <a
                  key={d[4]}
                  href="#directions"
                  onClick={() => setDirection(i)}
                >
                  <b aria-hidden="true">{d[6]}</b>
                  {d[en ? 1 : 0]}
                </a>
              ))}
            </div>
        </div>
      </section>
      <Section>
        <div className="mk-split">
          <div>
            <p className="mk-label">
              01 / {t("Muligheten", "The possibility")}
            </p>
            <h2>
              {t(
                "Det vanskeligste er å se hva som er mulig.",
                "The hardest part isn’t creating. It’s seeing what’s possible.",
              )}
            </h2>
            <p>
              {t(
                "Ett rom kan romme mange ideer. Se hvordan en liten endring i lys eller fargetone oppleves, før du velger retning.",
                "One room can hold many ideas. See how a small shift in light or colour feels before choosing a direction.",
              )}
            </p>
          </div>
          <div className="mk-mosaic">
            <Photo name="soft" />
            <div>
              {["soft-day", "soft-evening", "soft-bright", "soft-moss"].map(
                (n) => (
                  <Photo key={n} name={n} />
                ),
              )}
            </div>
          </div>
        </div>
      </Section>
      <Section tone="sand" id="directions">
        <p className="mk-label">
          02 / {t("Velg retning", "Choose a direction")}
        </p>
        <h2>{t("Hva vil du forvandle?", "What do you want to transform?")}</h2>
        <div className="mk-split">
          <div className="mk-options">
            {directions.map((d, i) => (
              <button
                key={d[4]}
                onClick={() => setDirection(i)}
                aria-pressed={direction === i}
              >
                <span className="mk-glyph">{d[6]}</span>
                <span>
                  <strong>{d[en ? 1 : 0]}</strong>
                  <small>{d[en ? 3 : 2]}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div
            className={"mk-direction" + (direction === 1 ? " mk-outdoor" : "")}
          >
            {direction !== 1 && (
              <Photo
                name={["cover", "soft-moss", "warm", "soft-bright"][direction]}
              />
            )}
            <div>
              <p className="mk-label">Studio</p>
              <h3>{item[5]}</h3>
              <Action href={"/app/tools/" + item[4]}>
                {t("Utforsk verktøyet", "Explore this tool")}
              </Action>
            </div>
          </div>
        </div>
      </Section>
      <Section id="examples">
        <p className="mk-label">03 / {t("Bildestudier", "Image studies")}</p>
        <h2>{t("Se hva du kan skape.", "See what you can create.")}</h2>
        <p>
          {t(
            "Dra skillet og bytt fargestudie for å sammenligne tre uttrykk fra samme interiørfoto.",
            "Drag the divider and switch colour studies to compare three treatments of the same interior photograph.",
          )}
        </p>
        <StudyCompare en={en} />
      </Section>
      <Section tone="dark" id="workflow">
        <p className="mk-label">
          04 / {t("Slik fungerer det", "How it works")}
        </p>
        <h2>
          {t(
            "Fra idé til uttrykk i fire steg.",
            "From idea to visual in four steps.",
          )}
        </h2>
        <div className="mk-split">
          <div className="mk-steps">
            {steps.map((s, i) => (
              <button
                key={s[0]}
                onClick={() => setStep(i)}
                aria-pressed={step === i}
              >
                <span>0{i + 1}</span>
                <div>
                  <strong>{s[en ? 1 : 0]}</strong>
                  {step === i && <p>{s[en ? 3 : 2]}</p>}
                </div>
              </button>
            ))}
          </div>
          <Photo className="mk-step-image" name={steps[step][4]} />
        </div>
      </Section>
      <Section tone="sand">
        <p className="mk-label">05 / {t("Hvem det er for", "Who it’s for")}</p>
        <h2>
          {t(
            "For deg som vil se ideen før du går videre.",
            "Built for people who need to see an idea before moving forward.",
          )}
        </h2>
        <div className="mk-audiences">
          {[
            [t("Boligeiere", "Homeowners"), "cover"],
            [t("Eiendomsfolk", "Property professionals"), "soft-day"],
            [t("Designere og arkitekter", "Designers & architects"), "warm"],
          ].map(([name, photo]) => (
            <Link key={name} href="/app/library">
              <Photo name={photo} />
              <strong>{name}</strong>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </Section>
      <FAQ
        title={t("Før du begynner.", "Before you start.")}
        items={[
          [
            t("Trenger jeg designerfaring?", "Do I need design experience?"),
            t(
              "Du kan utforske verktøy og studier uten forkunnskaper.",
              "Explore the tools and studies without prior design training.",
            ),
          ],
          [
            t("Hva kan jeg utforske?", "What can I explore?"),
            t(
              "Åpne Studio for rom, uterom, materialer og bildeforbedring.",
              "Open the Studio to explore interiors, outdoors, materials and image refinement.",
            ),
          ],
          [
            t(
              "Kan jeg bruke en studie som byggetegning?",
              "Can I build directly from a study?",
            ),
            t(
              "Studiene viser visuelle idéer. Mål, materialvalg og løsninger må kontrolleres faglig før utførelse.",
              "Studies illustrate a visual idea. Dimensions, materials and construction decisions require professional verification.",
            ),
          ],
        ]}
      />
      <Closing
        locale={locale}
        title={t(
          "Begynn med en idé. Se hvor den tar deg.",
          "Start with an idea. See where it takes you.",
        )}
      />
    </>
  );
}
