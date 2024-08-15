import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import { Text } from 'react-native-paper';
import { Link } from "expo-router";

import SwipeableItem from "@/components/SwipeableItem";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Hit } from "@/types/algoliaResponse";

export const RenderList: React.FC<Hit> = ({ author, created_at, objectID, story_title, story_url }) => {
    const [isFavorited, setIsFavorited] = useState(false);

    const toggleHeart = () => {
        setIsFavorited(!isFavorited);
    };

    const handleDelete = (objectID: string) => {
        // Lógica para eliminar el artículo
    };

    const handleFavorites = (objectID: string) => {
        // Lógica para manejar favoritos
    };

    const date = new Date(created_at).toLocaleDateString();

    return (
        <SwipeableItem onDelete={() => handleDelete(objectID)}>
            <View style={styles.container}>
                <Link href={{ pathname: "/screens/webview", params: { value: story_url } }} asChild>
                    <TouchableOpacity style={styles.linkContainer}>
                        <Text variant="titleMedium">
                            {story_title ?? "N/A"}
                        </Text>
                        <Text variant="bodyMedium">{`${author} - ${date}`}</Text>
                    </TouchableOpacity>
                </Link>
                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={toggleHeart}>
                        <Ionicons
                            size={44}
                            name={isFavorited ? "heart" : "heart-outline"}
                            color={"red"}
                        />
                    </TouchableOpacity>
                </View>
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
    iconContainer: {
        alignItems: 'center',
        backgroundColor: 'green',
        justifyContent: "center",
        width: '25%',
    },
    linkContainer: {
        backgroundColor: 'grey',
        width: '75%',
    },
});

export default RenderList;
