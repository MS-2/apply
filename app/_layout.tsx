import { NotificationProvider } from "@/providers/NotificationProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

const queryClient = new QueryClient();

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <NotificationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
