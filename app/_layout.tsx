import React, { Suspense, useLayoutEffect } from "react";
import { AppStateStatus, Platform, Text } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationProvider } from "@/providers/NotificationProvider";
import { focusManager, MutationCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

import { SQLiteProvider } from 'expo-sqlite';
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { useAppState } from "@/hooks/useAppState";
import { setupDatabase } from "@/data/setupDatabase";
// import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 2000,
      retry: 2,
    },
  },
  // configure global cache callbacks to show toast notifications
  mutationCache: new MutationCache({
    onSuccess: (data) => {
      alert(data)
      // toast.success(data.message)
    },
    onError: (error) => {
      alert(error.message)
      // toast.error(error.message)
    },
  }),
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

const onAppStateChange = (status: AppStateStatus) => {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active')
  }
}




export default function Page() {

  useLayoutEffect(() => {
    setupDatabase();
  }, []);


  useOnlineManager()

  useAppState(onAppStateChange)
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: asyncStoragePersister }}>
      <Suspense fallback={<Text>Loading...</Text>}>
        <SQLiteProvider databaseName="test.db">
          <StatusBar style="auto" />
          <NotificationProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{
                headerBlurEffect: "regular",
                headerTitle: "Mobile News",
                headerTitleAlign: "center",
                headerTransparent: true,
                headerLargeTitle: true,
                headerLargeTitleShadowVisible: false
              }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="screens/webview/index" />
            </Stack>
          </NotificationProvider>
        </SQLiteProvider>
      </Suspense>
    </PersistQueryClientProvider >

  );
}
