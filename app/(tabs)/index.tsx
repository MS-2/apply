import React, { useCallback, useState, useEffect } from "react";
import { FlatList, Text, RefreshControl } from "react-native";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { RenderList } from '../../components/RenderList';
import { ITEM_HEIGHT } from "@/constants";
import { removeHitFromFeed, addHitToFavorites, saveHitsToFeed, getDeletedHits, getHits, removeHitFromFeedSimple, addHitToFavoritesFromFeedSimple } from "@/data/Tasks";
import { onlineManager } from "@tanstack/react-query";
import ScreenWrapper from "@/components/ScreensWrapper";
import { useDragState } from "@/hooks/dragStateContext";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
export default function Home() {
  const db = useSQLiteContext();
  const { isLoading, error, data, refetch, isFetching } = useHackerQuery();

  const { isDragging } = useDragState();

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [data, db])
  );

  const removeHit = useCallback(async (objectID: string) => {
    await removeHitFromFeedSimple(objectID);
    refetch()
  }, []);

  const favoriteHit = useCallback(async (objectID: string) => {
    await addHitToFavoritesFromFeedSimple(objectID);
    refetch()
  }, []);



  if (isLoading) {
    return <ScreenWrapper><ActivityIndicator size="large" color="#FFF" /></ScreenWrapper>;
  }

  if (error && !onlineManager.isOnline()) {
    return (<ScreenWrapper><Text>No internet connection and no local data available.</Text></ScreenWrapper >)
  }

  return (
    <ScreenWrapper>
      <FlatList
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        data={data}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => <RenderList index={index} {...item} onSwipeRight={favoriteHit} onSwipeLeft={removeHit} />}
        getItemLayout={(_data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        initialNumToRender={20}
        windowSize={10}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
          />
        }
      />
    </ScreenWrapper>
  );
}