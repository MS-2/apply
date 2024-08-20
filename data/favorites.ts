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
