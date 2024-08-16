import React, { useState, useCallback } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import RenderList from "@/components/RenderList";
import { ITEM_HEIGHT } from "@/constants";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { useFocusEffect } from "expo-router";

const DeletedItemsScreen: React.FC = () => {
  const db = useSQLiteContext();
  const [deletedHits, setDeletedHits] = useState<Hit[]>([]);
  const headerHeight = useHeaderHeight();

  // Fetch deleted items from the database when the screen is focused
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
    <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }}>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={deletedHits}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item }) => <RenderList {...item} />}
        getItemLayout={(_data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index
        })}
        initialNumToRender={20}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Add any styles if needed
});

export default DeletedItemsScreen;
