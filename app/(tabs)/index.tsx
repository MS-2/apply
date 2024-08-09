import React from "react";
import { Text, FlatList, ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import SwipeableItem from "@/components/SwipeableItem";
const ITEM_HEIGHT = 80; // Ajusta esto según la altura de tus elementos
export default function Home() {
  const { isLoading, error, data } = useHackerQuery();
  const handleDelete = (item: Hit) => {
    // Lógica para eliminar el artículo
  };
  const renderItem = ({ item }: { item: Hit }) => {
    const { author, comment_text, story_title, story_url } = item._highlightResult;
    const { created_at, created_at_i, updated_at } = item

    return (
      <SwipeableItem onDelete={() => handleDelete(item)}>
        <TouchableOpacity style={styles.itemContainer}>
          <Link href={{ pathname: "/screens/webview", params: story_url }}>
            <Text style={styles.text}>Story Title: {story_title?.value ?? "N/A"}</Text>
            <Text style={styles.text}>Author: {author?.value ?? "N/A"} - {created_at ?? "N/A"}</Text>
          </Link>
        </TouchableOpacity>
      </SwipeableItem>
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.hits}
        keyExtractor={(item) => item.objectID}
        renderItem={renderItem}
        getItemLayout={(data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}

      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#fff",
    height: ITEM_HEIGHT, // Asegúrate de que este valor coincida con ITEM_HEIGHT
  },
  text: {
    fontSize: 16,
  },
});
