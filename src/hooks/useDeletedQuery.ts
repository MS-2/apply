// import { useQuery } from "@tanstack/react-query";
// import { Hit } from "@/types/algoliaResponse";
// import { fetchAlgoliaData } from "@/api";
// import { getDeletedHits } from "@/data/deleted";
// import { STALE_TIME, RETRY, REFETCH_INTERVAL } from "@/constants";

// export const useDeletedQuery = () => {
//   return useQuery<Hit[]>({
//     queryKey: ["deletedIds"], // Nombre más descriptivo
//     queryFn: async () => {
//       try {
//         const response = await fetchAlgoliaData();
//         const deletedIds = await getDeletedHits();
//         const filteredHits = response.hits.filter((hit) =>
//           deletedIds.some((deletedHit) => deletedHit.objectID === hit.objectID)
//         );
//         return filteredHits;
//       } catch (error) {
//         console.error("Error fetching deleted hits:", error);
//         return []; // Devolver un array vacío en caso de error
//       }
//     },
//     staleTime: STALE_TIME,
//     retry: RETRY,
//     refetchInterval: REFETCH_INTERVAL,
//   });
// };
