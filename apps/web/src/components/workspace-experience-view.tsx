"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { publicHref, type Locale } from "@/lib/i18n";
import { knowledgeSearch, knowledgeTopics, quickTipTopic, readKnowledgeState, type KnowledgeState } from "@/lib/knowledge-state";
import { marketingResources } from "@/lib/marketing-resources";
import type { StudyCard } from "@/lib/visual-studies";
import { StudyPagination, studyPageSize } from "./study-pagination";
import { TopicChoices } from "./topic-choices";
import "./visual-study.css";
import type { ExperienceRoute } from "./workspace-experience";
import {
  guides,
  finishes,
  rooms,
  type Bilingual,
} from "./workspace-experience-data";
import "./workspace-experience.css";

type Translate = (nb: string, en: string) => string;
type ViewProps = { t: Translate };
const seasons = [
  ["Vår", "Spring"],
  ["Sommer", "Summer"],
  ["Vinter", "Winter"],
] as const;

function ReferencePhoto({
  image,
  priority = false,
}: {
  image: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/reference/${image}.webp`}
      alt=""
      fill
      unoptimized
      loading={priority ? "eager" : "lazy"}
      sizes="(max-width: 760px) 100vw, 60vw"
      className="xp-photo"
    />
  );
}

function Heading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <header className="xp-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </header>
  );
}

function RoomTour({ t }: ViewProps) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [season, setSeason] = useState(0);
  const [night, setNight] = useState(false);
  const [finish, setFinish] = useState(0);
  const [inspect, setInspect] = useState(false);
  const room = rooms[roomIndex];
  const material = finishes[finish];
  const chooseRoom = (index: number) => {
    setRoomIndex(index);
    setInspect(false);
  };
  return (
    <>
      <Heading
        title={t("Boligopplevelse", "Home Experience")}
        description={t(
          "Følg fire stopp i en illustrert romstudie. Utforsk lys og materialpaletter med referansebilder.",
          "Follow four stops in an illustrated room study. Explore light and material palettes using reference photographs.",
        )}
      />
      <div className="xp-room-layout">
        <figure
          className={`xp-room xp-season-${season}${night ? " xp-evening" : ""}`}
        >
          <ReferencePhoto image={room.image} priority />
          <button
            className="xp-glass xp-time"
            type="button"
            aria-pressed={night}
            onClick={() => setNight(!night)}
          >
            {t("Kveldslys", "Evening light")}
          </button>
          <button
            className="xp-hotspot"
            type="button"
            aria-label={t("Se materialdetaljer", "Inspect material")}
            aria-controls="xp-material-note"
            aria-expanded={inspect}
            onClick={() => setInspect(!inspect)}
          >
            +
          </button>
          <div id="xp-material-note" hidden={!inspect} className="xp-note">
            <strong>{t(material.name[0], material.name[1])}</strong>
            <p>{t(material.note[0], material.note[1])}</p>
          </div>
          <figcaption className="xp-room-caption" aria-live="polite">
            <small>
              {t("Romstudie", "Room study")} {roomIndex + 1} / {rooms.length}
            </small>
            <h2>{t(room.name[0], room.name[1])}</h2>
            <p>{t(room.note[0], room.note[1])}</p>
            <button
              type="button"
              className="xp-glass"
              onClick={() => chooseRoom((roomIndex + 1) % rooms.length)}
            >
              {roomIndex === rooms.length - 1
                ? t("Til første rom", "Back to first room")
                : t("Neste rom", "Next room")}{" "}
              <span aria-hidden="true">→</span>
            </button>
          </figcaption>
        </figure>
        <aside className="xp-panel xp-plan-panel">
          <h2>{t("Romoversikt", "Room overview")}</h2>
          <div
            className="xp-plan"
            role="group"
            aria-label={t("Illustrert plantegning", "Illustrative floor plan")}
          >
            {rooms.map((r, i) => (
              <button
                type="button"
                key={r.image}
                aria-pressed={roomIndex === i}
                onClick={() => chooseRoom(i)}
              >
                {t(r.name[0], r.name[1])}
              </button>
            ))}
          </div>
          <p className="xp-small">
            {t(
              "Skjematisk plantegning uten mål.",
              "Schematic floor plan without measurements.",
            )}
          </p>
          <fieldset>
            <legend>{t("Årstid", "Season")}</legend>
            <div className="xp-pills">
              {seasons.map((s, i) => (
                <button
                  key={s[1]}
                  aria-pressed={season === i}
                  onClick={() => setSeason(i)}
                >
                  {t(s[0], s[1])}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t("Materialpalett", "Material palette")}</legend>
            <div className="xp-swatches">
              {finishes.map((f, i) => (
                <button
                  key={f.colour}
                  title={t(f.name[0], f.name[1])}
                  aria-label={t(f.name[0], f.name[1])}
                  aria-pressed={finish === i}
                  style={{ backgroundColor: f.colour }}
                  onClick={() => setFinish(i)}
                />
              ))}
            </div>
            <p>{t(material.name[0], material.name[1])}</p>
          </fieldset>
        </aside>
      </div>
    </>
  );
}

function Knowledge({ t, locale, studyCards }: ViewProps & { locale: Locale; studyCards: StudyCard[] }) {
  const [topic, setTopic] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const tags = knowledgeTopics;
  const topicLabels = marketingResources(locale).categories.map((name, index) => ({id: tags[index], name}));
  useEffect(() => {
    const restore = () => {
      const state = readKnowledgeState(window.location.search);
      setTopic(state.topic < 0 ? "all" : tags[state.topic]);
      setSearch(state.query); setPage(state.page);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [tags]);
  function update(state: KnowledgeState) {
    setTopic(state.topic < 0 ? "all" : tags[state.topic]);
    setSearch(state.query); setPage(state.page);
    window.history.replaceState(window.history.state, "", window.location.pathname + knowledgeSearch(state) + window.location.hash);
  }
  const studyMatches = studyCards.filter(card =>
    (topic === "all" || card.tags.some(tag => tags[tag] === topic)) &&
    [card.name,card.intro,...card.tags.map(tag => topicLabels.find(item => item.id === tags[tag])?.name ?? "")].join(" ").toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  );
  const matches = guides.filter(
    (g) =>
      (topic === "all" || topic === quickTipTopic(g.id)) &&
      [
        t(g.topic[0], g.topic[1]),
        t(g.title[0], g.title[1]),
        t(g.body[0], g.body[1]),
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()),
  );
  const total = matches.length + studyMatches.length;
  const visiblePage = Math.min(page, Math.max(0, Math.ceil(total / studyPageSize) - 1));
  const start = visiblePage * studyPageSize;
  const guidePage = matches.slice(start, start + studyPageSize);
  const studyPage = studyMatches.slice(Math.max(0, start - matches.length), Math.max(0, start + studyPageSize - matches.length));
  return (
    <>
      <Heading
        title={t("Kunnskapsbibliotek", "Knowledge library")}
        description={t(
          "Utforsk guider og 500 illustrerte designstudier om materialer, dagslys og rommet rundt deg.",
          "Explore guides and 500 illustrated design studies on materials, daylight and the spaces around you.",
        )}
      >
      </Heading>
      <div className="xp-filters">
        <label>
          {t("Søk i guidene", "Search guides")}
          <input
            type="search"
            value={search}
            onChange={(e) => update({ query: e.target.value, topic: tags.indexOf(topic as typeof tags[number]), page: 0 })}
          />
        </label>
        <TopicChoices
          label={t("Tema", "Topic")}
          options={[{ id: "all", name: t("Alle temaer", "All topics") }, ...topicLabels]}
          value={topic}
          onChange={(id) => update({ query: search, topic: tags.indexOf(id as typeof tags[number]), page: 0 })}
        />
      </div>
      <div className="xp-grid">
        {guidePage.map((g) => (
          <details key={g.id} className="xp-guide">
            <summary>
              <span className="xp-thumb">
                <ReferencePhoto image={g.image} />
              </span>
              <span className="xp-guide-label">
                {t("Hurtigtips", "Quick tip")} · {t(g.topic[0], g.topic[1])}
              </span>
              <span className="xp-guide-title">
                {t(g.title[0], g.title[1])}
              </span>
              <span className="xp-guide-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{t(g.body[0], g.body[1])}</p>
          </details>
        ))}
        {studyPage.map(card => <Link className="xp-guide xp-study-card" href={publicHref("/resources/"+card.id, locale) + (knowledgeSearch({ query: search, topic: tags.indexOf(topic as typeof tags[number]), page: visiblePage }) || "?") + (search || topic !== "all" || visiblePage ? "&" : "") + "from=studio"} key={card.id}>
          <span className="xp-thumb"><ReferencePhoto image={card.image}/></span>
          <span className="xp-guide-label">{t("Bildestudie", "Visual study")} · {topicLabels.find(item => item.id === tags[card.tags[0]])?.name}</span>
          <span className="xp-guide-title">{card.name}</span>
          <p>{card.intro}</p>
        </Link>)}
      </div>
      <StudyPagination page={visiblePage} count={total} locale={locale} move={(next) => update({ query: search, topic: tags.indexOf(topic as typeof tags[number]), page: next })}/>
      {!total && (
        <div className="xp-panel" role="status">
          <h2>{t("Ingen treff", "No matching guides")}</h2>
          <button
            type="button"
            className="button"
            onClick={() => {
              update({topic: -1, query: "", page: 0});
            }}
          >
            {t("Vis alle guider", "Show all guides")}
          </button>
        </div>
      )}
    </>
  );
}

const scenarios = [
  { name: ["Enkel oppfriskning", "Essential refresh"], amount: 95000 },
  { name: ["Balansert oppussing", "Balanced redesign"], amount: 185000 },
  { name: ["Omfattende oppussing", "Premium concept"], amount: 310000 },
] as const;
const categories: { name: Bilingual; base: number }[] = [
  { name: ["Materialer", "Materials"], base: 65000 },
  { name: ["Arbeid", "Labour"], base: 78000 },
  { name: ["Møbler", "Furnishings"], base: 23000 },
  { name: ["Reserve", "Contingency"], base: 19000 },
];

function Budget({ t, locale }: ViewProps & { locale: Locale }) {
  const [scenario, setScenario] = useState(1);
  const selected = scenarios[scenario];
  const money = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  });
  const allocated = categories
    .slice(0, -1)
    .map((category) => Math.round((selected.amount * category.base) / 185000));
  const reserve =
    selected.amount - allocated.reduce((sum, amount) => sum + amount, 0);
  const amounts = [...allocated, reserve];
  return (
    <>
      <Heading
        title={t("Budsjettscenarier", "Budget scenarios")}
        description={t(
          "Sammenlign tre fiktive oppussingsrammer i norske kroner. Innhent egne mål og tilbud før du planlegger et kjøp.",
          "Compare three fictional renovation allowances in Norwegian kroner. Obtain measurements and local quotations before planning a purchase.",
        )}
      />
      <div className="xp-scenarios">
        {scenarios.map((s, i) => (
          <button
            key={s.amount}
            type="button"
            aria-pressed={i === scenario}
            onClick={() => setScenario(i)}
          >
            <span>{t(s.name[0], s.name[1])}</span>
            <strong>{money.format(s.amount)}</strong>
          </button>
        ))}
      </div>
      <section className="xp-panel xp-budget">
        <h2>{t("Fordeling i eksemplet", "Example breakdown")}</h2>
        <p>
          {t(
            "Alle tre scenarioene bruker samme prosentvise fordeling.",
            "All three scenarios use the same percentage split.",
          )}
        </p>
        {categories.map((c, i) => (
          <div className="xp-category" key={c.base}>
            <div>
              <span>{t(c.name[0], c.name[1])}</span>
              <strong>{money.format(amounts[i])}</strong>
            </div>
            <meter
              min={0}
              max={185000}
              value={c.base}
              aria-label={t(c.name[0], c.name[1])}
            />
          </div>
        ))}
        <Link className="xp-text-link" href="/app/knowledge">
          {t(
            "Les budsjettguiden i biblioteket",
            "Find the budget guide in the library",
          )}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}

function AccountPreview({ t, wallet }: ViewProps & { wallet: boolean }) {
  const [filter, setFilter] = useState(0);
  const filters = [
    ["Alle", "All"],
    ["Tildelt", "Granted"],
    ["Brukt", "Used"],
  ] as const;
  return (
    <>
      <Heading
        title={
          wallet
            ? t("Kredittoversikt", "Credit wallet")
            : t("Fakturering", "Billing")
        }
        description={t(
          "Betaling og kredittbruk er slått av i demonstrasjonen.",
          "Payments and credit usage are disabled in this demonstration.",
        )}
      />
      <div className="xp-account">
        <section className="xp-account-card">
          <span>
            {wallet
              ? t("Tilgjengelig saldo", "Available balance")
              : t("Abonnement", "Subscription")}
          </span>
          <h2>{t("Utilgjengelig", "Unavailable")}</h2>
          <p>
            {wallet
              ? t(
                  "Her vil du kunne følge tildeling og bruk av kreditter.",
                  "Credit grants and usage will appear here.",
                )
              : t(
                  "Abonnement og fakturaer vises her når fakturering er tilgjengelig.",
                  "Subscriptions and invoices will appear here when billing is available.",
                )}
          </p>
          <Link href={wallet ? "/app/billing" : "/app/credits"}>
            {wallet
              ? t("Se fakturering", "Billing overview")
              : t("Se kredittoversikt", "View wallet")}{" "}
            <span aria-hidden="true">→</span>
          </Link>
        </section>
        <section className="xp-panel">
          <h2>
            {wallet
              ? t("Kredittaktivitet", "Credit activity")
              : t("Fakturaer", "Invoices")}
          </h2>
          {wallet && (
            <div
              className="xp-pills"
              role="group"
              aria-label={t("Aktivitetstype", "Activity type")}
            >
              {filters.map((f, i) => (
                <button
                  key={f[1]}
                  type="button"
                  onClick={() => setFilter(i)}
                  aria-pressed={i === filter}
                >
                  {t(f[0], f[1])}
                </button>
              ))}
            </div>
          )}
          <p className="xp-empty">
            {wallet
              ? [
                  t(
                    "Ingen transaksjoner å vise.",
                    "No transactions to display.",
                  ),
                  t("Ingen tildelinger å vise.", "No grants to display."),
                  t("Ingen belastninger å vise.", "No debits to display."),
                ][filter]
              : t("Ingen fakturaer å vise.", "No invoices to display.")}
          </p>
        </section>
      </div>
    </>
  );
}

export function ExperienceView({
  section,
  locale,
  studyCards = [],
}: {
  section: ExperienceRoute;
  locale: Locale;
  studyCards?: StudyCard[];
}) {
  const t: Translate = (nb, en) => (locale === "en" ? en : nb);
  let body: ReactNode;
  switch (section) {
    case "home-experience":
      body = <RoomTour t={t} />;
      break;
    case "knowledge":
      body = <Knowledge t={t} locale={locale} studyCards={studyCards} />;
      break;
    case "budget":
      body = <Budget t={t} locale={locale} />;
      break;
    case "billing":
    case "credits":
      body = <AccountPreview t={t} wallet={section === "credits"} />;
      break;
  }
  return <div className="xp-workspace">{body}</div>;
}
