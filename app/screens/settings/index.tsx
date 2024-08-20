import React, { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { Button, Switch, Text, Dialog, Portal, Paragraph, Provider, Snackbar } from 'react-native-paper';
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { UserPreferencesProvider, useUserPreferencesContext } from "@/providers/UserPreferences";
import { useNotifications } from "@/providers/NotificationProvider";
import { clearAllLocalData } from "@/data/settings";

export default () => (
    <UserPreferencesProvider>
        <Provider>
            <Settings />
        </Provider>
    </UserPreferencesProvider>
);

const Settings: React.FC = () => {
    const { selectedPreferences, togglePreference } = useUserPreferencesContext();
    const { notification, setNotification } = useNotifications();
    const [visible, setVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    const showSnackbar = () => setSnackbarVisible(true);
    const hideSnackbar = () => setSnackbarVisible(false);
    const handleRestoreTips = () => {
        console.log("Tips restored");
    };
    const confirmClearLocalData = async () => {
        hideDialog();
        try {
            await clearAllLocalData();
            showSnackbar();
        } catch (error) {
            console.error("Error clearing local data:", error);
        }
    };

    const handleToggleNotifications = () => {
        // Implement logic to toggle off notifications
        console.log("Notifications toggled", setNotification((prev: boolean) => !prev));
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>Android Notifications</Text>
                    <Switch
                        value={selectedPreferences.includes("android")}
                        onValueChange={() => togglePreference("android")}
                        style={styles.toggle}
                        accessibilityLabel="Toggle Android notifications"
                        accessibilityHint="Includes Android notifications in the selection"
                    />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>iOS Notifications</Text>
                    <Switch
                        value={selectedPreferences.includes("ios")}
                        onValueChange={() => togglePreference("ios")}
                        style={styles.toggle}
                        accessibilityLabel="Toggle iOS notifications"
                        accessibilityHint="Includes iOS notifications in the selection"
                    />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>Turn off all notifications.</Text>
                    <Switch
                        value={!notification} // This value should be managed based on the notification state
                        onValueChange={handleToggleNotifications}
                        style={styles.toggle}
                        accessibilityLabel="Toggle notifications"
                        accessibilityHint="Disables or enables all notifications"
                    />
                </View>
                <Button
                    mode="outlined"
                    onPress={showDialog}
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
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={hideSnackbar}
                    duration={3000}
                    action={{ label: 'Undo' }}>
                    Local data has been cleared!
                </Snackbar>
                <Portal>
                    <Dialog visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title>Confirm Deletion</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph>Are you sure you want to delete all local data? This action cannot be undone.</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={hideDialog}>Cancel</Button>
                            <Button onPress={confirmClearLocalData}>Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </ScreenWrapper>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        backgroundColor: '#333', // DarkDark background to contrast with white text
    },
    button: {
        marginVertical: 10,
        width: '100%',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    label: {
        fontSize: 18,
        marginRight: 10,
        color: '#fff', // White text color
    },
    toggle: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
});
