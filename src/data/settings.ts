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
          return result;
        });
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

export const countRecordsInTables = async () => {
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
      // Ejecuta una consulta para contar el número de registros en la tabla
      const result = await db.runAsync(
        `SELECT COUNT(*) AS count FROM ${table}`
      );
      console.log(`Table '${table}' has ${result.changes} record(s).`);
    }
  } catch (error) {
    console.error(`Error counting records in tables: ${error}`);
    throw new Error(`Failed to count records in tables: ${error}`);
  }
};
