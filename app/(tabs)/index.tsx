import React, { useCallback, useState } from "react";
import { FlatList, ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View, RefreshControl } from "react-native";
import { Link, LinkProps } from "expo-router";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import SwipeableItem from "@/components/SwipeableItem";
import { FontAwesome } from '@expo/vector-icons';
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { FlashList } from '@shopify/flash-list';
import { Surface, Text, Avatar, Button, Card } from 'react-native-paper';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
const ITEM_HEIGHT = 80; // Ajusta esto según la altura de tus elementos
export default function Home() {
  const headerHeight = useHeaderHeight()
  const { isLoading, error, data, refetch } = useHackerQuery();
  const isConnected = useNetworkStatus()

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  React.useEffect(() => {
    console.log(`esta conectado a internet: ${isConnected}`);
    if (data?.hits) {
      console.log(`Cantidad de elementos traídos por useHackerQuery: ${data.hits.length}`);
    }
  }, [data]);

  const handleDelete = (item: Hit) => {
    // Lógica para eliminar el artículo
  };
  // const LeftContent = props => <Avatar.Icon {...props} icon="heart" />
  const LeftContent = props => <Ionicons size={28} style={[{ marginBottom: -3 }]} name={false ? "heart" : "heart-outline"} color={"red"} {...props} />
  const renderItem = ({ item }: { item: Hit }) => {
    const { author, comment_text, story_title, story_url } = item._highlightResult;
    const { created_at, created_at_i, updated_at } = item

    return (
      <SwipeableItem onDelete={() => handleDelete(item)}>
        <Link href={{ pathname: "/screens/webview", params: story_url }} asChild>
          <Card style={{
            padding: 8,
            margin: 8,
            // height: ITEM_HEIGHT,
            width: "100%",
            paddingBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
            marginBottom: 10,
          }} elevation={5}>
            <Card.Title title={story_title?.value ?? "N/A"} left={LeftContent} />
            <Card.Content>

              <Text variant="bodyMedium">{`${author?.value} - ${new Date(created_at.toLocaleString())}`}</Text>
            </Card.Content>
          </Card>
        </Link>
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
    <SafeAreaView style={{ ...styles.container, paddingTop: headerHeight }} >
      {/* <FlashList
        data={data?.hits}
        keyExtractor={(item) => item.objectID}
        renderItem={renderItem}
        estimatedItemSize={20}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      /> */}
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={data?.hits}
        keyExtractor={(item) => item.objectID}
        renderItem={renderItem}
        getItemLayout={(_data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        initialNumToRender={20}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
