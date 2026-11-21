import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { studies, scenes, translated } from "@/lib/workspace-catalog";
import { StudyCards } from "./workspace-gallery";
import { WorkspaceIcon } from "./workspace";

type Study = (typeof studies)[number];
export function Dashboard({
  locale,
  authenticated,
  recentProjects,
}: {
  locale: Locale;
  authenticated: boolean;
  recentProjects: { id: string; name: string }[];
}) {
  const en = locale === "en";
  return (
    <section className="vn-dashboard">
      <header className="vn-pagehead">
        <p className="eyebrow">
          {en ? "Your personal atelier" : "Ditt personlige atelier"}
        </p>
        <h1>{en ? "Good spaces start here." : "Gode rom begynner her."}</h1>
      </header>
      <div className="vn-atelier-hero">
        <div>
          <h2>{en ? "From a room to a direction." : "Fra rom til retning."}</h2>
          <p>
            {en
              ? "Explore materials, light and layout in the Studio."
              : "Utforsk materialer, lys og planløsning i Studio."}
          </p>
          <Link className="vn-hero-link" href="/app/tools/room-reimagination">
            {en ? "Open room editor" : "Åpne romredigering"} ↗
          </Link>
        </div>
      </div>
      <div className="vn-shortcuts">
        {(
          [
            [
              "folder",
              "/app/projects",
              en ? "Projects" : "Prosjekter",
              authenticated
                ? en
                  ? "Open your workspace"
                  : "Åpne arbeidsområdet ditt"
                : en
                  ? "Explore project studies"
                  : "Utforsk eksempelprosjektene",
            ],
            [
              "tools",
              "/app/library",
              en ? "Tool library" : "Verktøybibliotek",
              en ? "Explore all 17 editors" : "Utforsk alle 17 verktøy",
            ],
            [
              "image",
              "/app/renders",
              en ? "Render gallery" : "Bildegalleri",
              en ? "Browse the reference collection" : "Se referansesamlingen",
            ],
          ] as const
        ).map(([icon, path, name, info]) => (
          <Link href={path} key={path}>
            <WorkspaceIcon name={icon} />
            <span>
              <strong>{name}</strong>
              <small>{info}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      {authenticated && (
        <section>
          <div className="vn-section-title">
            <h2>{en ? "Your recent projects" : "Dine siste prosjekter"}</h2>
            <Link href="/app/projects">
              {en ? "All projects" : "Alle prosjekter"} ↗
            </Link>
          </div>
          {recentProjects.length ? (
            <div className="vn-search-results">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={"/app/projects/" + encodeURIComponent(p.id)}
                >
                  {p.name}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
          ) : (
            <Link href="/app/projects">
              {en
                ? "Create your first project"
                : "Opprett ditt første prosjekt"}{" "}
              ↗
            </Link>
          )}
        </section>
      )}
      <div className="vn-section-title">
        <h2>{en ? "Project studies" : "Eksempelprosjekter"}</h2>
        <Link href="/app/albums">{en ? "View albums" : "Vis album"} ↗</Link>
      </div>
      <StudyCards locale={locale} />
      <div className="vn-section-title">
        <h2>{en ? "Explore the atelier" : "Utforsk atelieret"}</h2>
      </div>
      <div className="vn-discover">
        <Link href="/app/home-experience">
          <WorkspaceIcon name="home" />
          <h3>{en ? "Home Experience" : "Boligopplevelse"}</h3>
          <p>
            {en
              ? "Discover how a room changes with light and material."
              : "Se hvordan lys og materialer endrer rommet."}
          </p>
          <span>↗</span>
        </Link>
        <Link href="/app/knowledge">
          <WorkspaceIcon name="book" />
          <h3>{en ? "Knowledge hub" : "Kunnskapsbase"}</h3>
          <p>
            {en
              ? "Read about room flow, materials and Nordic living."
              : "Les om romflyt, materialer og nordisk hverdagsliv."}
          </p>
          <span>↗</span>
        </Link>
        <Link href="/app/prana">
          <WorkspaceIcon name="spark" />
          <h3>Prana</h3>
          <p>
            {en
              ? "Find a practical design tip for your next study."
              : "Finn et praktisk designtips til din neste studie."}
          </p>
          <span>↗</span>
        </Link>
      </div>
    </section>
  );
}

export function StudyDetail({
  locale,
  study,
}: {
  locale: Locale;
  study: Study;
}) {
  const en = locale === "en";
  const images = scenes.filter((s) => s.study === study.id);
  return (
    <section>
      <header className="vn-pagehead">
        <p className="eyebrow">
          {en ? "Example project" : "Eksempelprosjekt"} / {study.location}
        </p>
        <h1>{translated(study.name, locale)}</h1>
      </header>
      <div className="vn-study-cover">
        <Image
          fill
          src={"/reference/" + study.image}
          alt={translated(study.name, locale)}
          sizes="(max-width:800px) 100vw, 78vw"
        />
      </div>
      <div className="vn-section-title">
        <h2>{en ? "Project album" : "Prosjektalbum"}</h2>
        <Link href={"/app/renders?album=" + study.id}>
          {en ? "Open album" : "Åpne album"} ↗
        </Link>
      </div>
      <p>
        {en
          ? "Reference images for this concept study"
          : "Referansebilder til denne konseptstudien"}{" "}
        · {study.rooms} {en ? "rooms" : "rom"}
      </p>
      <div className="vn-study-grid">
        {images.map((s) => (
          <Link
            className="vn-study"
            key={s.image}
            href={"/app/renders?album=" + study.id}
          >
            <div className="vn-photo">
              <Image
                fill
                src={"/reference/" + s.image}
                sizes="(max-width:640px) 92vw, 32vw"
                alt=""
              />
            </div>
            <div className="vn-study-text">
              <h3>{translated(s.title, locale)}</h3>
            </div>
          </Link>
        ))}
      </div>
      <div className="vn-related">
        <Link href="/app/projects">
          {en ? "All projects" : "Alle prosjekter"}
        </Link>
        <Link href="/app/tools/room-reimagination">
          {en ? "Open room editor" : "Åpne romredigering"} ↗
        </Link>
      </div>
    </section>
  );
}

export function CollaborationScreen({
  locale,
  team,
}: {
  locale: Locale;
  team: boolean;
}) {
  const en = locale === "en";
  return (
    <section>
      <header className="vn-pagehead">
        <p className="eyebrow">Studio</p>
        <h1>{team ? "Team" : en ? "Shared with me" : "Delt med meg"}</h1>
        <p>
          {en
            ? "Personal projects and their images are private."
            : "Personlige prosjekter og tilhørende bilder er private."}
        </p>
      </header>
      <div className="vn-empty">
        <WorkspaceIcon name="users" />
        <h2>
          {team
            ? en
              ? "Personal workspace"
              : "Personlig arbeidsområde"
            : en
              ? "No shared collection"
              : "Ingen delt samling"}
        </h2>
        <p>
          {en
            ? "Invitations and shared workspaces are unavailable in this version."
            : "Invitasjoner og delte arbeidsområder er utilgjengelige i denne versjonen."}
        </p>
        <Link className="button" href="/app/projects">
          {en ? "Browse projects" : "Se prosjekter"}
        </Link>
      </div>
    </section>
  );
}

export function SettingsLinks({ locale }: { locale: Locale }) {
  const en = locale === "en";
  return (
    <div className="vn-settings">
      <h2>{en ? "Workspace preferences" : "Valg for arbeidsområdet"}</h2>
      <div className="vn-related">
        <a href="#language">{en ? "Language" : "Språk"}</a>
        <a href="#theme">{en ? "Appearance" : "Utseende"}</a>
        <Link href="/app/credits">{en ? "Credit wallet" : "Kreditter"}</Link>
        <Link href="/app/billing">{en ? "Billing" : "Fakturering"}</Link>
      </div>
    </div>
  );
}
