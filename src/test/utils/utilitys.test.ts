import { filterHitsByPreferences, sanitizeResponse } from "@/utils/utilitys";
import { mockHits } from "../__const__/mocks";

describe("Utility Functions", () => {
  it("sanitizeResponse removes duplicates based on story_title", () => {
    // expectInput
    const input = mockHits;

    // expectOutput
    const expectedOutput = [
      input[0], // First "React Native Basics"
      input[1], // "Understanding TypeScript"
    ];

    // result
    const result = sanitizeResponse(input);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedOutput);
    expect(result).toHaveLength(2); // Verifies that one duplicate was removed
  });

  it("filterHitsByPreferences filters hits based on preferences", () => {
    // expectInput
    const preferences = ["react native"];
    const input = mockHits;

    // expectOutput
    const expectedOutput = [
      input[0], // "React Native Basics"
      input[2], // Duplicate of "React Native Basics"
    ];

    // result
    const result = filterHitsByPreferences(input, preferences);

    // Assert the result matches the expected output
    expect(result).toEqual(expectedOutput);
    expect(result).toHaveLength(2); // Verifies that both matching hits are returned
  });
});
