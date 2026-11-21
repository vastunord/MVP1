import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { Header } from "@/components/header";
import { StudioShell, Directory } from "@/components/workspace";
import { Library } from "@/components/library";
import { Editor } from "@/components/editor";
import { studies } from "@/lib/workspace-catalog";
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
import { findTool } from "@vastunord/contracts/tools";

import { authReadiness } from "@/server/auth-readiness";
import { createDatabase } from "@/server/db";
import { ProjectsScreen, AccountScreen } from "@/components/project-screens";
import { readServerConfig } from "@/server/config";
export const metadata = { title: "Studio" };
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<{ album?: string | string[] }>;
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
  if (authEnabled) {
    const { auth } = await import("@/server/auth");
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.emailVerified) redirect("/login");
    const db = createDatabase();
    const personal = await db.workspace
      .findUnique({
        where: { personalOwnerId: session.user.id },
        select: {
          id: true,
          projects: isDashboard && {
            where: { archivedAt: null, deletedAt: null },
            select: { id: true, name: true },
            orderBy: { updatedAt: "desc" },
            take: 3,
          },
        },
      })
      .finally(() => db.$disconnect());
    if (!personal) redirect("/onboarding");
    if (isDashboard) recentProjects = personal.projects;
  }
  let content;
  if (path[0] === "tools" && path.length === 2) {
    const tool = findTool(path[1]);
    if (!tool) notFound();
    content = (
      <Editor
        key={tool.id}
        tool={tool}
        locale={locale}
        uploadsEnabled={authEnabled && readServerConfig().uploadsEnabled}
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
    const requestedAlbum = (await searchParams).album;
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
            {en ? "Studio collection" : "Studiosamling"}
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
          <h1>{en ? "Workspace search" : "Søk i arbeidsområdet"}</h1>
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
      <Header locale={locale} theme={theme} workspace authReady={authEnabled} />
      <StudioShell locale={locale}>{content}</StudioShell>
    </>
  );
}
