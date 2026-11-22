import studies from "./visual-study-index.json";
import type { Locale } from "./i18n";
import { studyLessons, type StudyLens } from "./visual-study-lessons";

export type StudyCard = {
  id: string;
  name: string;
  intro: string;
  image: string;
  tags: number[];
  body?: string;
};

const records = new Map(studies.map((study) => [study.slug, study]));
export const studySlugs = [...records.keys()];

function details(record: (typeof studies)[number], locale: Locale) {
  const i = locale === "en" ? 1 : 0;
  const lesson = studyLessons[record.lens as StudyLens];
  return {
    id: record.slug,
    name: record.title[i],
    intro: record.observation[i],
    image: "studies/" + record.image,
    tags: [lesson.tag],
    topic: lesson.name[i],
    exercise: lesson.exercise[i],
    check: lesson.check[i],
    palette: record.palette,
    light: record.light,
    lens: record.lens,
  };
}

export function visualStudy(slug: string, locale: Locale) {
  const record = records.get(slug);
  return record ? details(record, locale) : undefined;
}

export function visualStudyCards(locale: Locale): StudyCard[] {
  return studies.map((record) => {
    const { id, name, intro, image, tags } = details(record, locale);
    return { id, name, intro, image, tags };
  });
}

export function relatedVisualStudies(slug: string, locale: Locale) {
  const index = studySlugs.indexOf(slug);
  if (index === -1) return [];
  const source = studies[index];
  const ordered = [...studies.slice(index + 1), ...studies.slice(0, index)];
  return ordered
    .filter((record) => record.lens === source.lens)
    .slice(0, 2)
    .map((record) => details(record, locale));
}
