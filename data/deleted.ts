import { openDatabase } from "./db";

export const removeFromDeleted = async (objectID: string) => {
  const db = await openDatabase();
  try {
    await db.runAsync(`DELETE FROM deletedHits WHERE objectID = ?`, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};
