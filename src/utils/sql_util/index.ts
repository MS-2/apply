import { openDatabase } from "@/utils/sql_util/setupDatabase";

export const executeQuery = async <T>(
  query: string,
  params: any[] = []
): Promise<T[]> => {
  const db = await openDatabase();
  try {
    return await db.getAllAsync<T>(query, params);
  } catch (error) {
    console.error("Error executing query:", error);
    return [];
  }
};

// Utilidad para ejecutar comandos como INSERT, DELETE, etc.
export const executeCommand = async (
  command: string,
  params: any[] = []
): Promise<void> => {
  const db = await openDatabase();
  try {
    await db.runAsync(command, params);
  } catch (error) {
    console.error("Error executing command:", error);
  }
};
