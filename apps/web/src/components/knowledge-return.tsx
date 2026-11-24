"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { publicHref, type Locale } from "@/lib/i18n";
import { knowledgeSearch, readKnowledgeState } from "@/lib/knowledge-state";

function subscribe(notify: () => void) {
  window.addEventListener("popstate", notify);
  return () => window.removeEventListener("popstate", notify);
}
const snapshot = () => window.location.search;
const serverSnapshot = () => "";

export function KnowledgeReturn({ locale, children, className }: { locale: Locale; children: React.ReactNode; className?: string }) {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const search = knowledgeSearch(readKnowledgeState(raw));
  const studio = new URLSearchParams(raw).get("from") === "studio";
  return <Link className={className} href={(studio ? "/app/knowledge" : publicHref("/resources", locale)) + search}>{children}</Link>;
}
