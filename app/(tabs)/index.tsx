import React, { useCallback, useState } from "react";
import { FlatList, ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View, RefreshControl } from "react-native";
import { useHackerQuery } from "@/hooks/useHackerNewsQuery";
import { Hit } from "@/types/algoliaResponse";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { useSQLiteContext } from "expo-sqlite";

import { RenderList } from '../../components/RenderList'
import { ITEM_HEIGHT } from "@/constants";

export default function Home() {
  const db = useSQLiteContext();
  const tableHits: Hit[] = db.getAllSync('SELECT * from hits')
  const headerHeight = useHeaderHeight()
  const { isLoading, error, data, refetch } = useHackerQuery();
  // const isConnected = useNetworkStatus()

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // React.useEffect(() => {
  //   console.log(`esta conectado a internet: ${isConnected}`);
  //   if (data?.hits) {
  //     console.log(`Cantidad de elementos traídos por useHackerQuery: ${data.hits.length}`);
  //   }
  // }, [data]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: headerHeight }} >
      <LinearGradient style={{ flex: 1 }} colors={['#474bff', '#bc48ff', 'transparent']} start={{ x: 0.2, y: 0.6 }}  >
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          // data={data?.hits}
          data={tableHits}
          keyExtractor={({ objectID }) => objectID}
          renderItem={({ item }) => <RenderList  {...item} />}
          getItemLayout={(_data, index) => (
            { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
          )}
          initialNumToRender={20}
          windowSize={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      </LinearGradient>
    </SafeAreaView >
  );
}