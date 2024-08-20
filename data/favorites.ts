import { Hit } from "@/types/algoliaResponse";
import { openDatabase } from "./db";

export const removeFromFavorite = async (objectID: string) => {
  const db = await openDatabase();
  try {
    await db.runAsync(`DELETE FROM favoriteHits WHERE objectID = ?`, [
      objectID,
    ]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const getFavoritesHits = async (): Promise<Hit[] | []> => {
  try {
    const db = await openDatabase();
    const favoriteHits = await db.getAllAsync<Hit>(
      "SELECT * FROM favoriteHits"
    );
    return favoriteHits || [];
  } catch (error) {
    console.error("Error getting favorite hits:", error);
    return [];
  }
};
