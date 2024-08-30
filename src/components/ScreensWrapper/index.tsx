import React from 'react';
import { SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from "@react-navigation/elements";
import { useUserPreferencesContext } from '@/providers/UserPreferences';

export const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const headerHeight = useHeaderHeight();
    const { themeColors } = useUserPreferencesContext();
    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={themeColors.screenBackgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
};
