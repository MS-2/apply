import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { RenderList } from '../../components/RenderList'
import { ITEM_HEIGHT } from "@/constants";
import { useFocusEffect } from '@react-navigation/native';
import { removeHitFromFavorites } from "@/data/Tasks";
import ScreenWrapper from "@/components/ScreensWrapper";
export default function Fav() {
  const db = useSQLiteContext();

  const [tableHits, setTableHits] = useState<Hit[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const asd: Hit[] = db.getAllSync('SELECT * from favorites')
      setTableHits(asd)
    }, [])
  );
  return (

    <ScreenWrapper>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        // data={data?.hits}
        data={tableHits}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item }) => <RenderList {...item} onSwipeLeft={removeHitFromFavorites} />}
        getItemLayout={(_data, index) => (
          { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
        )}
        initialNumToRender={20}
        windowSize={10}
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     onRefresh={onRefresh}
      //   />
      // }
      />
    </ScreenWrapper >

  );
}
