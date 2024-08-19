import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { RenderList } from '../../components/RenderList'
import { ITEM_HEIGHT } from "@/constants";
import { useFocusEffect } from '@react-navigation/native';
import { removeHitFromFavorites, removeFavoritesSimple } from "@/data/Tasks";
import ScreenWrapper from "@/components/ScreensWrapper";
import { useFavoritesQuery } from "@/hooks/useHackerNewsQuery";
import { ActivityIndicator } from "react-native-paper";
import { onlineManager } from "@tanstack/react-query";
export default function Fav() {

  const { data, error, refetch, isLoading, isPending, isFetching } = useFavoritesQuery()
  useFocusEffect(
    useCallback(() => {
      refetch()
    }, [data])
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
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={true}
        data={data}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => <RenderList index={index} {...item} onSwipeLeft={removeFavoritesSimple} />}
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
    </ScreenWrapper >

  );
}
