import { renderHook, act } from "@testing-library/react-native";
import { useAppState } from "@/utils/useAppState";

// Mock AppState
jest.mock("react-native", () => ({
  AppState: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

describe("useAppState", () => {
  it("should call onChange when app state changes", () => {
    const { addEventListener } = require("react-native").AppState;
    const mockOnChange = jest.fn();

    const mockListenerCallback = jest.fn();
    addEventListener.mockImplementation((_event: unknown, callback: any) => {
      mockListenerCallback.mockImplementation(callback);
      return { remove: jest.fn() }; // Mock the remove function
    });

    // Render hook
    renderHook(() => useAppState(mockOnChange));

    act(() => {
      mockListenerCallback("background"); // or any other AppStateStatus
    });

    expect(mockOnChange).toHaveBeenCalledWith("background");
  });

  it("should remove event listener on cleanup", () => {
    const { addEventListener } = require("react-native").AppState;
    const mockRemove = jest.fn();
    addEventListener.mockImplementation(() => ({ remove: mockRemove }));

    // Render hook and clean up
    const { unmount } = renderHook(() => useAppState(() => {}));
    unmount();

    // Assert that remove was called on cleanup
    expect(mockRemove).toHaveBeenCalled();
  });
});
