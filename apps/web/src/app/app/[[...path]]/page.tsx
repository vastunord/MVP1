import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { getSessionCookie } from "better-auth/cookies";
import { Header } from "@/components/header";
import { StudioShell, Directory } from "@/components/workspace";
import { Library } from "@/components/library";
import { Editor } from "@/components/editor";
import { pranaSettings } from "@/server/prana";
import { studioPersistenceReady } from "@/server/studio-readiness";
import { mnmlConfig } from "@/server/mnml";
import { destinations, findStudioSample, studies } from "@/lib/workspace-catalog";
import {
  Dashboard,
  StudyDetail,
  CollaborationScreen,
  SettingsLinks,
} from "@/components/workspace-dashboard";
import { Gallery, StudyCards } from "@/components/workspace-gallery";
import {
  WorkspaceExperience,
  isExperienceRoute,
} from "@/components/workspace-experience";
import { savedLocale } from "@/lib/locale-server";
import { publicHref } from "@/lib/i18n";
import { findTool } from "@vastunord/contracts/tools";

import { authReadiness, verifiedSessionUserId } from "@/server/auth-readiness";
import { createDatabase } from "@/server/db";
import { ProjectsScreen, AccountScreen } from "@/components/project-screens";
import { readServerConfig } from "@/server/config";
import { studioPageTitle } from "@/lib/studio-metadata";
import { studioAuthQuery } from "@/lib/studio-return";
import { controlledRenderingAllowanceReady } from "@/lib/studio-test-access";
export async function generateMetadata({ params }: { params: Promise<{ path?: string[] }> }) {
  return { title: studioPageTitle((await params).path ?? [], await savedLocale(), destinations, findTool) };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{
    album?: string | string[];
    sample?: string | string[];
  }>;
}) {
  const path = (await params).path ?? [],
    locale = await savedLocale();
  const en = locale === "en";
  const pref = (await cookies()).get("vn-theme")?.value;
  const theme = pref === "light" || pref === "dark" ? pref : "system";
  const authEnabled = authReadiness().ready;
  const isDashboard =
    path.length === 0 || (path.length === 1 && path[0] === "dashboard");
  let recentProjects: { id: string; name: string }[] = [];
  if (path.length === 1 && path[0] === "prana")
    redirect(publicHref("/", locale) + "?assistant=prana");
  const tool =
    path.length === 2 && path[0] === "tools" ? findTool(path[1]) : undefined;
  const sample = tool
    ? findStudioSample((await searchParams).sample)
    : undefined;
  const requestedAlbum = (await searchParams).album;
  const location = path.length ? "/app/" + path.join("/") : "/app";
  const returnLocation = typeof requestedAlbum === "string" && /^[A-Za-z0-9_-]{1,100}$/.test(requestedAlbum)
    ? location + "?album=" + requestedAlbum : location;
  const intent = studioAuthQuery(tool?.id === "room-reimagination" && !sample, returnLocation);
  const loginIntent = intent ? "?" + intent : "";
  let signedIn = false;
  let editorUserId: string | undefined;
  let renderReady = false;
  let testerMaySubmit = false;
  if (authEnabled) {
    const requestHeaders = await headers();
    let userId: string | null = null;
    if (getSessionCookie(requestHeaders)) {
      const { auth } = await import("@/server/auth");
      userId = verifiedSessionUserId(
        await auth.api.getSession({ headers: requestHeaders }),
      );
    }
    signedIn = Boolean(userId);
    editorUserId = userId ?? undefined;
    if (!userId && !sample)
      redirect(publicHref("/login" + loginIntent, locale));
    if (userId) {
      const db = createDatabase();
      const [personal, canRender, hasAllowance] = await Promise.all([
        db.workspace.findUnique({
          where: { personalOwnerId: userId },
          select: {
            id: true,
            projects: isDashboard && {
              where: { archivedAt: null, deletedAt: null },
              select: { id: true, name: true },
              orderBy: { updatedAt: "desc" },
              take: 3,
            },
          },
        }),
        tool && readServerConfig().uploadsEnabled
          ? studioPersistenceReady(db)
          : false,
        tool && mnmlConfig() ? controlledRenderingAllowanceReady(db, userId) : false,
      ]).finally(() => db.$disconnect());
      renderReady = canRender;
      testerMaySubmit = hasAllowance;
      if (!personal && !sample && !tool)
        redirect(publicHref("/onboarding" + loginIntent, locale));
      if (isDashboard && personal) recentProjects = personal.projects;
    }
  }
  let content;
  if (path[0] === "tools" && path.length === 2) {
    if (!tool) notFound();
    content = (
      <Editor
        key={tool.id + (sample?.id ?? "")}
        tool={tool}
        userId={editorUserId}
        locale={locale}
        sample={sample}
        uploadsEnabled={signedIn && readServerConfig().uploadsEnabled}
        renderEnabled={signedIn && renderReady}
        submissionEnabled={renderReady && testerMaySubmit}
        improveEnabled={Boolean(pranaSettings(process.env))}
      />
    );
  } else if (isDashboard)
    content = (
      <Dashboard
        locale={locale}
        authenticated={authEnabled}
        recentProjects={recentProjects}
      />
    );
  else if (
    path.length === 1 &&
    ["library", "studio", "tools"].includes(path[0])
  )
    content = <Library locale={locale} />;
  else if (path[0] === "projects" && path.length <= 2)
    content = (
      <>
        <ProjectsScreen
          locale={locale}
          projectId={path[1]}
          enabled={authEnabled}
        />
        {!authEnabled && path.length === 1 && (
          <>
            <h2 className="vn-section-heading">
              {en ? "Example projects" : "Eksempelprosjekter"}
            </h2>
            <StudyCards locale={locale} />
          </>
        )}
      </>
    );
  else if (path[0] === "studies" && path.length === 2) {
    const study = studies.find((s) => s.id === path[1]);
    if (!study) notFound();
    content = <StudyDetail locale={locale} study={study} />;
  } else if (
    path.length === 1 &&
    ["renders", "gallery", "files", "assets"].includes(path[0])
  ) {
    const album = studies.find((s) => s.id === requestedAlbum)?.id;
    content = (
      <Gallery
        key={path[0] + (album || "")}
        locale={locale}
        initialAlbum={album}
        assets={["files", "assets"].includes(path[0])}
        privateFilesEnabled={authEnabled && readServerConfig().uploadsEnabled}
      />
    );
  } else if (path.length === 1 && path[0] === "albums")
    content = (
      <>
        <header className="vn-pagehead">
          <p className="eyebrow">
            {en ? "Studio collection" : "Samling i Studio"}
          </p>
          <h1>Album{en ? "s" : ""}</h1>
          <p>
            {en
              ? "Browse reference images by example project."
              : "Se referansebildene sortert etter eksempelprosjekt."}
          </p>
        </header>
        <StudyCards locale={locale} album />
      </>
    );
  else if (path.length === 1 && ["shared", "team"].includes(path[0]))
    content = <CollaborationScreen locale={locale} team={path[0] === "team"} />;
  else if (path.length === 1 && path[0] === "search")
    content = (
      <>
        <header className="vn-pagehead">
          <h1>{en ? "Search Studio" : "Søk i Studio"}</h1>
        </header>
        <Directory locale={locale} />
      </>
    );
  else if (
    path.length === 1 &&
    ["experience", "explore", "wallet"].includes(path[0])
  )
    redirect(
      "/app/" +
        {
          experience: "home-experience",
          explore: "knowledge",
          wallet: "credits",
        }[path[0]],
    );
  else if (path.length === 1 && isExperienceRoute(path[0]))
    content = <WorkspaceExperience section={path[0]} locale={locale} />;
  else if (path[0] === "settings" && path[1] === "billing" && path.length === 2)
    redirect("/app/billing");
  else if (
    path[0] === "settings" &&
    (path.length === 1 ||
      (path.length === 2 &&
        ["profile", "security", "notifications", "exports"].includes(path[1])))
  )
    content = (
      <>
        <AccountScreen locale={locale} enabled={authEnabled} />
        <SettingsLinks locale={locale} />
        {path[1] === "notifications" || path[1] === "exports" ? (
          <p>
            {en
              ? "Notification and export services are unavailable."
              : "Varsler og eksport er utilgjengelige."}
          </p>
        ) : null}
      </>
    );
  else if (path.length === 2 && path[0] === "editor") {
    const tool = findTool(path[1]);
    if (!tool) notFound();
    redirect(tool.route);
  } else notFound();
  return (
    <>
      <Header
        locale={locale}
        theme={theme}
        workspace
        authReady={authEnabled}
        signedIn={signedIn}
      />
      <StudioShell userId={editorUserId} locale={locale}>{content}</StudioShell>
    </>
  );
}
