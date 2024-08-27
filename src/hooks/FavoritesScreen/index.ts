import { useCallback, useState } from "react";
import { Hit } from "@/types/algoliaResponse";
import { getFavorites, removeFromFavorite } from "@/hooks/FavoritesScreen/data";
import { onlineManager } from "@tanstack/react-query";

type UseFavoritesReturn = {
  favorites: Hit[];
  loading: boolean;
  error: boolean;
  fetchFavorites: () => Promise<void>;
  removeFromFavorite: (objectID: string) => Promise<void>;
  isOnline: boolean;
};

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Hit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchFavorites = useCallback(async () => {
    try {
      const favoriteIDs = await getFavorites();
      setFavorites(favoriteIDs);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    removeFromFavorite,
    isOnline: onlineManager.isOnline(),
  };
};
