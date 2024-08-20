import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { ArticleList } from '../../components/RenderList';
import { INITIAL_NUM_TO_RENDER, ITEM_HEIGHT, WINDOW_SIZE } from "@/constants";
import { hitToFavorites, hitToDeleted } from "@/data/main";
import { onlineManager } from "@tanstack/react-query";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useDragState } from "@/hooks/dragStateContext";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { ConnectionBanner } from "@/components/ConnectionBanner";

const MainScreen: React.FC = () => {

  const { isLoading, error, data, refetch, isFetching } = useHackerQuery();

  const { isDragging } = useDragState();

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  );

  const removeHit = useCallback(async (objectID: string) => {
    await hitToDeleted(objectID);
    refetch()
  }, []);

  const favoriteHit = useCallback(async (objectID: string) => {
    await hitToFavorites(objectID);
    refetch()
  }, []);



  return (
    <ScreenWrapper>
      {isLoading && <ActivityIndicator size="large" color="#FFF" />}
      {error && !onlineManager.isOnline() && (
        <ConnectionBanner online={onlineManager.isOnline()} />
      )}
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={false}
        data={data}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => (
          <ArticleList index={index} {...item} onSwipeRight={favoriteHit} onSwipeLeft={removeHit} />
        )}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        windowSize={WINDOW_SIZE}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      />
    </ScreenWrapper>
  );
}

export default MainScreen