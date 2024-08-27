import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import { ArticleList } from '../../src/components/ArticleList';
import { ITEM_HEIGHT } from "@/constants";
import { onlineManager, useQuery } from "@tanstack/react-query";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { ConnectionBanner } from "@/components/ConnectionBanner";
import { FlashList } from "@shopify/flash-list";
import { Hit } from "@/types/algoliaResponse";
import { getHits, addToFavorites, addToDeletes } from "@/data/main";
import { fetchData } from "@/api/fetchAlgoliaData";
import { useMainScreen } from "@/hooks/MainScreen";
import { useUserPreferencesContext } from "@/providers/UserPreferences";


const MainScreen: React.FC = () => {
  const { selectedPreferences } = useUserPreferencesContext();
  const {
    hits,
    error,
    isLoading,
    refetch,
    isRefetching,
    online,
    handleSwipeRight,
    handleSwipeLeft,
  } = useMainScreen(selectedPreferences);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator animating size="large" />
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper>
      {error && !online && <ConnectionBanner online={online} />}
      <FlashList
        estimatedItemSize={ITEM_HEIGHT}
        contentInsetAdjustmentBehavior="automatic"
        data={hits}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item, index }) => (
          <ArticleList
            index={index}
            {...item}
            onSwipeRight={() => handleSwipeRight(item)}
            onSwipeLeft={() => handleSwipeLeft(item)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      />
    </ScreenWrapper>
  );
}

export default MainScreen

