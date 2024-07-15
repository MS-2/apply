import { Text, View, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, ActivityIndicator, SafeAreaView } from "react-native";

export default function Index() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["todo"],
    queryFn: () =>
      fetch("https://hn.algolia.com/api/v1/search_by_date?query=mobile").then(
        (res) => res.json()
      ),
  });
  {
  }
  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Link href="articles">hello world</Link>
      <FlatList
        data={data?.hits}
        renderItem={({
          item: {
            _highlightResult: {
              author: { value },
            },
          },
        }) => (
          <View>
            <Text>{value}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
