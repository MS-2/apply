import { saveHits } from "@/hooks/MainScreen/data";
import { Hit, AlgoliaResponse } from "@/types/algoliaResponse";
import { ALGOLIA_API_URL } from "@/utils/constants";
import { sendNotification } from "@/utils/notifications/sendNotification";
import { sanitizeResponse } from "@/utils/utilitys";

export const fetchData = async (
  totalPages: number = 1,
  userPreferences: string[]
) => {
  const allPosts: Hit[][] = [];
  try {
    const query = userPreferences.length ? userPreferences.join(" OR ") : "";
    for (let page = totalPages; page < totalPages + totalPages; page++) {
      const response = await fetch(
        `${ALGOLIA_API_URL}?query=${encodeURIComponent(query)}&page=${page}`
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

      allPosts.push(data.hits);
      // Check if there's more data to fetch
      if (!data.hits.length) break;
    }
    const posts = allPosts.flatMap((posts) => posts);
    const sanitizedPosts = sanitizeResponse(posts);
    await sendNotification({
      hits: sanitizedPosts,
      selectedPreferences: userPreferences,
    });
    saveHits(sanitizedPosts);
    return sanitizedPosts;
  } catch (error) {
    console.error(`Failed to fetch data: ${error}`);
    return [];
  }
};
