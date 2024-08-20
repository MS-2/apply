import { useQuery } from "@tanstack/react-query";
import { Hit } from "@/types/algoliaResponse";
import { fetchAlgoliaData } from "@/api";
import { getFavoritesHits } from "@/data/favorites";
import { STALE_TIME, RETRY, REFETCH_INTERVAL } from "@/constants";

export const useFavoritesQuery = () => {
  return useQuery<Hit[]>({
    queryKey: ["favoritesIds"], // Nombre más descriptivo
    queryFn: async () => {
      try {
        const response = await fetchAlgoliaData();
        const favoritesIds = await getFavoritesHits();
        const filteredHits = response.hits.filter((hit) =>
          favoritesIds.some(
            (favoriteId) => favoriteId.objectID === hit.objectID
          )
        );
        return filteredHits;
      } catch (error) {
        console.error("Error fetching favorites hits:", error);
        return []; // Devolver un array vacío en caso de error
      }
    },
    staleTime: STALE_TIME,
    retry: RETRY,
    refetchInterval: REFETCH_INTERVAL,
  });
};
