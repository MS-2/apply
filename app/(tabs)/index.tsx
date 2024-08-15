import React, { useCallback, useState } from "react";
import { FlatList, ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View, RefreshControl } from "react-native";
import { Link, LinkProps } from "expo-router";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import SwipeableItem from "@/components/SwipeableItem";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { Surface, Text, Avatar, Button, Card } from 'react-native-paper';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { useSQLiteContext } from "expo-sqlite";

import { RenderList } from '../../components/RenderList'
const ITEM_HEIGHT = 80; // Ajusta esto según la altura de tus elementos
export default function Home() {
  const db = useSQLiteContext();
  const tableHits: Hit[] = db.getAllSync('SELECT * from hits')
  const [mivariableBoolean, setMivariableBoolean] = useState(false);
  const toggleHeart = () => {
    setMivariableBoolean(!mivariableBoolean);
  };
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

  const handleDelete = (objectID: string) => {
    // Lógica para eliminar el artículo
  };

  const handleFavorites = (objectID: string) => {
    // Lógica para manejar favoritos 
  };


  const renderItem = ({ author, created_at, objectID, story_title, story_url }: Hit) => {
    const date = new Date(created_at).toLocaleDateString()
    return (
      <SwipeableItem onDelete={() => handleDelete(objectID)}>
        <View style={{
          padding: 8,
          margin: 8,
          borderRadius: 16,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.25)",
          backgroundColor: 'rgba(255,255,255,0.5)',
          marginBottom: 10,
          flexDirection: "row"
        }}>
          <Link href={{ pathname: "/screens/webview", params: { value: story_url } }} asChild>
            <TouchableOpacity style={{ width: '75%', backgroundColor: 'grey' }}>
              <Text variant="titleMedium">
                {story_title ?? "N/A"}
              </Text>
              <Text variant="bodyMedium">{`${author} - ${date}`}</Text>
            </TouchableOpacity>
          </Link>
          <View style={{ width: '25%', backgroundColor: 'green', justifyContent: "center", alignItems: 'center' }}>
            <TouchableOpacity onPress={toggleHeart}>
              <Ionicons
                size={44}
                name={mivariableBoolean ? "heart" : "heart-outline"}
                color={"red"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SwipeableItem >
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }} >
      <LinearGradient style={{ flex: 1 }} colors={['#474bff', '#bc48ff', 'transparent']} start={{ x: 0.2, y: 0.6 }}  >
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          // data={data?.hits}
          data={tableHits}
          keyExtractor={({ objectID }) => objectID}
          // renderItem={({ item }) => renderItem(item)}
          renderItem={({ item }) => <RenderList  {...item} />}
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
      </LinearGradient>
    </SafeAreaView >
  );
}