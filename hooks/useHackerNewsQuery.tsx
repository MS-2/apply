import { useQuery } from "@tanstack/react-query";
import { AlgoliaResponse } from "@/types/algoliaResponse";

const fetchAlgoliaData = async (): Promise<AlgoliaResponse> => {
    const response = await fetch("https://hn.algolia.com/api/v1/search_by_date?query=mobile");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    if (!data || !data.hits) {
        throw new Error("Invalid data format");
    }
    return data;
};

export const useHackerQuery = () => {
    return useQuery<AlgoliaResponse>({
        queryKey: ["hackernews"],
        queryFn: fetchAlgoliaData,
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 3, // Reintenta la consulta 3 veces en caso de fallo
        refetchOnWindowFocus: true, // Refetch cuando la ventana gana el foco
        refetchInterval: 1000 * 60 * 10, // Refetch cada 10 minutos
    });
};

