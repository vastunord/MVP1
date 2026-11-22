export const publicOrigin = "https://vastunord-web.vercel.app";
export const indexableSections = [
  "",
  "features",
  "gallery",
  "about",
  "pricing",
  "resources",
  "contact",
  "privacy",
  "terms",
] as const;
export function publicIndexingEnabled(env: Record<string, string | undefined>) {
  return (
    env.APP_ENV === "production" &&
    env.VERCEL_ENV === "production" &&
    env.COMMERCIAL_LAUNCH_APPROVED === "true" &&
    env.PUBLIC_INDEXING_ENABLED === "true"
  );
}
export function publicPageUrls(path: string, origin = publicOrigin) {
  return {
    "nb-NO": origin + path,
    en: origin + "/en" + (path === "/" ? "" : path),
  };
}
