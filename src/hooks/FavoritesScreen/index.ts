// src/hooks/useFavorites.ts

import { useCallback, useEffect, useState } from "react";
import { Hit } from "@/types/algoliaResponse";
import { getFavorites } from "@/hooks/FavoritesScreen/data";

type UseFavoritesReturn = {
  favorites: Hit[];
  loading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>; // Agregado
};

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<Hit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      const favoriteIDs = await getFavorites();
      setFavorites(favoriteIDs);
    } catch (error) {
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return { favorites, loading, error, fetchFavorites }; // Incluye fetchFavorites en el retorno
};
