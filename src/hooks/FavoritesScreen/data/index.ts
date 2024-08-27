import { openDatabase } from "@/data/db";
import { Hit } from "@/types/algoliaResponse";

// SQL Queries as constants
const DELETE_FROM_FAVORITES = `DELETE FROM favorites WHERE objectID = ?`;
const SELECT_FAVORITE_HITS = `SELECT * FROM favorites`;

export const removeFromFavorite = async (objectID: string) => {
  const db = await openDatabase();
  try {
    await db.runAsync(DELETE_FROM_FAVORITES, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const getFavorites = async (): Promise<Hit[] | []> => {
  try {
    const db = await openDatabase();
    const favoriteHits = await db.getAllAsync<Hit>(SELECT_FAVORITE_HITS);
    return favoriteHits || [];
  } catch (error) {
    console.error("Error getting favorite hits:", error);
    return [];
  }
};
