import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Platform, View, Text, FlatList, RefreshControl, SafeAreaView } from "react-native";
import { Hit } from "@/types/algoliaResponse";
import { useSQLiteContext } from "expo-sqlite";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { RenderList } from '../../components/RenderList'
import { ITEM_HEIGHT } from "@/constants";
import { useFocusEffect } from '@react-navigation/native';
import { removeHitFromFavorites } from "../_layout";
export default function Fav() {
  const db = useSQLiteContext();

  const [tableHits, setTableHits] = useState<Hit[]>([]);
  const headerHeight = useHeaderHeight();

  useFocusEffect(
    React.useCallback(() => {
      const asd: Hit[] = db.getAllSync('SELECT * from favorites')
      setTableHits(asd)
    }, [])
  );
  return (

    <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }} >
      <LinearGradient style={{ flex: 1 }} colors={['#474bff', '#bc48ff', 'transparent']} start={{ x: 0.2, y: 0.6 }}  >
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          // data={data?.hits}
          data={tableHits}
          keyExtractor={({ objectID }) => objectID}
          renderItem={({ item }) => <RenderList {...item} onSwipeRight={removeHitFromFavorites} />}
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
      </LinearGradient>
    </SafeAreaView >

  );
}
