// import React from "react";
// import { WebView } from 'react-native-webview';
// import { useLocalSearchParams } from 'expo-router';
// import { HighlightResult } from "@/types/algoliaResponse";

// const WebViewScreen = () => {
//     const { value } = useLocalSearchParams<HighlightResult>()
//     return <WebView source={{ uri: value }} />;
// };

// export default WebViewScreen;
import React from "react";
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { HighlightResult } from "@/types/algoliaResponse";
const WebViewScreen = () => {
    const { value } = useLocalSearchParams<HighlightResult>();

    if (!value || typeof value !== 'string') {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Invalid URL or missing parameters.</Text>
            </View>
        );
    }

    return (
        <WebView
            source={{ uri: value }}
            startInLoadingState
            renderLoading={() => (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            renderError={(errorName) => (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Failed to load the page: {errorName}</Text>
                </View>
            )}
        />
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
