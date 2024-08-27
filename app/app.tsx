import React, { ReactNode, Suspense, useLayoutEffect, useState } from 'react';
import { AppStateStatus, Platform } from 'react-native';
import { NotificationProvider, useNotifications } from '@/providers/NotificationProvider';
import { focusManager, MutationCache, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { SQLiteProvider } from 'expo-sqlite';
import { useAppState } from '@/utils/useAppState';
import { setupDatabase } from '@/utils/sql_util/setupDatabase';
import { UserPreferencesProvider } from '@/providers/UserPreferences';
import { REFETCH_INTERVAL, RETRY, STALE_TIME } from '@/utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";
import { ActivityIndicator } from 'react-native-paper';
import { useOnlineManager } from '@/utils/useOnlineManager';
import OverlayMessage from './overlay';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: STALE_TIME,
            retry: RETRY,
            refetchInterval: REFETCH_INTERVAL,
        }
    },
    mutationCache: new MutationCache({
        onSuccess: async () => {
            const { expoPushToken } = useNotifications();
            if (expoPushToken) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Success",
                        body: "Your mutation was successful!",
                    },
                    trigger: null
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

    const [showOverlay, setShowOverlay] = useState(true);



    const handleCloseOverlay = () => {
        setShowOverlay(false);
    };

    useLayoutEffect(() => {
        const checkOverlayShown = async () => {
            const overlayShown = await AsyncStorage.getItem('@overlay_shown');
            if (!overlayShown) {
                setShowOverlay(true);
            }
        };

        checkOverlayShown();
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
            <Suspense fallback={<ActivityIndicator animating size="large" />}>
                <SQLiteProvider databaseName="test.db" useSuspense>
                    <NotificationProvider>
                        <UserPreferencesProvider>
                            {showOverlay && <OverlayMessage onClose={handleCloseOverlay} />}
                            {children}
                        </UserPreferencesProvider>
                    </NotificationProvider>
                </SQLiteProvider>
            </Suspense>
        </PersistQueryClientProvider>
    );
}
