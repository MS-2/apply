import { queryClient } from "@/../app/app";
import { openDatabase } from "./setupDatabase";

// Constantes SQL
const DELETE_FROM_TABLE = (table: string) => `DELETE FROM ${table}`;

export const clearAllLocalData = async () => {
  const tables = ["deleted", "favorites", "hits"];
  const db = await openDatabase();
  try {
    for (const table of tables) {
      const result = await db.runAsync(DELETE_FROM_TABLE(table));
      console.log(
        `All records removed from '${table}' table. Rows affected: ${result.changes} clear cache`
      );
    }
    queryClient.clear();
    console.log("Cache cleared");
  } catch (error) {
    console.error(`Error clearing data from tables: ${error}`);
    throw new Error(`Failed to clear all data: ${error}`);
  }
};
