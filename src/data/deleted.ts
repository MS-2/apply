import { Hit } from "@/types/algoliaResponse";
import { openDatabase } from "./db";

export const removeFromDeleted = async (objectID: string) => {
  const db = await openDatabase();
  try {
    await db.runAsync(`DELETE FROM deleted WHERE objectID = ?`, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const getDeletedHits = async (): Promise<Hit[] | []> => {
  try {
    const db = await openDatabase();
    const deletedHits = await db.getAllAsync<Hit>("SELECT * FROM deletedHits");
    return deletedHits || [];
  } catch (error) {
    console.error("Error getting deleted hits:", error);
    return [];
  }
};
