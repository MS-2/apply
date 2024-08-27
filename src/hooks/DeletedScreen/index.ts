import { useCallback, useState } from "react";
import { Hit } from "@/types/algoliaResponse";
import { getDeleted, removeFromDeleted } from "@/hooks/DeletedScreen/data";

type UseDeletedArticlesReturn = {
  articles: Hit[];
  loading: boolean;
  error: string | null;
  fetchDeletedArticles: () => Promise<void>;
  removeFromDeleted: (objectID: string) => Promise<void>;
};

export const useDeletedArticles = (): UseDeletedArticlesReturn => {
  const [articles, setArticles] = useState<Hit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeletedArticles = useCallback(async () => {
    try {
      const deletes = await getDeleted();
      setArticles(deletes);
    } catch (error) {
      setError("Failed to load deleted articles");
    } finally {
      setLoading(false);
    }
  }, []);

  return { articles, loading, error, fetchDeletedArticles, removeFromDeleted };
};
