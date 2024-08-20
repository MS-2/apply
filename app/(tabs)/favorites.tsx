import React, { useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { RenderList } from "../../components/RenderList";
import { ITEM_HEIGHT, INITIAL_NUM_TO_RENDER, WINDOW_SIZE } from "@/constants";
import { removeFavoritesSimple } from "@/data/Tasks";
import ScreenWrapper from "@/components/ScreensWrapper";
import { useFavoritesQuery } from "@/hooks/useHackerNewsQuery";
import { onlineManager } from "@tanstack/react-query";
import { ConnectionBanner } from "@/components/ConnectionBanner";

const FavoritesItemsScreen: React.FC = () => {
  const { data, error, refetch, isLoading, isFetching } = useFavoritesQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <ScreenWrapper>
      {isLoading && <ActivityIndicator size="large" color="#FFF" />}
      {error && !onlineManager.isOnline() && (
        <ConnectionBanner online={onlineManager.isOnline()} />
      )}
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={true}
        data={data}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => (
          <RenderList index={index} {...item} onSwipeLeft={removeFavoritesSimple} />
        )}
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

export default FavoritesItemsScreen;
