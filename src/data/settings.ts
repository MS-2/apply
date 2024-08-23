import { queryClient } from "@/../app/app";
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
      const result = await db
        .runAsync(`DELETE FROM ${table}`)
        .then((result) => {
          queryClient.clear();
          return result;
        });
      console.log(
        `All records removed from '${table}' table. Rows affected: ${result.changes} clear cache`
      );
    }
  } catch (error) {
    console.error(`Error clearing data from tables: ${error}`);
    throw new Error(`Failed to clear all data: ${error}`);
  }
};
