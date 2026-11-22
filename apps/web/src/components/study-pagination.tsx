import type { Locale } from "@/lib/i18n";
export const studyPageSize = 12;
export function StudyPagination({
  page,
  count,
  locale,
  move,
}: {
  page: number;
  count: number;
  locale: Locale;
  move: (page: number) => void;
}) {
  const pages = Math.ceil(count / studyPageSize);
  if (pages <= 1) return null;
  const en = locale === "en";
  return (
    <nav
      className="study-pagination"
      aria-label={en ? "Article pages" : "Artikkelsider"}
    >
      <button
        type="button"
        disabled={page === 0}
        onClick={() => move(page - 1)}
      >
        {en ? "Previous" : "Forrige"}
      </button>
      <span aria-live="polite">
        {en ? "Page" : "Side"} {page + 1} / {pages}
      </span>
      <button
        type="button"
        disabled={page + 1 >= pages}
        onClick={() => move(page + 1)}
      >
        {en ? "Next" : "Neste"}
      </button>
    </nav>
  );
}
