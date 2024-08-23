import React, { useCallback, useState } from "react";
import { RefreshControl } from "react-native";
import { useMainQueryUsingInfinity } from "@/hooks/useMainQuery";
import { ArticleList } from '../../src/components/ArticleList';
import { ITEM_HEIGHT } from "@/constants";
import { hitToFavorites, hitToDeleted } from "@/data/main";
import { onlineManager } from "@tanstack/react-query";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { FlashList } from "@shopify/flash-list";

const MainScreen: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, error, isFetching, isLoading } = useMainQueryUsingInfinity()
  const articles = data?.pages.flatMap(page => page.posts) ?? []
  useFocusEffect(
    useCallback(() => {
      console.log(articles.length)
      if (!isFetching) {
        refetch();
      }
    }, [])
  );

  const loadMore = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  };
  const removeHit = useCallback(async (objectID: string) => {
    await hitToDeleted(objectID);
    if (!isFetching) {
      refetch();
    }
  }, [refetch, isFetching]);

  const favoriteHit = useCallback(async (objectID: string) => {
    await hitToFavorites(objectID);
    if (!isFetching) {
      refetch();
    }
  }, [refetch, isFetching]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#FFF" />
  }

  return (
    <ScreenWrapper>
      {error && !onlineManager.isOnline() && (
        <ConnectionBanner online={onlineManager.isOnline()} />
      )}
      <FlashList
        estimatedItemSize={ITEM_HEIGHT}
        contentInsetAdjustmentBehavior="automatic"
        data={articles}
        keyExtractor={({ objectID }) => objectID}
        onLoad={(e) => console.log('first render time ', e.elapsedTimeInMs)}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        renderItem={({ item, index }) => (
          <ArticleList
            index={index}
            {...item}
            onSwipeRight={favoriteHit}
            onSwipeLeft={removeHit}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator size="large" color='#FFF' />
          ) : null
        }
      // decelerationRate={0.3}
      />
    </ScreenWrapper>
  );
}

export default MainScreen