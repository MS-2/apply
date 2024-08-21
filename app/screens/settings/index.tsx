import React, { useState } from "react";
import { View, StyleSheet } from 'react-native';
import { Button, Switch, Text, Dialog, Portal, Paragraph, Snackbar } from 'react-native-paper';
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useUserPreferencesContext } from "@/providers/UserPreferences";
import { useNotifications } from "@/providers/NotificationProvider";
import { clearAllLocalData } from "@/data/settings";

const Settings: React.FC = () => {
    const { selectedPreferences, togglePreference, theme, setTheme } = useUserPreferencesContext();
    const { notification, setNotification } = useNotifications();
    const [visible, setVisible] = useState(false);
    const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
    const showSnackbar = (message: string) => setSnackbar({ visible: true, message });
    const toggleDialog = () => setVisible(!visible);
    const handleToggleNotifications = () => {
        setNotification(!notification);
        showSnackbar(notification ? "Notifications Turn Off!" : "Notifications Turn On!");
    };
    const handleToggleTheme = () => setTheme(theme === 'vene' ? 'default' : 'vene');
    const confirmClearLocalData = async () => {
        toggleDialog();
        try {
            await clearAllLocalData();
            showSnackbar("Local data has been cleared!");
        } catch {
            showSnackbar("Error clearing local data");
        }
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {[
                    { label: "Android Notifications", pref: "android" },
                    { label: "iOS Notifications", pref: "ios" }
                ].map(({ label, pref }) => (
                    <View key={pref} style={styles.toggleContainer}>
                        <Text style={styles.label}>{label}</Text>
                        <Switch
                            value={selectedPreferences.includes(pref)}
                            onValueChange={() => togglePreference(pref)}
                            style={styles.toggle}
                        />
                    </View>
                ))}
                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>Turn off all notifications.</Text>
                    <Switch
                        value={!notification}
                        onValueChange={handleToggleNotifications}
                        style={styles.toggle}
                    />
                </View>
                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>Venezuelan Theme</Text>
                    <Switch
                        value={theme === 'vene'}
                        onValueChange={handleToggleTheme}
                        style={styles.toggle}
                    />
                </View>
                <Button mode="outlined" onPress={toggleDialog} style={styles.button}>
                    Delete Local Data
                </Button>

                <Snackbar
                    visible={snackbar.visible}
                    onDismiss={() => setSnackbar({ visible: false, message: '' })}
                    duration={1000}
                    action={{ label: 'Undo', onPress: () => setSnackbar({ visible: false, message: '' }) }}
                >
                    {snackbar.message}
                </Snackbar>

                <Portal>
                    <Dialog visible={visible} onDismiss={toggleDialog} style={styles.dialog}>
                        <Dialog.Title style={styles.label}>Confirm Deletion</Dialog.Title>
                        <Dialog.Content>
                            <Paragraph style={styles.label}>Are you sure you want to delete all local data? This action cannot be undone.</Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggleDialog}>Cancel</Button>
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
        backgroundColor: '#3333338a',
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
        marginVertical: 8,
    },
    label: {
        fontSize: 18,
        color: '#fff',
    },
    toggle: {
        transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
    },
    dialog: {
        borderRadius: 8,
        backgroundColor: '#333',
        elevation: 4

    },
});

export default Settings;
