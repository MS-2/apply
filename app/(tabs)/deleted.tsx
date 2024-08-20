import React, { useState, useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ArticleList } from "@/components/RenderList";
import { INITIAL_NUM_TO_RENDER, ITEM_HEIGHT, WINDOW_SIZE } from "@/constants";
import { useFocusEffect } from "expo-router";
import { removeFromDeleted } from "@/data/deleted";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useDeletedQuery } from "@/hooks/useHackerNewsQuery";
import { ActivityIndicator } from "react-native-paper";
import { onlineManager } from "@tanstack/react-query";
import { ConnectionBanner } from "@/components/ConnectionBanner";

const DeletedScreen: React.FC = () => {
  const { isLoading, error, data, refetch, isFetching } = useDeletedQuery();

  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [refetch])
  );

  return (
    <ScreenWrapper>
      {isLoading && <ActivityIndicator size="large" color="#FFF" />}
      {error && !onlineManager.isOnline() && (
        <ConnectionBanner online={onlineManager.isOnline()} />
      )}
      <FlatList
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        data={data}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => <ArticleList index={index} {...item} onSwipeRight={removeFromDeleted} />}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        windowSize={WINDOW_SIZE}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      />
    </ScreenWrapper>
  );
};


export default DeletedScreen;
