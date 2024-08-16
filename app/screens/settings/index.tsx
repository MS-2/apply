import ScreenWrapper from "@/components/ScreensWrapper";
import React from "react";
import { View, Text, StyleSheet } from 'react-native';

const Settings: React.FC = () => {
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Text style={styles.text}>Hello World</Text>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        color: '#000',
    },
});

export default Settings;
