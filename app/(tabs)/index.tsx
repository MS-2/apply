import React from "react";
import { Text, View, FlatList, ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";


export default function Home() {
  const { isLoading, error, data } = useHackerQuery();

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Link href="articles">a world</Link>
      <FlatList
        data={data?.hits}
        keyExtractor={(item) => item.objectID}
        renderItem={({ item }) => {
          const { author, comment_text, story_title, story_url } = item._highlightResult;

          return (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>Author: {author?.value ?? "N/A"}</Text>
              <Text style={styles.text}>Comment: {comment_text?.value ?? "N/A"}</Text>
              <Text style={styles.text}>Story Title: {story_title?.value ?? "N/A"}</Text>
              <Text style={styles.text}>Story URL: {story_url?.value ?? "N/A"}</Text>
            </View>
          );
        }}
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
  },
  text: {
    fontSize: 16,
  },
});
