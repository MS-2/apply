import React, { useState, useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import RenderList from "@/components/RenderList";
import { INITIAL_NUM_TO_RENDER, ITEM_HEIGHT, WINDOW_SIZE } from "@/constants";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { removeDeletedSimple } from "@/data/Tasks";
import ScreenWrapper from "@/components/ScreensWrapper";
import { useDeletedQuery } from "@/hooks/useHackerNewsQuery";
import { ActivityIndicator } from "react-native-paper";
import { onlineManager } from "@tanstack/react-query";
import { ConnectionBanner } from "@/components/ConnectionBanner";

const DeletedItemsScreen: React.FC = () => {
  const db = useSQLiteContext();

  const { isLoading, error, data, refetch, isFetching } = useDeletedQuery();


  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [data, db])
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
        renderItem={({ item, index }) => <RenderList index={index} {...item} onSwipeRight={removeDeletedSimple} />}
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


export default DeletedItemsScreen;
