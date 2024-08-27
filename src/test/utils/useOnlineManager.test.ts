import * as React from "react";
import { act, renderHook } from "@testing-library/react-native";
import { useOnlineManager } from "@/utils/useOnlineManager";

// Mock NetInfo and onlineManager
jest.mock("@react-native-community/netinfo", () => ({
  addEventListener: jest.fn(),
}));
jest.mock("@tanstack/react-query", () => ({
  onlineManager: {
    setOnline: jest.fn(),
  },
}));

describe("useOnlineManager", () => {
  it("should call onlineManager.setOnline when NetInfo state changes", () => {
    const { addEventListener } = require("@react-native-community/netinfo");
    const { setOnline } = require("@tanstack/react-query").onlineManager;

    // Mock the NetInfo event listener callback
    const mockListenerCallback = jest.fn();
    addEventListener.mockImplementation((callback: any) => {
      mockListenerCallback.mockImplementation(callback);
      return () => {}; // Mock the cleanup function
    });

    // Render hook
    renderHook(() => useOnlineManager());

    // Simulate a NetInfo state change
    act(() => {
      mockListenerCallback({
        isConnected: true,
        isInternetReachable: true,
      });
    });

    // Assert that setOnline was called with the expected arguments
    expect(setOnline).toHaveBeenCalledWith(true);

    // Test when connection is lost
    act(() => {
      mockListenerCallback({
        isConnected: false,
        isInternetReachable: false,
      });
    });

    expect(setOnline).toHaveBeenCalledWith(false);
  });
});
