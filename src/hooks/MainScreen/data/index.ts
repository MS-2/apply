import { openDatabase } from "@/utils/sql_util/setupDatabase";
import { Hit } from "@/types/algoliaResponse";

// SQL Queries as constants
const SQL_INSERT_HIT = `INSERT or REPLACE INTO hits (id, objectID, author, created_at, story_id, story_title, story_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;

const SQL_SELECT_HITS = `SELECT * from hits`;

const SQL_INSERT_FAVORITE = `INSERT INTO favorites (objectID, author, created_at, story_id, story_title, story_url) VALUES (?, ?, ?, ?, ?, ?)`;

const SQL_DELETE_HIT = `DELETE FROM hits WHERE objectID = ?`;

const SQL_INSERT_DELETED = `INSERT INTO deleted (objectID, author, created_at, story_id, story_title, story_url) VALUES (?, ?, ?, ?, ?, ?)`;

// Functions using the constants
export const getHits = async (): Promise<Hit[]> => {
  const db = await openDatabase();
  try {
    const hits = await db.getAllAsync<Hit>(SQL_SELECT_HITS);
    return hits;
  } catch (error) {
    console.error("Error fetching hits:", error);
    // Optionally, you can return an empty array or rethrow the error depending on your needs
    return [];
    // throw error;
  }
};
export const saveHits = async (hits: Hit[]) => {
  const db = await openDatabase();
  try {
    for (const hit of hits) {
      await db.runAsync(SQL_INSERT_HIT, [
        null,
        hit.objectID,
        hit.author,
        hit.created_at,
        hit.story_id,
        hit.story_title,
        hit.story_url,
      ]);
    }
  } catch (error) {
    console.error("Error saving hits:", error);
  }
};

export const addToFavorites = async (hit: Hit) => {
  const db = await openDatabase();
  try {
    db.runAsync(SQL_INSERT_FAVORITE, [
      hit.objectID,
      hit.author,
      hit.created_at,
      hit.story_id,
      hit.story_title,
      hit.story_url,
    ]);
    await db.runAsync(SQL_DELETE_HIT, [hit.objectID]);
  } catch (error) {
    console.error("Error saving to favorites:", error);
  }
};

export const addToDeletes = async (hit: Hit) => {
  const db = await openDatabase();
  try {
    db.runAsync(SQL_INSERT_DELETED, [
      hit.objectID,
      hit.author,
      hit.created_at,
      hit.story_id,
      hit.story_title,
      hit.story_url,
    ]);
    await db.runAsync(SQL_DELETE_HIT, [hit.objectID]);
  } catch (error) {
    console.error("Error saving to deleted:", error);
  }
};
