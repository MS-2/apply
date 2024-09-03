import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScreenWrapper } from '@/components/ScreensWrapper';

const ErrorScreen: React.FC = () => (
    <ScreenWrapper>
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F8F9FA',
        }}>
            <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
            <Text style={{ marginTop: 20, marginBottom: 10, fontWeight: "bold" }} variant='headlineMedium'>Oops! Something went wrong.</Text>
            <Button mode="contained" onPress={() => router.push('(tabs)')}>
                Back
            </Button>
        </View>
    </ScreenWrapper>
);


export default ErrorScreen