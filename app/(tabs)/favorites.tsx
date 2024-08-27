import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ArticleCard } from '../../src/components/ArticlesCard';
import { ITEM_HEIGHT, INITIAL_NUM_TO_RENDER, WINDOW_SIZE } from '@/constants';
import { ScreenWrapper } from '@/components/ScreensWrapper';
import { ActivityIndicator } from 'react-native-paper';
import { getFavorites, removeFromFavorite } from '@/hooks/FavoritesScreen/data';
import { Hit } from '@/types/algoliaResponse';
import { ConnectionBanner } from '@/components/ConnextionBanner.tsx';
import { onlineManager } from '@tanstack/react-query';

const FavoritesScreen: React.FC = () => {
  const [favorites, setFavorites] = useState<Hit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchFavorites = useCallback(async () => {
    try {
      const favoriteIDs = await getFavorites();
      setFavorites(favoriteIDs);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

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
      {error && <ConnectionBanner online={onlineManager.isOnline()} />}
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
