import { useCallback, useState } from "react";
import { onlineManager, useQuery } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { Hit } from "@/types/algoliaResponse";
import { getHits, addToFavorites, addToDeletes } from "@/hooks/MainScreen/data";
import { fetchData } from "@/api/fetchAlgoliaData";
import { useUserPreferencesContext } from "@/providers/UserPreferences";

export const useMainScreen = () => {
  const isOnline = onlineManager.isOnline();
  const { selectedPreferences } = useUserPreferencesContext();
  const [hits, setHits] = useState<Hit[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { error, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["feed"],
    queryFn: () => fetchData(1, selectedPreferences),
  });

  useFocusEffect(
    useCallback(() => {
      const setData = async () => {
        try {
          const hits = await getHits();
          setHits(hits);
          if (isInitialLoad && hits.length === 0) {
            if (!isOnline) {
              setIsInitialLoad(false);
              return;
            }
            setIsInitialLoad(false); // Evitar el ciclo infinito
            router.push("/screens/loader");
          }
        } catch (error) {
          setIsInitialLoad(false);
          console.error("Error fetching hits:", error);
        }
      };
      setData();
    }, [isOnline])
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
    online: isOnline,
    handleSwipeRight,
    handleSwipeLeft,
  };
};
