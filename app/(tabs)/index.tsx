import React from "react";
import { Text, FlatList, ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import SwipeableItem from "@/components/SwipeableItem";
import { FontAwesome } from '@expo/vector-icons';
import useNetworkStatus from "@/hooks/useNetworkStatus";
const ITEM_HEIGHT = 80; // Ajusta esto según la altura de tus elementos
export default function Home() {
  // const { isLoading, error, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useHackerQuery();
  const { isLoading, error, data } = useHackerQuery();
  const isConnected = useNetworkStatus()
  React.useEffect(() => {
    console.log(`esta conectado a internet: ${isConnected}`);
    if (data?.hits) {
      console.log(`Cantidad de elementos traídos por useHackerQuery: ${data.hits.length}`);
    }
  }, [data]);

  const handleDelete = (item: Hit) => {
    // Lógica para eliminar el artículo
  };
  const renderItem = ({ item }: { item: Hit }) => {
    const { author, comment_text, story_title, story_url } = item._highlightResult;
    const { created_at, created_at_i, updated_at } = item

    return (
      <SwipeableItem onDelete={() => handleDelete(item)}>
        <TouchableOpacity style={styles.itemContainer}>
          <View>
            <FontAwesome name="heart" size={24} color="red" />
          </View>
          <Link href={{ pathname: "/screens/webview", params: story_url }}>
            <View>
              <Text style={styles.text}>{story_title?.value ?? "N/A"}</Text>
            </View>
            <View>
              <Text style={styles.text}>{author?.value ?? "N/A"} - {created_at ?? "N/A"}</Text>
            </View>
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
        // data={data?.pages.flatMap(page => page.hits)}
        keyExtractor={(item) => item.objectID}
        renderItem={renderItem}
        getItemLayout={(_data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        initialNumToRender={10}
        windowSize={5}
      // removeClippedSubviews={true}

      // onEndReached={() => {
      //   if (hasNextPage) {
      //     fetchNextPage();
      //   }
      // }}
      // onEndReachedThreshold={0.5}
      // ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" /> : null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
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
