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

export const addHitToFavorites = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");
  try {
    const hit = await db.getFirstAsync<Hit>(
      `SELECT * FROM hits WHERE objectID = ?`,
      objectID
    );

    if (hit) {
      await db.runAsync(
        `INSERT OR REPLACE INTO favorites (
            objectID, author, comment_text, created_at, created_at_i, 
            parent_id, story_id, story_title, story_url, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hit.objectID,
          hit.author,
          hit.comment_text,
          hit.created_at,
          hit.created_at_i,
          hit.parent_id,
          hit.story_id,
          hit.story_title,
          hit.story_url,
          hit.updated_at,
        ]
      );
      await db.runAsync(`DELETE FROM hits WHERE objectID = ?`, objectID);

      console.log(
        `Elemento con objectID: ${objectID} agregado a 'favorites' y eliminado de 'hits'`
      );
    } else {
      console.log(
        `No se encontró ningún elemento con objectID: ${objectID} en la tabla 'hits'`
      );
    }
  } catch (error) {
    console.error(
      "Error al insertar el elemento en 'favorites' o al eliminarlo de 'hits':",
      error
    );
  }
};

export const removeHitFromFavorites = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");
  try {
    const result = await db.runAsync(
      `DELETE FROM favorites WHERE objectID = ?`,
      objectID
    );

    if (result.changes > 0) {
      console.log(`Item with objectID: ${objectID} removed from favorites`);
    } else {
      console.log(`No item with objectID: ${objectID} found in favorites`);
    }
  } catch (error) {
    console.error("Error removing item from favorites:", error);
  }
};

export const removeHitFromDeleted = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");
  try {
    const result = await db.runAsync(
      `DELETE FROM deleted WHERE objectID = ?`,
      objectID
    );

    if (result.changes > 0) {
      console.log(`Item with objectID: ${objectID} deleted`);
    } else {
      console.log(`No item with objectID: ${objectID} deleted`);
    }
  } catch (error) {
    console.error("Error removing item from deleted:", error);
  }
};

export const removeHitFromFeed = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync("test.db");
  try {
    const hit = await db.getFirstAsync<Hit>(
      `SELECT * FROM hits WHERE objectID = ?`,
      objectID
    );
    if (hit) {
      await db.runAsync(
        `INSERT INTO deleted (
            objectID, author, comment_text, created_at, created_at_i, 
            parent_id, story_id, story_title, story_url, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hit.objectID,
          hit.author,
          hit.comment_text,
          hit.created_at,
          hit.created_at_i,
          hit.parent_id,
          hit.story_id,
          hit.story_title,
          hit.story_url,
          hit.updated_at,
        ]
      );
      const result = await db.runAsync(
        `DELETE FROM hits WHERE objectID = ?`,
        objectID
      );

      if (result.changes > 0) {
        console.log(
          `Item with objectID: ${objectID} removed from hits and added to deleted.`
        );
      } else {
        console.log(`No item with objectID: ${objectID} found in hits.`);
      }
    } else {
      console.log(`No item with objectID: ${objectID} found in hits.`);
    }
  } catch (error) {
    console.error(
      "Error removing item from hits and adding it to deleted:",
      error
    );
  }
};

export const saveHitsToFeed = async (db: any, hits: Hit[]) => {
  for (const hit of hits) {
    await db.runAsync(
      `INSERT OR REPLACE INTO hits (
        objectID, author, comment_text, created_at, created_at_i, 
        parent_id, story_id, story_title, story_url, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hit.objectID,
        hit.author,
        hit.comment_text,
        hit.created_at,
        hit.created_at_i,
        hit.parent_id,
        hit.story_id,
        hit.story_title,
        hit.story_url,
        hit.updated_at,
      ]
    );
  }
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
