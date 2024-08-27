import * as SQLite from "expo-sqlite";

// SQL Queries
const PRAGMA_JOURNAL_MODE = "PRAGMA journal_mode = WAL;";
const CREATE_HITS_TABLE = `
  CREATE TABLE IF NOT EXISTS hits (
    id INTEGER PRIMARY KEY,
    objectID TEXT,
    author TEXT,
    created_at TEXT,
    story_id TEXT,
    story_title TEXT,
    story_url TEXT
  );
`;

const CREATE_FAVORITES_TABLE = `
  CREATE TABLE IF NOT EXISTS favorites (
    objectID TEXT,
    author TEXT,
    created_at TEXT,
    story_id TEXT,
    story_title TEXT,
    story_url TEXT
  );
`;

const CREATE_DELETED_TABLE = `
  CREATE TABLE IF NOT EXISTS deleted (
    objectID TEXT,
    author TEXT,
    created_at TEXT,
    story_id TEXT,
    story_title TEXT,
    story_url TEXT
  );
`;

export const openDatabase = async () => {
  return SQLite.openDatabaseAsync("test.db");
};

export const setupDatabase = async () => {
  const db = await openDatabase();
  // Execute all SQL commands in a single execAsync call
  await db.execAsync(`
    ${PRAGMA_JOURNAL_MODE}
    ${CREATE_HITS_TABLE}
    ${CREATE_FAVORITES_TABLE}
    ${CREATE_DELETED_TABLE}
  `);
};
