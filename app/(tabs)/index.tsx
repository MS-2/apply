import React, { useCallback, useState, useEffect } from "react";
import { FlatList, ActivityIndicator, SafeAreaView, Text, RefreshControl } from "react-native";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { RenderList } from '../../components/RenderList';
import { ITEM_HEIGHT } from "@/constants";
import { removeHitFromFeed, addHitToFavorites } from "@/data/Tasks";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useOnlineManager } from "@/hooks/useOnlineManager";
export default function Home() {
  const db = useSQLiteContext();
  const headerHeight = useHeaderHeight();
  const { isLoading, error, data, refetch } = useHackerQuery();
  const isConnected = useNetworkStatus();


  const [feed, setFeed] = useState<Hit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch local hits on focus
  useEffect(() => {
    const fetchHits = async () => {
      const hits = await db.getAllAsync<Hit>('SELECT * from hits');
      setFeed(hits);
    };
    fetchHits();
  }, [db]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Determine which data source to use
  const dataSource = isConnected ? data?.hits : feed;

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error && !isConnected) {
    return <Text>No internet connection and no local data available.</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
      <LinearGradient
        style={{ flex: 1 }}
        colors={['#E3F2FD', '#BBDEFB', '#90CAF9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={dataSource}
          keyExtractor={({ objectID }) => objectID}
          renderItem={({ item }) => <RenderList {...item} onSwipeRight={addHitToFavorites} onSwipeLeft={removeHitFromFeed} />}
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
    </SafeAreaView>
  );
}