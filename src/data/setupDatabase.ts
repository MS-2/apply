import * as SQLite from "expo-sqlite";

export const openDatabase = async () => {
  return SQLite.openDatabaseAsync("test.db");
};

export const setupDatabase = async () => {
  const db = await openDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS hits (
      id INTEGER PRIMARY KEY,
      objectID TEXT ,
      author TEXT,
      created_at TEXT,
      created_at_i TEXT,
      parent_id TEXT,
      story_id TEXT,
      story_title TEXT,
      story_url TEXT,
      updated_at TEXT
    );
  `);

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS favorites (
      objectID TEXT PRIMARY KEY NOT NULL,
      author TEXT,
      comment_text TEXT,
      created_at TEXT,
      created_at_i TEXT,
      parent_id TEXT,
      story_id TEXT,
      story_title TEXT,
      story_url TEXT,
      updated_at TEXT
    );
  `);

  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS deleted (
    objectID TEXT PRIMARY KEY NOT NULL,
    author TEXT,
    created_at TEXT,
    story_id TEXT,
    story_title TEXT,
    story_url TEXT,
  );
  `);
};
