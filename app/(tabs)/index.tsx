import React, { useCallback, useState, useEffect } from "react";
import { FlatList, ActivityIndicator, SafeAreaView, Text, RefreshControl, Touchable, TouchableHighlight, TouchableOpacity } from "react-native";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { RenderList } from '../../components/RenderList';
import { ITEM_HEIGHT } from "@/constants";
import { removeHitFromFeed, addHitToFavorites } from "@/data/Tasks";
import { onlineManager } from "@tanstack/react-query";
import ScreenWrapper from "@/components/ScreensWrapper";
import { useDragState } from "@/hooks/dragStateContext";
export default function Home() {
  const db = useSQLiteContext();
  const { isLoading, error, data, refetch } = useHackerQuery();


  const [feed, setFeed] = useState<Hit[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { isDragging } = useDragState();

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
  const dataSource = onlineManager.isOnline() ? data?.hits : feed;

  if (isLoading) {
    return <ScreenWrapper><ActivityIndicator size="large" color="#0000ff" /></ScreenWrapper>;
  }

  if (error && !onlineManager.isOnline()) {
    return (<ScreenWrapper><Text>No internet connection and no local data available.</Text></ScreenWrapper >)
  }

  return (
    <ScreenWrapper>
      <FlatList
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        data={dataSource}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => <RenderList index={index} {...item} onSwipeRight={addHitToFavorites} onSwipeLeft={removeHitFromFeed} />}
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
    </ScreenWrapper>
  );
}