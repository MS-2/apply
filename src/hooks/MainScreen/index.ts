import { useCallback, useState } from "react";
import { onlineManager, useQuery } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import { Hit } from "@/types/algoliaResponse";
import { getHits, addToFavorites, addToDeletes } from "@/hooks/MainScreen/data";
import { fetchData } from "@/api/fetchAlgoliaData";

export const useMainScreen = (selectedPreferences: string[]) => {
  const [hits, setHits] = useState<Hit[]>([]);

  // React Query logic for fetching data
  const { error, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchData(1, selectedPreferences),
  });

  // Effect to fetch hits from local storage when screen gains focus
  useFocusEffect(
    useCallback(() => {
      const setData = async () => {
        try {
          const hits = await getHits();
          setHits(hits);
        } catch (error) {
          console.error("Error fetching hits:", error);
        }
      };
      setData();
    }, [])
  );

  // Functions to handle swipe actions
  const handleSwipeRight = (item: Hit) => addToFavorites(item);
  const handleSwipeLeft = (item: Hit) => addToDeletes(item);

  return {
    hits,
    error,
    isLoading,
    refetch,
    isRefetching,
    online: onlineManager.isOnline(),
    handleSwipeRight,
    handleSwipeLeft,
  };
};
