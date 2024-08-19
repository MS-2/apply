import React, { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { Button, Switch, Text } from 'react-native-paper';
import ScreenWrapper from "@/components/ScreensWrapper";
import { UserPreferencesProvider, useUserPreferencesContext } from "@/providers/UserPreferences";
import { useNotifications } from "@/providers/NotificationProvider";

export default () => (
    <UserPreferencesProvider>
        <Settings />
    </UserPreferencesProvider>
);

const Settings: React.FC = () => {

    const { selectedPreferences, togglePreference } = useUserPreferencesContext();

    const handleDeleteLocalData = () => {
        console.log("Local data deleted");
    };

    const handleRestoreTips = () => {
        console.log("Tips restored");
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>

                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>Android</Text>
                    <Switch
                        value={selectedPreferences.includes("android")}
                        onValueChange={() => togglePreference("android")}
                        style={styles.toggle}
                        accessibilityLabel="Toggle Android"
                        accessibilityHint={`Includes Android platform in the selection`}
                    />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>iOS</Text>
                    <Switch
                        value={selectedPreferences.includes("ios")}
                        onValueChange={() => togglePreference("ios")}
                        style={styles.toggle}
                        accessibilityLabel="Toggle iOS"
                        accessibilityHint={`Includes iOS platform in the selection`}
                    />
                </View>
                <Button
                    mode="outlined"
                    onPress={handleDeleteLocalData}
                    style={styles.button}
                    accessibilityLabel="Delete local data"
                    accessibilityHint="Deletes all locally stored data"
                >
                    Delete Local Data
                </Button>

                <Button
                    mode="outlined"
                    onPress={handleRestoreTips}
                    style={styles.button}
                    accessibilityLabel="Restore tips"
                    accessibilityHint="Restores tutorial tips"
                >
                    Restore Tips
                </Button>



            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    button: {
        marginVertical: 10,
        width: '100%',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    label: {
        fontSize: 18,
        marginRight: 10,
        color: '#000',
    },
    toggle: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
});

