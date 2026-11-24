export const knowledgeTopics = ["budget", "staging", "interiors", "tools", "design", "material", "light", "floor"] as const;
// Studio quick tips retain their editorial names; Nordic and Vastu are Design
// subtopics in the same public/Studio filter taxonomy.
export function quickTipTopic(id: string): string {
  return id === "nordic" || id === "vastu" ? "design" : id;
}
export type KnowledgeState = { query: string; topic: number; page: number };

export function readKnowledgeState(search: string): KnowledgeState {
  const params = new URLSearchParams(search);
  const topicParam = params.get("topic") ?? "";
  const pageParam = params.get("page") ?? "";
  const parsedTopic = Number(topicParam);
  const parsedPage = Number(pageParam);
  return {
    query: (params.get("q") ?? "").slice(0, 200),
    topic: /^\d+$/.test(topicParam) && Number.isInteger(parsedTopic) && parsedTopic < knowledgeTopics.length ? parsedTopic : -1,
    page: /^\d+$/.test(pageParam) && Number.isSafeInteger(parsedPage) ? Math.min(parsedPage, 10000) : 0,
  };
}

export function knowledgeSearch(state: KnowledgeState): string {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query.slice(0, 200));
  if (state.topic >= 0 && state.topic < knowledgeTopics.length) params.set("topic", String(state.topic));
  if (state.page > 0) params.set("page", String(state.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}
