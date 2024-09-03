import React from 'react';
import { SafeAreaView, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from "@react-navigation/elements";
import { useUserPreferencesContext } from '@/providers/UserPreferences';
type ScreenWrapperProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
    const headerHeight = useHeaderHeight();
    const { themeColors } = useUserPreferencesContext();
    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={themeColors.screenBackgroundGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={[{ flex: 1, paddingTop: headerHeight }, style]}>
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
};
