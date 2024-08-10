import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationProvider } from "@/providers/NotificationProvider";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
// import * as SplashScreen from 'expo-splash-screen';

// SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
export default function Page() {


  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <StatusBar style="auto" />
      <NotificationProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{
            headerBlurEffect: "regular",
            headerTitle: "Mobile News",
            headerTitleAlign: "center",
            headerTransparent: true,
            headerLargeTitle: true,
            headerLargeTitleStyle: { color: 'purple' },
            headerLargeTitleShadowVisible: false
          }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="screens/webview/index" />
        </Stack>
      </NotificationProvider>
    </PersistQueryClientProvider>
  );
}
