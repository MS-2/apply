import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { ArticleList } from "../../src/components/ArticleList";
import { ITEM_HEIGHT, INITIAL_NUM_TO_RENDER, WINDOW_SIZE } from "@/constants";
import { removeFromFavorite } from "@/data/favorites";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { Hit } from "@/types/algoliaResponse";
import { openDatabase } from "@/data/db";


export const getFavorites = async (): Promise<Hit[]> => {
  const db = await openDatabase();
  const hits = await db.getAllAsync<Hit>("SELECT * from favorites");
  return hits;
};
const FavoritesScreen: React.FC = () => {
  const [favorites, setFavorites] = useState<Hit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const favoriteIDs = await getFavorites();
          console.log('favoriteIDs : ', favoriteIDs.length)
          setFavorites(favoriteIDs);
        } catch (error) {
          setError('Failed to load favorites');
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }, [])
  );



  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ScreenWrapper>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={favorites}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => (
          <ArticleList
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
