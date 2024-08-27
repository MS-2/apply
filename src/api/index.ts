import { AlgoliaResponse, Hit } from "@/types/algoliaResponse";

export const ALGOLIA_API_URL = "https://hn.algolia.com/api/v1/search_by_date";

export const fetchAlgoliaData = async (
  pageParam: number | undefined = 0
): Promise<AlgoliaResponse> => {
  try {
    const response = await fetch(
      `${ALGOLIA_API_URL}?query=mobile&page=${pageParam || 0}`
    );

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

export const fetchUsingInfinityQuery = async ({
  pageParam = 0,
}: {
  pageParam?: number | false;
}): Promise<{
  posts: Hit[];
  nextPage: number | null;
}> => {
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

    return {
      posts: data.hits,
      nextPage: data.page + 1 ?? null,
    };
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error}`);
  }
};
