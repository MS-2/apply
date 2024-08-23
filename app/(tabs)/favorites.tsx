import React, { useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { ArticleList } from "../../src/components/ArticleList";
import { ITEM_HEIGHT, INITIAL_NUM_TO_RENDER, WINDOW_SIZE } from "@/constants";
import { removeFromFavorite } from "@/data/favorites";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { onlineManager } from "@tanstack/react-query";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { useFavoritesQuery } from "@/hooks/useFavoritesQuery";

const FavoritesScreen: React.FC = () => {
  const { data, error, refetch, isLoading, isFetching } = useFavoritesQuery();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const removeFavorite = useCallback(async (objectID: string) => {
    await removeFromFavorite(objectID);
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
        scrollEnabled={true}
        data={data}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => (
          <ArticleList index={index} {...item} onSwipeLeft={removeFavorite} />
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
};

export default FavoritesScreen;
