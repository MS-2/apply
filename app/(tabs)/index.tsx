import { Text, View, ScrollView, StyleSheet,FlatList, ActivityIndicator, SafeAreaView  } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";


type HighlightResult = {
  matchLevel: string;
  matchedWords: string[];
  value: string;
};

type HighlightResultContainer = {
  author: HighlightResult;
  comment_text: HighlightResult;
  story_title: HighlightResult;
  story_url: HighlightResult;
};

type Hit = {
  _highlightResult: HighlightResultContainer;
  _tags: string[];
  author: string;
  comment_text: string;
  created_at: string;
  created_at_i: number;
  objectID: string;
  parent_id: number;
  story_id: number;
  story_title: string;
  story_url: string;
  updated_at: string;
};

type AlgoliaResponse = {
  exhaustive: {
    nbHits: boolean;
    typo: boolean;
  };
  exhaustiveNbHits: boolean;
  exhaustiveTypo: boolean;
  hits: Hit[];
};

export default function Index() {
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["todo"],
  //   queryFn: () =>
  //     fetch("https://hn.algolia.com/api/v1/search_by_date?query=mobile").then(
  //       (res) => res.json()
  //     ),
  // });

  const { isLoading, error, data } = useQuery<AlgoliaResponse>({
    queryKey: ["todo"],
    queryFn: () =>
      fetch("https://hn.algolia.com/api/v1/search_by_date?query=mobile").then(
        (res) => res.json()
      ),
  });

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Link href="articles">hello world</Link>
      <FlatList
        data={data?.hits}
        keyExtractor={(item) => item.objectID}
        renderItem={({ item }) => {
          const { author, comment_text, story_title, story_url } =
            item._highlightResult;

          return (
            <View style={styles.itemContainer}>
              <Text style={styles.text}>Author: {author?.value ?? "N/A"}</Text>
              <Text style={styles.text}>
                Comment: {comment_text?.value ?? "N/A"}
              </Text>
              <Text style={styles.text}>
                Story Title: {story_title?.value ?? "N/A"}
              </Text>
              <Text style={styles.text}>
                Story URL: {story_url?.value ?? "N/A"}
              </Text>
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
  link: {
    fontSize: 18,
    color: "blue",
    marginBottom: 20,
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
