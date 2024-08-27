import React from "react";
import { RefreshControl } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { ArticleCard } from "@/components/ArticlesCard";
import { ConnectionBanner } from "@/components/ConnextionBanner.tsx";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useMainScreen } from "@/hooks/MainScreen";
import { ITEM_HEIGHT } from "@/utils/constants";

const MainScreen: React.FC = () => {
  const {
    error,
    handleSwipeLeft,
    handleSwipeRight,
    hits,
    isLoading,
    isRefetching,
    online,
    refetch,
  } = useMainScreen();

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
        contentInsetAdjustmentBehavior="automatic"
        data={hits}
        estimatedItemSize={ITEM_HEIGHT}
        keyExtractor={({ id }) => id.toString()}
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
