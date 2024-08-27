import { openDatabase } from "@/utils/sql_util/setupDatabase";

export const createTable = async () => {
  const db = await openDatabase();
  await db.runAsync(
    "CREATE TABLE IF NOT EXISTS hits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );
};

export const insertHit = async (name: string) => {
  const db = await openDatabase();
  await db.runAsync("INSERT INTO hits (name) VALUES (?)", [name]);
};

export const getHits = async () => {
  const db = await openDatabase();
  return db.getAllAsync("SELECT * FROM hits");
};

export const deleteHits = async () => {
  const db = await openDatabase();
  await db.runAsync("DELETE FROM hits");
};

export const dropTable = async () => {
  const db = await openDatabase();
  await db.runAsync("DROP TABLE IF EXISTS hits");
};

// Mock openDatabase and its methods
jest.mock("@/utils/sql_util/setupDatabase", () => ({
  openDatabase: jest.fn(),
}));

describe("Database Utility Functions", () => {
  const mockExecAsync = jest.fn();
  const mockRunAsync = jest.fn();
  const mockGetAllAsync = jest.fn();
  const mockDatabase = {
    runAsync: mockRunAsync,
    getAllAsync: mockGetAllAsync,
    execAsync: mockExecAsync,
  };

  beforeEach(() => {
    (openDatabase as jest.Mock).mockResolvedValue(mockDatabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Table Operations", () => {
    it("should create, insert, retrieve, delete, and drop table", async () => {
      // Test table creation
      await createTable();
      expect(openDatabase).toHaveBeenCalled();
      expect(mockRunAsync).toHaveBeenCalledWith(
        "CREATE TABLE IF NOT EXISTS hits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
      );

      // Test inserting a hit
      await insertHit("Test Hit");
      expect(mockRunAsync).toHaveBeenCalledWith(
        "INSERT INTO hits (name) VALUES (?)",
        ["Test Hit"]
      );

      // Mock retrieval of hits
      const mockHits = [{ id: 1, name: "Test Hit" }];
      mockGetAllAsync.mockResolvedValue(mockHits);

      // Test retrieving hits
      const hits = await getHits();
      expect(mockGetAllAsync).toHaveBeenCalledWith("SELECT * FROM hits");
      expect(hits).toEqual(mockHits);

      // Test deleting hits
      await deleteHits();
      expect(mockRunAsync).toHaveBeenCalledWith("DELETE FROM hits");

      // Test dropping the table
      await dropTable();
      expect(mockRunAsync).toHaveBeenCalledWith("DROP TABLE IF EXISTS hits");
    });
  });
});
