import { Hit } from "@/types/algoliaResponse";
import { openDatabase } from "./db";

export const getHits = async (): Promise<Hit[]> => {
  const db = await openDatabase();
  const hits = await db.getAllAsync<Hit>("SELECT * from hits");
  return hits;
};

export const hitToDeleted = async (objectID: string) => {
  const db = await openDatabase();
  try {
    await db.runAsync(`INSERT INTO deletedHits (objectID) VALUES (?)`, [
      objectID,
    ]);
    await db.runAsync(`DELETE FROM hits WHERE objectID = ?`, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const hitToFavorites = async (objectID: string) => {
  const db = await openDatabase();
  try {
    await db.runAsync(`INSERT INTO favoriteHits (objectID) VALUES (?)`, [
      objectID,
    ]);
    await db.runAsync(`DELETE FROM hits WHERE objectID = ?`, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};
