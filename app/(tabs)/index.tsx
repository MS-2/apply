import React from "react";
import { RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { ArticleCard } from "@/components/ArticlesCard";
import { ConnectionBanner } from "@/components/ConnextionBanner.tsx";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useMainScreen } from "@/hooks/MainScreen";
import { ITEM_HEIGHT } from "@/utils/constants";
import { ErrorScreen } from "@/components/Error";

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

  if (hits.length <= 0 && !online) {
    <ScreenWrapper>
      <ErrorScreen onRetry={refetch} error={error} />
    </ScreenWrapper>
  }
  return (
    <ScreenWrapper>
      {!online && <ConnectionBanner online={online} />}
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
