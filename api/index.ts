import { AlgoliaResponse } from "@/types/algoliaResponse";

export const fetchAlgoliaData = async (): Promise<AlgoliaResponse> => {
  const response = await fetch(
    "https://hn.algolia.com/api/v1/search_by_date?query=mobile"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  if (!data || !data.hits) {
    throw new Error("Invalid data format");
  }
  return data;
};
