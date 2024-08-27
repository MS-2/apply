import React from "react";
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { HighlightResult } from "@/types/algoliaResponse";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { ActivityIndicator, Text } from "react-native-paper";
const WebViewScreen = () => {
    const { value } = useLocalSearchParams<HighlightResult>();

    if (!value || typeof value !== 'string') {
        return (
            <ScreenWrapper>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Invalid URL or missing parameters.</Text>
                </View>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <WebView
                source={{ uri: value }}
                startInLoadingState
                renderLoading={() => (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator animating size="large" />
                    </View>
                )}
                renderError={(errorName) => (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Failed to load the page: {errorName}</Text>
                    </View>
                )}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default WebViewScreen;
