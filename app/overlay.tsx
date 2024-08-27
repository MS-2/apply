import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Dialog, Portal, Paragraph } from 'react-native-paper';

const OverlayMessage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    useEffect(() => {
        const markAsShown = async () => {
            await AsyncStorage.setItem('@overlay_shown', 'true');
        };
        markAsShown();
    }, []);

    return (
        <Portal>
            <Dialog visible onDismiss={onClose} style={styles.dialog}>
                <Dialog.Title style={styles.title}>Welcome to Mobile News!</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={styles.paragraph}>
                        <Text style={styles.textHighlightRed}>Swipe left</Text> to delete items or <Text style={styles.textHighlightGreen}>swipe right</Text> to add them to favorites. You can tap the icon to open the link, and the articles saved as favorites are stored locally on your device.
                    </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onClose} textColor="black" style={styles.button}>
                        Got it!
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    dialog: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        width: '90%', // Adjust width for better visibility
    },
    title: {
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    textHighlightRed: {
        color: 'red',
        fontWeight: 'bold',
    },
    textHighlightGreen: {
        color: '#32CD32', // Lime green color
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
    },
});

export default OverlayMessage;
