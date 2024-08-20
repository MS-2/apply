import { openDatabase } from "./db";

export const clearAllLocalData = async () => {
  const db = await openDatabase();
  const tables = [
    "deleted",
    "favorites",
    "deletedHits",
    "favoriteHits",
    "hits",
  ];
  try {
    for (const table of tables) {
      const result = await db.runAsync(`DELETE FROM ${table}`);
      console.log(
        `All records removed from '${table}' table. Rows affected: ${result.changes}`
      );
    }
  } catch (error) {
    console.error(`Error clearing data from tables: ${error}`);
    throw new Error(`Failed to clear all data: ${error}`);
  }
};
