import { useQuery } from "@tanstack/react-query";
import { Hit } from "@/types/algoliaResponse";
import { fetchAlgoliaData } from "@/api";
import { getDeletedHits } from "@/data/deleted";

export const useDeletedQuery = () => {
  return useQuery<Hit[]>({
    queryKey: ["deletedIds"], // Nombre más descriptivo
    queryFn: async () => {
      try {
        const response = await fetchAlgoliaData();
        const deletedIds = await getDeletedHits();
        const filteredHits = response.hits.filter((hit) =>
          deletedIds.some((deletedHit) => deletedHit.objectID === hit.objectID)
        );
        return filteredHits;
      } catch (error) {
        console.error("Error fetching deleted hits:", error);
        return []; // Devolver un array vacío en caso de error
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 300000, // Agregado tiempo de "stale" de 5 minutos para evitar refetch innecesario
  });
};
