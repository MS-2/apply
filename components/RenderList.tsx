import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Text } from 'react-native-paper';
import { Link } from "expo-router";
import SwipeableItem from "@/components/SwipeableItem";
import { Hit } from "@/types/algoliaResponse";

// Define the type for the component props
type RenderListProps = Hit & {
    onSwipeRight?: (objectID: string) => Promise<void>;
    onSwipeLeft?: (objectID: string) => Promise<void>;
};

export const RenderList: React.FC<RenderListProps> = ({
    author,
    created_at,
    objectID,
    story_title,
    story_url,
    onSwipeRight,
    onSwipeLeft,
}) => {
    const date = new Date(created_at).toLocaleDateString();

    return (
        <SwipeableItem
            onSwipeLeft={() => onSwipeLeft?.(objectID)}
            onSwipeRight={() => onSwipeRight?.(objectID)}
        >
            <View style={styles.container}>
                <Link href={{ pathname: "/screens/webview", params: { value: story_url } }} asChild>
                    <TouchableOpacity style={styles.touchable}>
                        <Text style={styles.title}>
                            {story_title ?? "N/A"}
                        </Text>
                        <Text style={styles.subtitle}>Author : {`${author} - ${date}`}</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SwipeableItem>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        flexDirection: 'row',
        margin: 8,
        marginBottom: 10,
        padding: 10,
        paddingBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    touchable: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        textDecorationLine: 'underline'
    },
});

export default RenderList;
