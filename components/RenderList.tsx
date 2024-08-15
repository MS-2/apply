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
                    <TouchableOpacity>
                        <Text variant="titleMedium">
                            {story_title ?? "N/A"}
                        </Text>
                        <Text variant="bodyMedium">{`${author} - ${date}`}</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SwipeableItem>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderBottomWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.25)",
        borderRadius: 16,
        flexDirection: "row",
        margin: 8,
        marginBottom: 10,
        padding: 8,
        paddingBottom: 20,
    },
});

export default RenderList;
