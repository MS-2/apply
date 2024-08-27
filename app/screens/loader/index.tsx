import React, { useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { ScreenWrapper } from '@/components/ScreensWrapper';
const LoadingScreen: React.FC = () => {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.goBack();
        }, 300);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <ScreenWrapper>
            <ActivityIndicator size="large" animating color="#FFF" />
        </ScreenWrapper>
    );
};

export default LoadingScreen;
