import { useQuery } from "@tanstack/react-query";
import { AlgoliaResponse } from "@/types/algoliaResponse";

const fetchAlgoliaData = async (): Promise<AlgoliaResponse> => {
    const response = await fetch("https://hn.algolia.com/api/v1/search_by_date?query=mobile");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
};

export const useHackerQuery = () => {
    return useQuery<AlgoliaResponse>({
        queryKey: ["hackernews"],
        queryFn: fetchAlgoliaData,
    });
};
