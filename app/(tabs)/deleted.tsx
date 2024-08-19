import React, { useState, useCallback } from "react";
import { FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import RenderList from "@/components/RenderList";
import { ITEM_HEIGHT } from "@/constants";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { removeHitFromDeleted, removeDeletedSimple } from "@/data/Tasks";
import ScreenWrapper from "@/components/ScreensWrapper";
import { useDeletedQuery, useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { ActivityIndicator } from "react-native-paper";
import { onlineManager } from "@tanstack/react-query";

const DeletedItemsScreen: React.FC = () => {
  const db = useSQLiteContext();

  const { isLoading, error, data, refetch, isFetching } = useDeletedQuery();


  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [data, db])
  );
  if (isLoading) {
    return <ScreenWrapper><ActivityIndicator size="large" color="#FFF" /></ScreenWrapper>;
  }

  if (error && !onlineManager.isOnline()) {
    return (<ScreenWrapper><></></ScreenWrapper >)
  }
  return (
    <ScreenWrapper>
      <FlatList
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        data={data}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => <RenderList index={index} {...item} onSwipeRight={removeDeletedSimple} />}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index
        })}
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
};


export default DeletedItemsScreen;
