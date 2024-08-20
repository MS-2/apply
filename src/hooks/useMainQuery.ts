import { useQuery } from "@tanstack/react-query";
import { AlgoliaResponse, Hit } from "@/types/algoliaResponse";

import * as Notifications from "expo-notifications";
import { useUserPreferencesContext } from "@/providers/UserPreferences";
import { getFavoritesHits } from "@/data/favorites";
import { getDeletedHits } from "@/data/deleted";
import { fetchAlgoliaData } from "@/api";
import { STALE_TIME, RETRY, REFETCH_INTERVAL } from "@/constants";

const filterHitsByPreferences = (hits: Hit[], preferences: string[]): Hit[] => {
  return hits.filter((hit) =>
    preferences.some((term) =>
      hit.story_title?.toLowerCase().includes(term.toLowerCase())
    )
  );
};

const sendNotification = async (
  response: AlgoliaResponse,
  selectedPreferences: string[],
  filteredHits: Hit[]
): Promise<void> => {
  if (
    !response ||
    !Array.isArray(selectedPreferences) ||
    !Array.isArray(filteredHits)
  ) {
    console.error("Invalid arguments passed to sendNotification");
    return;
  }

  try {
    const matchedHits = filterHitsByPreferences(
      response.hits,
      selectedPreferences
    );

    if (matchedHits.length > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Articles Available",
          body: `${filteredHits.length} new articles match your interests!`,
        },
        trigger: null,
      });
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const useMainQuery = () => {
  const { selectedPreferences } = useUserPreferencesContext();
  return useQuery<Hit[]>({
    queryKey: ["hackernews"],
    queryFn: async () => {
      const response = await fetchAlgoliaData();
      const deletedIds = await getDeletedHits();
      const favoritesIds = await getFavoritesHits();
      const filteredHits = response.hits.filter(
        (hit) =>
          !deletedIds.some((deleted) => deleted.objectID === hit.objectID) &&
          !favoritesIds.some((favorite) => favorite.objectID === hit.objectID)
      );
      await sendNotification(response, selectedPreferences, filteredHits);
      return filteredHits;
    },
    staleTime: STALE_TIME,
    retry: RETRY,
    refetchInterval: REFETCH_INTERVAL,
  });
};
