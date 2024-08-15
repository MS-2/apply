import React, { Suspense, useLayoutEffect } from "react";
import { Text } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationProvider } from "@/providers/NotificationProvider";
import { MutationCache, QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
// import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 2000,
      retry: 0,
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
export default function Page() {


  // useEffect(() => {
  //   const setupDatabase = async () => {
  //     console.log('se ejecuti?')
  //     const db = await SQLite.openDatabaseAsync('databaseName');

  //     // Configuración y creación de la tabla
  //     await db.execAsync(`
  //       PRAGMA journal_mode = WAL;
  //       CREATE TABLE IF NOT EXISTS juan (
  //         id INTEGER PRIMARY KEY NOT NULL,
  //         author TEXT NOT NULL
  //       );
  //     `);

  //     // Insertar datos de ejemplo
  //     await db.runAsync('INSERT INTO juan (author) VALUES (?)', 'John Doe');

  //     // Leer el primer artículo
  //     const firstRow = await db.getFirstAsync('SELECT * FROM juan');
  //     console.log(firstRow);

  //     // Leer todos los artículos
  //     const allRows = await db.getAllAsync('SELECT * FROM juan');
  //     for (const row of allRows) {
  //       console.log(row);
  //     }

  //     // Actualizar un artículo
  //     await db.runAsync('UPDATE juan SET author = ? WHERE id = 4', 'Advanced React Native', firstRow.id);

  //     // Eliminar un artículo
  //     await db.runAsync('DELETE FROM juan WHERE id = 1');
  //   };

  //   setupDatabase();
  // }, []);

  useLayoutEffect(() => {
    const setupDatabase = async () => {
      // console.log('se ejecuti?')
      const db = await SQLite.openDatabaseAsync('test.db');

      // Configuración y creación de la tabla
      // await db.execAsync(`
      //   PRAGMA journal_mode = WAL;
      //   CREATE TABLE IF NOT EXISTS juan (
      //     id INTEGER PRIMARY KEY NOT NULL,
      //     author TEXT NOT NULL
      //   );
      // `);

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

    };

    setupDatabase();
  }, []);

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
