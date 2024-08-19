import { Hit } from "@/types/algoliaResponse";
import * as SQLite from "expo-sqlite";

export const getHits = async () => {
  const db = await SQLite.openDatabaseAsync("test.db");
  const hits = await db.getAllAsync<Hit>("SELECT * from hits");
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
      console.log(
        `Elemento con objectID: ${objectID} agregado o reemplazado en la tabla favorites`
      );
    } else {
      console.log(
        `No se encontró ningún elemento con objectID: ${objectID} en la tabla hits`
      );
    }
  } catch (error) {
    console.error(
      "Error al insertar o reemplazar el elemento en la tabla favorites:",
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
