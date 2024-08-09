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
        staleTime: 1000 * 60 * 5, // 5 minutos
        queryFn: fetchAlgoliaData,
    });
};
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { AlgoliaResponse } from "@/types/algoliaResponse";

// const fetchAlgoliaData = async ({ pageParam = 0 }): Promise<AlgoliaResponse> => {
//     const response = await fetch(`https://hn.algolia.com/api/v1/search_by_date?query=mobile&page=${pageParam}`);
//     if (!response.ok) {
//         throw new Error("Network response was not ok");
//     }
//     return response.json();
// };

// export const useHackerQuery = () => {
//     return useInfiniteQuery<AlgoliaResponse>({
//         queryKey: ["hackernews"],
//         queryFn: fetchAlgoliaData,
//         staleTime: 1000 * 60 * 5, // 5 minutos
//         cacheTime: 1000 * 60 * 60 * 24, // 24 horas
//         getNextPageParam: (lastPage, allPages) => {
//             // Aquí determinamos la próxima página basándonos en la cantidad de páginas anteriores
//             const nextPage = allPages.length;
//             return nextPage; // `nextPage` será undefined cuando no haya más páginas
//         },

//     });
// };
