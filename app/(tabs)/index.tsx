import React from "react";
import { RefreshControl } from "react-native";
import { ArticleCard } from '../../src/components/ArticlesCard';
import { ITEM_HEIGHT } from "@/constants";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { ActivityIndicator } from "react-native-paper";
import { ConnectionBanner } from "@/components/ConnextionBanner.tsx";
import { FlashList } from "@shopify/flash-list";
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
          <ArticleCard
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

