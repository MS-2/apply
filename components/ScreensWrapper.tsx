import React from 'react';
import { SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderHeight } from "@react-navigation/elements";

const ScreenWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const headerHeight = useHeaderHeight();
    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={['#FFFF00', '#0000FF', '#2f1b1b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
};

export default ScreenWrapper;
