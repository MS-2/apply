import React from "react";
import { NotificationProvider } from "@/providers/NotificationProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import WebViewScreen from "./screens/webview";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <NotificationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="screens/webview/index" />
        </Stack>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
