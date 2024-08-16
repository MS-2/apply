import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import RenderList from "@/components/RenderList";
import { ITEM_HEIGHT } from "@/constants";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import { removeHitFromDeleted } from "@/data/Tasks";
import ScreenWrapper from "@/components/ScreensWrapper";

const DeletedItemsScreen: React.FC = () => {
  const db = useSQLiteContext();
  const [deletedHits, setDeletedHits] = useState<Hit[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchDeletedHits = async () => {
        const hits = await db.getAllAsync<Hit>('SELECT * FROM deleted');
        setDeletedHits(hits);
      };

      fetchDeletedHits();
    }, [db])
  );

  return (
    <ScreenWrapper>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={deletedHits}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item }) => <RenderList {...item} onSwipeRight={removeHitFromDeleted} />}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index
        })}
        initialNumToRender={20}
        windowSize={10}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  // Add any styles if needed
});

export default DeletedItemsScreen;
