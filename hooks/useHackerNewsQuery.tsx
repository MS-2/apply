import { useQuery } from "@tanstack/react-query";
import { AlgoliaResponse, Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";

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
const saveHitsToDatabase = async (db: any, hits: Hit[]) => {

    for (const hit of hits) {
        await db.runAsync(
            `INSERT OR REPLACE INTO hits (
          objectID, author, comment_text, created_at, created_at_i, 
          parent_id, story_id, story_title, story_url, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                hit.objectID,
                hit.author,
                hit.comment_text,
                hit.created_at,
                hit.created_at_i,
                hit.parent_id,
                hit.story_id,
                hit.story_title,
                hit.story_url,
                hit.updated_at,
            ]
        );
    }
};
export const useHackerQuery = () => {
    const db = useSQLiteContext();
    return useQuery<AlgoliaResponse>({
        queryKey: ["hackernews"],
        queryFn: async () => {
            const response = await fetchAlgoliaData();
            await saveHitsToDatabase(db, response.hits);
            return response
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 3, // Reintenta la consulta 3 veces en caso de fallo
        refetchOnWindowFocus: true, // Refetch cuando la ventana gana el foco
        refetchInterval: 1000 * 60 * 10, // Refetch cada 10 minutos
    });
};

