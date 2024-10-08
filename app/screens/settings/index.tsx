import React from "react";
import { View, StyleSheet } from 'react-native';
import { Button, Switch, Text, Dialog, Portal, Paragraph, Snackbar } from 'react-native-paper';
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useUserPreferencesContext } from "@/providers/UserPreferences";
import { useNotifications } from "@/providers/NotificationProvider";
import { useSettings } from "@/hooks/SettingsScreen";
import { Link } from "expo-router";

const Settings: React.FC = () => {
    const { selectedPreferences, togglePreference, toggleTheme, isLightTheme } = useUserPreferencesContext();
    const { notification, setNotification } = useNotifications();
    const {
        visible,
        snackbar,
        showSnackbar,
        hideSnackbar,
        toggleDialog,
        confirmClearLocalData
    } = useSettings();

    const handleToggleNotifications = () => {
        setNotification(!notification);
        showSnackbar(notification ? `Notifications Turned On!` : `Notifications Turned Off!`);
    };

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {[
                    { label: "Android Notifications", pref: "android" },
                    { label: "iOS Notifications", pref: "ios" },
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
                    <Text style={styles.label}>Tricolor Theme</Text>
                    <Switch
                        value={!isLightTheme}
                        onValueChange={toggleTheme}
                        style={styles.toggle}
                    />
                </View>
                <Button mode="outlined" onPress={toggleDialog} style={styles.button}>
                    <Text style={styles.labelDanger}>Delete all Local data and cache!</Text>
                </Button>

                <Snackbar
                    visible={snackbar.visible}
                    onDismiss={hideSnackbar}
                    duration={1000}
                    action={{ label: 'Undo', onPress: hideSnackbar }}
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
            <View style={{ height: 50, justifyContent: "center", alignItems: "center" }}>
                <Link href='https://ms-2.github.io/politicas/' style={{ color: 'white' }}>
                    Privacy Policy / Contact Info
                </Link>
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
    labelDanger: {
        fontSize: 16,
        color: '#ff0000'
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
