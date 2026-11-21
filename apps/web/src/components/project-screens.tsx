"use client";
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";

type Project = {
  id: string;
  name: string;
  description: string | null;
  archivedAt: string | null;
};
export function ProjectsScreen({
  locale,
  projectId,
  enabled,
}: {
  locale: Locale;
  projectId?: string;
  enabled: boolean;
}) {
  const en = locale === "en",
    router = useRouter();
  const [rows, setRows] = useState<Project[]>([]);
  const [archived, setArchived] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  async function load() {
    if (!enabled) return;
    const response = await fetch(
      projectId
        ? `/api/projects/${encodeURIComponent(projectId)}`
        : `/api/projects?archived=${archived}`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      setMessage(
        en ? "Projects are unavailable." : "Prosjektene er ikke tilgjengelige.",
      );
      return;
    }
    if (projectId) setSelected(await response.json());
    else setRows(await response.json());
  }
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const path = projectId
      ? `/api/projects/${encodeURIComponent(projectId)}`
      : `/api/projects?archived=${archived}`;
    void fetch(path, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (projectId) setSelected(data);
        else setRows(data);
      })
      .catch(() => {
        if (!cancelled)
          setMessage(
            en
              ? "Projects are unavailable."
              : "Prosjektene er ikke tilgjengelige.",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [projectId, archived, enabled, en]);
  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setMessage("");
    const form = event.currentTarget;
    const name = String(new FormData(form).get("name") || "");
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({ name }),
    });
    if (response.ok) {
      form.reset();
      await load();
    } else
      setMessage(
        en
          ? "Project could not be created."
          : "Prosjektet kunne ikke opprettes.",
      );
    setPending(false);
  }
  async function change(
    action: "archive" | "restore" | "delete" | "update",
    values: Record<string, string> = {},
  ) {
    if (!selected || pending) return;
    if (action === "delete" && values.confirmation !== selected.name) {
      setMessage(
        en
          ? "Type the project name to confirm."
          : "Skriv prosjektnavnet for å bekrefte.",
      );
      return;
    }
    setPending(true);
    setMessage("");
    const response = await fetch(
      `/api/projects/${encodeURIComponent(selected.id)}`,
      {
        method: action === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "update"
            ? values
            : action === "delete"
              ? values
              : { action },
        ),
      },
    );
    if (response.ok) {
      if (action === "delete") router.push("/app/projects");
      else setSelected(await response.json());
      router.refresh();
    } else
      setMessage(en ? "Change was not saved." : "Endringen ble ikke lagret.");
    setPending(false);
  }
  return (
    <>
      <p className="eyebrow">VASTU NORD STUDIO</p>
      <h1>{en ? "Projects" : "Prosjekter"}</h1>
      {!enabled ? (
        <section className="empty-section">
          <p>
            {en
              ? "Private projects are not connected yet. No data is stored."
              : "Private prosjekter er ikke koblet til ennå. Ingen data lagres."}
          </p>
        </section>
      ) : projectId ? (
        <section className="empty-section">
          <Link href="/app/projects">
            ← {en ? "All projects" : "Alle prosjekter"}
          </Link>
          {selected && (
            <>
              <h2>{selected.name}</h2>
              <p>{selected.description}</p>
              <p>
                {selected.archivedAt
                  ? en
                    ? "Archived"
                    : "Arkivert"
                  : en
                    ? "Private project"
                    : "Privat prosjekt"}
              </p>
              <form
                className="auth-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const data = new FormData(event.currentTarget);
                  void change("update", {
                    name: String(data.get("name")),
                    description: String(data.get("description")),
                  });
                }}
              >
                <label>
                  {en ? "Name" : "Navn"}
                  <input
                    name="name"
                    defaultValue={selected.name}
                    required
                    minLength={2}
                    maxLength={100}
                  />
                </label>
                <label>
                  {en ? "Description" : "Beskrivelse"}
                  <textarea
                    name="description"
                    defaultValue={selected.description ?? ""}
                    maxLength={1000}
                  />
                </label>
                <button className="button" disabled={pending}>
                  {en ? "Save details" : "Lagre detaljer"}
                </button>
              </form>
              <button
                className="button"
                disabled={pending}
                onClick={() =>
                  void change(selected.archivedAt ? "restore" : "archive")
                }
              >
                {selected.archivedAt
                  ? en
                    ? "Restore"
                    : "Gjenopprett"
                  : en
                    ? "Archive"
                    : "Arkiver"}
              </button>
              <details>
                <summary>{en ? "Delete project" : "Slett prosjekt"}</summary>
                <form
                  className="auth-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void change("delete", {
                      confirmation: String(
                        new FormData(event.currentTarget).get("confirmation"),
                      ),
                    });
                  }}
                >
                  <p>
                    {en
                      ? "Type the project name to confirm. The project will be hidden; stored media follows its separate retention policy."
                      : "Skriv prosjektnavnet for å bekrefte. Prosjektet skjules; lagrede medier følger egne regler for oppbevaring."}
                  </p>
                  <label>
                    {en ? "Project name" : "Prosjektnavn"}
                    <input name="confirmation" required />
                  </label>
                  <button className="button" disabled={pending}>
                    {en ? "Delete project" : "Slett prosjekt"}
                  </button>
                </form>
              </details>
              <Link className="button" href="/app/library">
                {en ? "Open Studio tools" : "Åpne Studio-verktøy"}
              </Link>
            </>
          )}
        </section>
      ) : (
        <>
          <form className="auth-form" onSubmit={create}>
            <label>
              {en ? "New project name" : "Navn på nytt prosjekt"}
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                disabled={pending}
              />
            </label>
            <button className="button primary" disabled={pending}>
              {en ? "Create project" : "Opprett prosjekt"}
            </button>
          </form>
          <button className="button" onClick={() => setArchived(!archived)}>
            {archived
              ? en
                ? "Active projects"
                : "Aktive prosjekter"
              : en
                ? "Archived projects"
                : "Arkiverte prosjekter"}
          </button>
          <section className="empty-section">
            <h2>
              {archived
                ? en
                  ? "Archived"
                  : "Arkivert"
                : en
                  ? "Your projects"
                  : "Dine prosjekter"}
            </h2>
            {rows.length ? (
              <ul>
                {rows.map((row) => (
                  <li key={row.id}>
                    <Link href={`/app/projects/${encodeURIComponent(row.id)}`}>
                      {row.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                {en ? "No projects here yet." : "Ingen prosjekter her ennå."}
              </p>
            )}
          </section>
        </>
      )}
      {message && <p role="alert">{message}</p>}
    </>
  );
}

export function AccountScreen({
  locale,
  enabled,
}: {
  locale: Locale;
  enabled: boolean;
}) {
  const en = locale === "en";
  const router = useRouter();
  const [message, setMessage] = useState("");
  async function updateName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(
      new FormData(event.currentTarget).get("name") || "",
    ).trim();
    const result = await authClient.updateUser({ name });
    setMessage(
      result.error
        ? en
          ? "Name could not be updated."
          : "Navnet kunne ikke oppdateres."
        : en
          ? "Name updated."
          : "Navnet er oppdatert.",
    );
  }
  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await authClient.changePassword({
      currentPassword: String(data.get("currentPassword")),
      newPassword: String(data.get("newPassword")),
      revokeOtherSessions: true,
    });
    setMessage(
      result.error
        ? en
          ? "Password could not be changed."
          : "Passordet kunne ikke endres."
        : en
          ? "Password changed; other sessions were revoked."
          : "Passordet er endret; andre økter ble avsluttet.",
    );
    if (!result.error) event.currentTarget.reset();
  }
  async function requestDeletion() {
    const response = await fetch("/api/account/deletion-request", {
      method: "POST",
    });
    setMessage(
      response.ok
        ? en
          ? "Request recorded. Support will review it before any deletion."
          : "Forespørselen er registrert. Den gjennomgås før sletting."
        : en
          ? "Request could not be recorded."
          : "Forespørselen kunne ikke registreres.",
    );
  }
  return (
    <>
      <p className="eyebrow">VASTU NORD STUDIO</p>
      <h1>{en ? "Account settings" : "Kontoinnstillinger"}</h1>
      <section className="empty-section">
        {!enabled ? (
          <p>
            {en
              ? "Account services are not configured."
              : "Kontotjenester er ikke konfigurert."}
          </p>
        ) : (
          <>
            <p>
              {en
                ? "Your account and projects are private."
                : "Kontoen og prosjektene dine er private."}
            </p>
            <form className="auth-form" onSubmit={updateName}>
              <label>
                {en ? "Display name" : "Visningsnavn"}
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                />
              </label>
              <button className="button">
                {en ? "Update name" : "Oppdater navn"}
              </button>
            </form>
            <details>
              <summary>{en ? "Change password" : "Endre passord"}</summary>
              <form className="auth-form" onSubmit={changePassword}>
                <label>
                  {en ? "Current password" : "Nåværende passord"}
                  <input
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </label>
                <label>
                  {en
                    ? "New password (at least 12 characters)"
                    : "Nytt passord (minst 12 tegn)"}
                  <input
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    required
                  />
                </label>
                <button className="button">
                  {en ? "Change password" : "Endre passord"}
                </button>
              </form>
            </details>
            <button
              className="button"
              onClick={async () => {
                await authClient.signOut();
                router.push("/");
                router.refresh();
              }}
            >
              {en ? "Sign out" : "Logg ut"}
            </button>
            <details>
              <summary>
                {en ? "Request account deletion" : "Be om kontosletting"}
              </summary>
              <p>
                {en
                  ? "This records a request. It does not immediately erase your data."
                  : "Dette registrerer en forespørsel. Dataene slettes ikke umiddelbart."}
              </p>
              <button className="button" onClick={() => void requestDeletion()}>
                {en ? "Send request" : "Send forespørsel"}
              </button>
            </details>
          </>
        )}
        {message && <p role="status">{message}</p>}
      </section>
    </>
  );
}
