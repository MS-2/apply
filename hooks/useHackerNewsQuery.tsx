import { useQuery } from "@tanstack/react-query";
import { AlgoliaResponse, Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { saveHitsToFeed, getHits } from "@/data/Tasks";
import * as Notifications from 'expo-notifications';
import { useUserPreferencesContext } from "@/providers/UserPreferences";


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
    const db = useSQLiteContext();
    const { selectedPreferences } = useUserPreferencesContext();
    return useQuery<AlgoliaResponse>({
        queryKey: ["hackernews"],
        queryFn: async () => {
            const response = await fetchAlgoliaData();
            const existingHits = await getHits();
            const newHits = response.hits.filter(hit => !existingHits.some(existing => existing.objectID === hit.objectID));

            // filter new articles that match preferences
            const filteredHits = newHits.filter(hit =>
                selectedPreferences.some(term => hit.story_title.toLowerCase().includes(term.toLowerCase()))
            );

            if (filteredHits.length > 0) {
                // send push notification when somenthing match
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "New Articles Available",
                        body: `${filteredHits.length} new articles match your interests!`,
                    },
                    trigger: null
                });
            }

            await saveHitsToFeed(db, response.hits);
            return response;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 2, // Reintenta la consulta 3 veces en caso de fallo
        refetchOnWindowFocus: true, // Refetch cuando la ventana gana el foco
        refetchInterval: 1000 * 60 * 10, // Refetch cada 10 minutos
    });
};
