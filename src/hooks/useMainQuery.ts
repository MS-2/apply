import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AlgoliaResponse, Hit } from "@/types/algoliaResponse";
import * as Notifications from "expo-notifications";
import { useUserPreferencesContext } from "@/providers/UserPreferences";
import { getFavoritesHits } from "@/data/favorites";
import { getDeletedHits } from "@/data/deleted";
import { fetchAlgoliaData, fetchUsingInfinityQuery } from "@/api";

const filterHitsByPreferences = (hits: Hit[], preferences: string[]): Hit[] => {
  return hits.filter((hit) =>
    preferences.some((term) =>
      hit.story_title?.toLowerCase().includes(term.toLowerCase())
    )
  );
};

export const sendNotification = async (
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

export const sanitizeResponse = (response: AlgoliaResponse) => {
  const seenStoryTitles = new Set<string>();
  return response.hits.filter((hit) => {
    const normalizedTitle = hit.story_title?.trim().toLowerCase();
    if (normalizedTitle && !seenStoryTitles.has(normalizedTitle)) {
      seenStoryTitles.add(normalizedTitle);
      return true;
    }
    return false;
  });
};

const customFunctionWithParam = async (pageParam: number) => {
  const { selectedPreferences } = useUserPreferencesContext();
  const response = await fetchAlgoliaData(pageParam);
  const deletedIds = await getDeletedHits();
  const favoritesIds = await getFavoritesHits();
  // const filteredHits = sanitizeResponse(response).filter(
  //   (hit) =>
  //     !deletedIds.some((deleted) => deleted.objectID === hit.objectID) &&
  //     !favoritesIds.some((favorite) => favorite.objectID === hit.objectID)
  // );
  const filteredHits = sanitizeResponse(response);
  await sendNotification(response, selectedPreferences, filteredHits);
  return filteredHits;
};

export const useMainQuery = (pageParam: number) => {
  return useQuery<Hit[]>({
    queryKey: ["hackernews"],
    queryFn: () => customFunctionWithParam(pageParam),
  });
};

export const useMainQueryUsingInfinity = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: fetchUsingInfinityQuery,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage || false,
  });
};
