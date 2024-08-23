import React, { ReactNode, Suspense, useLayoutEffect } from 'react';
import { AppStateStatus, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationProvider, useNotifications } from '@/providers/NotificationProvider';
import { focusManager, MutationCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { SQLiteProvider } from 'expo-sqlite';
import { useOnlineManager } from '@/hooks/useOnlineManager';
import { useAppState } from '@/hooks/useAppState';
import { setupDatabase } from '@/data/setupDatabase';
import { Text } from 'react-native'
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from "expo-notifications";
import { UserPreferencesProvider } from '@/providers/UserPreferences';
import { STALE_TIME } from '@/constants';
// SplashScreen.preventAutoHideAsync();

export const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: STALE_TIME, } },
    mutationCache: new MutationCache({
        onSuccess: async () => {
            const { expoPushToken } = useNotifications();
            if (expoPushToken) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Success",
                        body: "Your mutation was successful!",
                    },
                    trigger: null, // Envía la notificación inmediatamente
                });
            }
        },
        onError: async (error) => {
            const { expoPushToken } = useNotifications();
            if (expoPushToken) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Error",
                        body: error.message || "An error occurred",
                    },
                    trigger: null, // Envía la notificación inmediatamente
                });
            }
        },
    }),
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

const onAppStateChange = (status: AppStateStatus) => {
    if (Platform.OS !== 'web') {
        focusManager.setFocused(status === 'active');
    }
};

type AppProvidersProps = {
    children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
    useLayoutEffect(() => {
        setupDatabase();
    }, []);

    useOnlineManager();
    useAppState(onAppStateChange);
    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
            onSuccess={() => {
                // resume mutations after initial restore from AsyncStorage was successful
                queryClient.resumePausedMutations().then(() => {
                    queryClient.invalidateQueries()
                })
            }}>
            <Suspense fallback={<Text>Loading...</Text>}>
                <SQLiteProvider databaseName="test.db">
                    <NotificationProvider>
                        <UserPreferencesProvider>
                            {children}
                        </UserPreferencesProvider>
                    </NotificationProvider>
                </SQLiteProvider>
            </Suspense>
        </PersistQueryClientProvider>
    );
}
