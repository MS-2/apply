import { Hit } from "@/types/algoliaResponse";
import * as SQLite from "expo-sqlite";

export const getHits = async () => {
  const db = await SQLite.openDatabaseAsync("test.db");
  const hits = await db.getAllAsync<Hit>("SELECT * from hits");
  return hits;
};

export const getDeletedHits = async () => {
  const db = await SQLite.openDatabaseAsync("test.db");
  const hits = await db.getAllAsync<Hit>("SELECT * FROM deleted");
  return hits;
};

export const clearAllData = async () => {
  const db = await SQLite.openDatabaseAsync("test.db");

  try {
    // Eliminar todos los datos de la tabla 'deleted'
    const resultDeleted = await db.runAsync(`DELETE FROM deleted`);
    console.log(
      `All records removed from 'deleted' table. Rows affected: ${resultDeleted.changes}`
    );

    // Eliminar todos los datos de la tabla 'favorites'
    const resultFavorites = await db.runAsync(`DELETE FROM favorites`);
    console.log(
      `All records removed from 'favorites' table. Rows affected: ${resultFavorites.changes}`
    );

    const resultDeletedHits = await db.runAsync(`DELETE FROM deletedHits`);
    console.log(
      `All records removed from 'deletedHits' table. Rows affected: ${resultDeletedHits.changes}`
    );
    const resultFavoriteHits = await db.runAsync(`DELETE FROM favoriteHits`);
    console.log(
      `All records removed from 'resultFavoriteHits' table. Rows affected: ${resultFavoriteHits.changes}`
    );

    // Eliminar todos los datos de la tabla 'hits'
    const resultHits = await db.runAsync(`DELETE FROM hits`);
    console.log(
      `All records removed from 'hits' table. Rows affected: ${resultHits.changes}`
    );
  } catch (error) {
    console.error("Error clearing data from tables:", error);
  }
};
//______________________________________________________________________________________
export const removeHitFromFeedSimple = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");

  try {
    await db.runAsync(`INSERT INTO deletedHits (objectID) VALUES (?)`, [
      objectID,
    ]);
    await db.runAsync(`DELETE FROM hits WHERE objectID = ?`, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const removeDeletedSimple = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");
  try {
    await db.runAsync(`DELETE FROM deletedHits WHERE objectID = ?`, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const addHitToFavoritesFromFeedSimple = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");

  try {
    // Insertar en la tabla deletedHits
    await db.runAsync(`INSERT INTO favoriteHits (objectID) VALUES (?)`, [
      objectID,
    ]);

    // Eliminar de la tabla hits
    await db.runAsync(`DELETE FROM hits WHERE objectID = ?`, [objectID]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

export const removeFavoritesSimple = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");
  try {
    await db.runAsync(`DELETE FROM favoriteHits WHERE objectID = ?`, [
      objectID,
    ]);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

//______________________________________________________________________________________
