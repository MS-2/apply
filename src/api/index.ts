import { getDeletedHits } from "@/data/deleted";
import { getFavoritesHits } from "@/data/favorites";
import { AlgoliaResponse, Hit } from "@/types/algoliaResponse";

const ALGOLIA_API_URL = "https://hn.algolia.com/api/v1/search_by_date";

export const fetchAlgoliaData = async (): Promise<AlgoliaResponse> => {
  try {
    const response = await fetch(`${ALGOLIA_API_URL}?query=mobile`);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data: AlgoliaResponse = await response.json();

    if (!data || !Array.isArray(data.hits)) {
      throw new Error("Invalid data format: hits are missing or not an array");
    }

    return data;
  } catch (error) {
    console.error("Error fetching Algolia data:", error);
    throw error;
  }
};

export const fetchAlgoliaDataUsingInfinityQuery = async ({
  pageParam = 0,
}: {
  pageParam?: number | false;
}): Promise<{
  posts: Hit[];
  nextPage: number | null;
}> => {
  console.log("hello?");
  try {
    const response = await fetch(
      `${ALGOLIA_API_URL}?query=mobile&page=${pageParam || 0}`
    );

    if (!response.ok) {
      throw new Error(
        `Network error: ${response.status} ${response.statusText}`
      );
    }

    const data: AlgoliaResponse = await response.json();

    if (!data?.hits) {
      throw new Error("Unexpected data format from API");
    }

    const seenObjectIDs = new Set<string>();
    const seenStoryTitles = new Set<string>();

    const filteredHits = data.hits.filter((hit) => {
      const isDuplicatedObjectID = seenObjectIDs.has(hit.objectID);
      const isDuplicatedStoryTitle = seenStoryTitles.has(hit.story_title);
      const hasValidURL = hit.story_url !== undefined && hit.story_url !== null;

      if (!isDuplicatedObjectID && !isDuplicatedStoryTitle && hasValidURL) {
        seenObjectIDs.add(hit.objectID);
        seenStoryTitles.add(hit.story_title);
        return true;
      }
      return false;
    });

    const deletedIds = await getDeletedHits();
    const favoritesIds = await getFavoritesHits();
    const Hits = filteredHits.filter(
      (hit) =>
        !deletedIds.some((deleted) => deleted.objectID === hit.objectID) &&
        !favoritesIds.some((favorite) => favorite.objectID === hit.objectID)
    );
    // Finaliza el cronómetro y muestra el tiempo transcurrido en la consola

    return {
      posts: Hits,
      nextPage: data.page + 1 ?? null,
    };
  } catch (error) {
    console.timeEnd("fetchAlgoliaDataUsingInfinityQuery");
    throw new Error(`Failed to fetch data: ${error}`);
  }
};
