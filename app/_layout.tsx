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
import * as SQLite from 'expo-sqlite';
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { useAppState } from "@/hooks/useAppState";
import { Hit } from "@/types/algoliaResponse";
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

const setupDatabase = async () => {
  // console.log('se ejecuti?')
  const db = await SQLite.openDatabaseAsync('test.db');

  await db.execAsync(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS hits (
    objectID TEXT PRIMARY KEY NOT NULL,
    author TEXT,
    comment_text TEXT,
    created_at TEXT,
    created_at_i TEXT,
    parent_id TEXT,
    story_id TEXT,
    story_title TEXT,
    story_url TEXT,
    updated_at TEXT
  );
`);

  await db.execAsync(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS favorites (
  objectID TEXT PRIMARY KEY NOT NULL,
  author TEXT,
  comment_text TEXT,
  created_at TEXT,
  created_at_i TEXT,
  parent_id TEXT,
  story_id TEXT,
  story_title TEXT,
  story_url TEXT,
  updated_at TEXT
);
`);

};


export const addHitToFavorites = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync('test.db');
  console.log(objectID)
  try {
    const hit = await db.getFirstAsync<Hit>(`SELECT * FROM hits WHERE objectID = ?`, objectID);

    if (hit) {
      // Insertar o reemplazar en la tabla 'favorites'
      await db.runAsync(
        `INSERT OR REPLACE INTO favorites (
          objectID, author, comment_text, created_at, created_at_i, 
          parent_id, story_id, story_title, story_url, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          hit.objectID,
          hit.author,
          hit.comment_text,
          hit.created_at,
          hit.created_at_i,
          hit.parent_id,
          hit.story_id,
          hit.story_title,
          hit.story_url,
          hit.updated_at,
        ]
      );
      console.log(`Elemento con objectID: ${objectID} agregado o reemplazado en la tabla favorites`);
    } else {
      console.log(`No se encontró ningún elemento con objectID: ${objectID} en la tabla hits`);
    }
    // if (hit) {

    //   console.log(`Elemento con objectID: ${objectID} agregado en la tabla favorites : === ${hit.author}`);
    // } else {
    //   console.log(`No se encontró ningún elemento con objectID: ${objectID} en la tabla hits`);
    // }
  } catch (error) {
    console.error("Error al insertar o reemplazar el elemento en la tabla favorites:", error);
  }
};

export const removeHitFromFavorites = async (objectID: string) => {
  const db = await SQLite.openDatabaseAsync('test.db');
  try {
    const result = await db.runAsync(`DELETE FROM favorites WHERE objectID = ?`, objectID);

    if (result.changes > 0) {
      console.log(`Item with objectID: ${objectID} removed from favorites`);
    } else {
      console.log(`No item with objectID: ${objectID} found in favorites`);
    }
  } catch (error) {
    console.error("Error removing item from favorites:", error);
  }
};

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
