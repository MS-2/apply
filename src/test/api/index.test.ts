import { sanitizeResponse } from "@/utils/utilitys";
import { sendNotification } from "@/utils/notifications/sendNotification";
import { saveHits } from "@/hooks/MainScreen/data";
import { fetchData } from "@/api/fetchAlgoliaData";

jest.mock("@/utils/utilitys", () => ({
  sanitizeResponse: jest.fn(),
}));

jest.mock("@/utils/notifications/sendNotification", () => ({
  sendNotification: jest.fn(),
}));

jest.mock("@/hooks/MainScreen/data", () => ({
  saveHits: jest.fn(),
}));

describe("fetchData", () => {
  const mockResponse = {
    hits: [
      { objectID: "1", title: "Test 1", url: "https://test1.com" },
      { objectID: "2", title: "Test 2", url: "https://test2.com" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );
  });

  it("should return more than 0 hits", async () => {
    // Mock sanitizeResponse to return the hits as sanitized
    (sanitizeResponse as jest.Mock).mockReturnValue(mockResponse.hits);

    const userPreferences = ["mobile"];
    const result = await fetchData(1, userPreferences);

    expect(result.length).toBeGreaterThan(0); // Ensure the returned array has elements

    // Verify mocks were called
    expect(sanitizeResponse).toHaveBeenCalledWith(mockResponse.hits);
    expect(sendNotification).toHaveBeenCalledWith({
      hits: mockResponse.hits,
      selectedPreferences: userPreferences,
    });
    expect(saveHits).toHaveBeenCalledWith(mockResponse.hits);
  });
});
