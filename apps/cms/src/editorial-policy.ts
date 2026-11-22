export type StaffRole = "editor" | "publisher" | "administrator";

export function staffRole(user: unknown): StaffRole | undefined {
  if (
    !user ||
    typeof user !== "object" ||
    !("collection" in user) ||
    user.collection !== "staff" ||
    !("role" in user)
  )
    return undefined;
  const role = user.role;
  return role === "editor" || role === "publisher" || role === "administrator"
    ? role
    : undefined;
}

export function canPublish(role?: StaffRole) {
  return role === "publisher" || role === "administrator";
}

export function approvedCover(value: unknown) {
  return (
    typeof value === "string" &&
    /^\/(?:media\/(?:gallery|briefs|tools|canvas)|reference\/editorial)\/[a-z0-9-]+\.webp$/.test(
      value,
    )
  );
}

export type Article = {
  _status?: "draft" | "published";
  review?: "drafting" | "submitted";
  sourceNote?: string;
  cover?: string;
  rightsConfirmed?: boolean;
  slug?: string;
  nb?: { title?: string; summary?: string; body?: string; alt?: string };
  en?: { title?: string; summary?: string; body?: string; alt?: string };
};

export function publishable(article: Article) {
  return (
    !!article.rightsConfirmed &&
    !!article.sourceNote?.trim() &&
    approvedCover(article.cover) &&
    !!article.slug?.trim() &&
    [article.nb, article.en].every(
      (copy) =>
        copy &&
        [copy.title, copy.summary, copy.body, copy.alt].every(
          (field) => !!field?.trim(),
        ),
    )
  );
}
