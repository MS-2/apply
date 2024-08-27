import { Hit } from "@/types/algoliaResponse";

export const sanitizeResponse = (hits: Hit[]) => {
  const seenStoryTitles = new Set<string>();
  return hits.filter((hit) => {
    const normalizedTitle = hit.story_title?.trim().toLowerCase();
    if (normalizedTitle && !seenStoryTitles.has(normalizedTitle)) {
      seenStoryTitles.add(normalizedTitle);
      return true;
    }
    return false;
  });
};

export const filterHitsByPreferences = (
  hits: Hit[],
  preferences: string[]
): Hit[] => {
  return hits.filter((hit) =>
    preferences.some((term) =>
      hit.story_title?.toLowerCase().includes(term.toLowerCase())
    )
  );
};
