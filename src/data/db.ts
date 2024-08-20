import * as SQLite from "expo-sqlite";

export const openDatabase = async () => {
  return SQLite.openDatabaseAsync("test.db");
};
