import React from "react";
import { RefreshControl } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { ArticleCard } from "@/components/ArticlesCard";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useMainScreen } from "@/hooks/MainScreen";
import { ITEM_HEIGHT } from "@/utils/constants";

const MainScreen: React.FC = () => {
  const {
    handleSwipeLeft,
    handleSwipeRight,
    hits,
    isLoading,
    isRefetching,
    online,
    refetch,
    error
  } = useMainScreen();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator animating size="large" />
      </ScreenWrapper>
    );
  }

  if (!online && hits.length === 0) {
    <ScreenWrapper>
      <Text>{error?.message}</Text>
    </ScreenWrapper>
  }

  return (
    <ScreenWrapper>
      <FlashList
        contentInsetAdjustmentBehavior="automatic"
        data={hits}
        estimatedItemSize={ITEM_HEIGHT}
        keyExtractor={({ id, objectID, created_at_i }) => `${id}${objectID}${created_at_i}`}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderItem={({ item, index }) => (
          <ArticleCard
            index={index}
            {...item}
            onSwipeLeft={() => handleSwipeLeft(item)}
            onSwipeRight={() => handleSwipeRight(item)}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default MainScreen;
