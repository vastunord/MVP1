import { notFound, redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { Header } from "@/components/header";
import { StudioShell } from "@/components/workspace";
import { Library } from "@/components/library";
import { Editor } from "@/components/editor";
import { messages, type MessageKey } from "@/lib/i18n";
import { savedLocale } from "@/lib/locale-server";
import { findTool } from "@vastunord/contracts/tools";
import Link from "next/link";
import { authReadiness } from "@/server/auth-readiness";
import { createDatabase } from "@/server/db";
import { ProjectsScreen, AccountScreen } from "@/components/project-screens";
import { readServerConfig } from "@/server/config";
export const metadata = { title: "Studio" };
export default async function Page({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const path = (await params).path ?? [],
    locale = await savedLocale(),
    t = messages(locale);
  const pref = (await cookies()).get("vn-theme")?.value;
  const theme = pref === "light" || pref === "dark" ? pref : "system";
  const authEnabled = authReadiness().ready;
  if (authEnabled) {
    const { auth } = await import("@/server/auth");
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.emailVerified) redirect("/login");
    const db = createDatabase();
    const personal = await db.workspace.findUnique({
      where: { personalOwnerId: session.user.id },
      select: { id: true },
    });
    await db.$disconnect();
    if (!personal) redirect("/onboarding");
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
  } else if (path[0] === "library" && path.length === 1)
    content = <Library locale={locale} />;
  else if (path[0] === "projects" && path.length <= 2)
    content = (
      <ProjectsScreen
        locale={locale}
        projectId={path[1]}
        enabled={authEnabled}
      />
    );
  else if (
    path[0] === "settings" &&
    (path.length === 1 ||
      (path.length === 2 && ["profile", "security"].includes(path[1])))
  )
    content = <AccountScreen locale={locale} enabled={authEnabled} />;
  else if (path.length === 0)
    content = (
      <>
        <p className="eyebrow">VASTU NORD STUDIO</p>
        <h1>{t.studio}</h1>
        <p className="lede">{t.libraryIntro}</p>
        <Link className="button primary" href="/app/library">
          {t.explore} ↗
        </Link>
        <p>
          <Link href="/app/projects">{t.projects} →</Link>
        </p>
        <section className="empty-section">
          <h2>{t.projects}</h2>
          <p>{t.emptyBody}</p>
        </section>
      </>
    );
  else if (
    (path.length === 1 &&
      ["files", "projects", "shared", "search", "settings"].includes(
        path[0],
      )) ||
    (path.length === 2 &&
      path[0] === "settings" &&
      ["profile", "security", "notifications", "exports", "billing"].includes(
        path[1],
      )) ||
    (path.length === 2 && ["editor", "projects"].includes(path[0]))
  )
    content = (
      <>
        <p className="eyebrow">STUDIO</p>
        <h1>{t[path[0] as MessageKey] ?? t.empty}</h1>
        <section className="empty-section">
          <h2>{t.unavailable}</h2>
          <p>{t.emptyBody}</p>
          <p>{t.status}</p>
        </section>
      </>
    );
  else notFound();
  return (
    <>
      <Header locale={locale} theme={theme} workspace authReady={authEnabled} />
      <StudioShell locale={locale}>{content}</StudioShell>
    </>
  );
}
