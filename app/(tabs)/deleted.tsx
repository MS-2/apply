import React, { useCallback, useState } from "react";
import { FlatList, Text } from "react-native";
import { ArticleCard } from "@/components/ArticlesCard";
import { INITIAL_NUM_TO_RENDER, ITEM_HEIGHT, WINDOW_SIZE } from "@/constants";
import { useFocusEffect } from "expo-router";
import { removeFromDeleted } from "@/data/deleted";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { onlineManager } from "@tanstack/react-query";
import { ConnectionBanner } from "@/components/ConnextionBanner.tsx";
import { Hit } from "@/types/algoliaResponse";
import { openDatabase } from "@/data/db";

const getHits = async (): Promise<Hit[]> => {
  const db = await openDatabase();
  const hits = await db.getAllAsync<Hit>("SELECT * from deleted");
  return hits;
};
const DeletedScreen: React.FC = () => {

  const [deletes, setFavorites] = useState<Hit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        try {
          const favoriteIDs = await getHits();
          console.log('favoriteIDs : ', favoriteIDs.length)
          setFavorites(favoriteIDs);
        } catch (error) {
          setError('Failed to load deletes');
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
      {false && !onlineManager.isOnline() && (
        <ConnectionBanner online={onlineManager.isOnline()} />
      )}
      <FlatList
        scrollEnabled={true}
        contentInsetAdjustmentBehavior="automatic"
        data={deletes}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) =>
          <ArticleCard
            index={index}
            {...item}
            onSwipeRight={() => removeFromDeleted(item.objectID)}
          />}
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


export default DeletedScreen;
