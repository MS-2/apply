import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo

type ErrorScreen = {
    error?: Error | null;
    onRetry: () => {};
}

export const ErrorScreen = ({ error, onRetry }: ErrorScreen) => {
    return (
        <View style={styles.container}>
            <Ionicons name="alert-circle" size={64} color="#FF6B6B" />
            <Text style={styles.errorText}>Oops! Something went wrong.</Text>
            <Text style={styles.messageText}>{error?.message}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 20,
    },
    errorText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#343A40',
        marginTop: 20,
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#6C757D',
        textAlign: 'center',
        marginBottom: 30,
    },
    retryButton: {
        backgroundColor: '#4DABF7',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
