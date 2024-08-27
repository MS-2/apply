import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ArticleCard } from '../../src/components/ArticlesCard';
import { ITEM_HEIGHT, INITIAL_NUM_TO_RENDER, WINDOW_SIZE } from '@/utils/constants';
import { ScreenWrapper } from '@/components/ScreensWrapper';
import { ActivityIndicator } from 'react-native-paper';
import { ConnectionBanner } from '@/components/ConnextionBanner.tsx';
import { useFavorites } from '@/hooks/FavoritesScreen';

const FavoritesScreen: React.FC = () => {
  const { favorites, loading, error, fetchFavorites, removeFromFavorite, isOnline } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [fetchFavorites])
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator animating size="large" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {error && !isOnline && (
        <ConnectionBanner online={isOnline} />
      )}
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={favorites}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => (
          <ArticleCard
            index={index}
            {...item}
            onSwipeLeft={() => removeFromFavorite(item.objectID)}
          />
        )}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        windowSize={WINDOW_SIZE}
      />
    </ScreenWrapper>
  );
};

export default FavoritesScreen;
