import React, { useState } from "react";
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View, FlatList, ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";

import { Hit } from "@/types/algoliaResponse";

export default function Home() {
  const { isLoading, error, data } = useHackerQuery();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const renderItem = ({ item }: { item: Hit }) => {
    const { author, comment_text, story_title, story_url } = item._highlightResult;

    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => alert('delete')}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );


    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={renderRightActions}>
          <TouchableOpacity style={styles.itemContainer}>
            <Link href={{ pathname: "/screens/webview", params: story_url }}>
              <Text style={styles.text}>Author: {author?.value ?? "N/A"}</Text>
              <Text style={styles.text}>Comment: {comment_text?.value ?? "N/A"}</Text>
              <Text style={styles.text}>Story Title: {story_title?.value ?? "N/A"}</Text>
              <Text style={styles.text}>Story URL: {story_url?.value ?? "N/A"}</Text>
            </Link>
          </TouchableOpacity>
        </Swipeable>
      </GestureHandlerRootView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.hits}
        keyExtractor={(item) => item.objectID}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  itemContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 100,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 60,
  },
});
