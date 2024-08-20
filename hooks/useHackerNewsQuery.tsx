import { useQuery } from "@tanstack/react-query";
import { AlgoliaResponse, Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
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
    return useQuery<Hit[]>({
        queryKey: ["hackernews"],
        queryFn: async () => {
            const response = await fetchAlgoliaData();
            const deletedHits = await db.getAllAsync<Hit>('SELECT * FROM deletedHits');
            const favoriteHits = await db.getAllAsync<Hit>('SELECT * FROM favoriteHits');
            const filteredHits = response.hits.filter(hit =>
                !deletedHits.some(deletedHit => deletedHit.objectID === hit.objectID) &&
                !favoriteHits.some(favoriteHit => favoriteHit.objectID === hit.objectID)

            );
            const preferencesHit = response.hits.filter(hit =>
                selectedPreferences.some(term => hit.story_title?.toLowerCase().includes(term.toLowerCase()))
            );
            if (preferencesHit.length > 0) {
                // send push notification when somenthing match
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "New Articles Available",
                        body: `${filteredHits.length} new articles match your interests!`,
                    },
                    trigger: null
                });
            }
            return filteredHits
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 2,
        refetchOnWindowFocus: true, // Refetch onFocus
        refetchInterval: 1000 * 60 * 10, // Refetch every  10 min
    });
};


export const useDeletedQuery = () => {
    const db = useSQLiteContext();
    return useQuery<Hit[]>({
        queryKey: ["DELETED"],
        queryFn: async () => {
            const response = await fetchAlgoliaData();
            const deletedHits = await db.getAllAsync<Hit>('SELECT * FROM deletedHits');
            const filteredHits = response.hits.filter(hit =>
                deletedHits.some(deletedHit => deletedHit.objectID === hit.objectID)
            );
            return filteredHits
        },
        refetchOnWindowFocus: true
    });
};

export const useFavoritesQuery = () => {
    const db = useSQLiteContext();
    return useQuery<Hit[]>({
        queryKey: ["FAVORITES"],
        queryFn: async () => {
            const response = await fetchAlgoliaData();
            const favoritesHits = await db.getAllAsync<Hit>('SELECT * FROM favoriteHits');
            const filteredHits = response.hits.filter(hit =>
                favoritesHits.some(favoriteHit => favoriteHit.objectID === hit.objectID)
            );
            return filteredHits
        },
        refetchOnWindowFocus: true
    });
};
