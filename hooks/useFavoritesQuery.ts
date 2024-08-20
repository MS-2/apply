import { useQuery } from "@tanstack/react-query";
import { Hit } from "@/types/algoliaResponse";
import { fetchAlgoliaData } from "@/api";
import { getFavoritesHits } from "@/data/favorites";

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
    refetchOnWindowFocus: false,
    staleTime: 300000, // Agregado tiempo de "stale" de 5 minutos para evitar refetch innecesario
  });
};
