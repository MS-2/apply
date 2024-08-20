import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

export const ConnectionBanner: React.FC<{ online: boolean }> = ({ online }) => (
    <View style={{
        backgroundColor: online ? 'green' : 'red',
        padding: 8,
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }}>
        <Text style={{ color: 'white' }}>
            {online ? "Connected" : "Error"}
        </Text>
    </View>
);