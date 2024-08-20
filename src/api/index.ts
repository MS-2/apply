import { AlgoliaResponse } from "@/types/algoliaResponse";

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
