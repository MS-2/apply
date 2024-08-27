import { saveHits } from "@/data/main";
import { useUserPreferencesContext } from "@/providers/UserPreferences";
import { Hit, AlgoliaResponse } from "@/types/algoliaResponse";
import { sanitizeResponse, sendNotification } from "@/utils/utilitys";
import { ALGOLIA_API_URL } from "..";
import { searchTerms } from "@/constants";
export const fetchData = async (
  totalPages: number = 1,
  userPreferences: string[]
) => {
  const allPosts: Hit[][] = [];
  try {
    for (let page = totalPages; page < totalPages + totalPages; page++) {
      const response = await fetch(
        `${ALGOLIA_API_URL}?query=mobile&page=${page}`
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
    console.log("before ");
    await sendNotification({
      hits: sanitizedPosts,
      selectedPreferences: userPreferences,
    });
    console.log("sanit :", sanitizedPosts.length);
    saveHits(sanitizedPosts);
    return sanitizedPosts;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
};
