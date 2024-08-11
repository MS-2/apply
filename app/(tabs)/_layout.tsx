import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "../../components/TabBarIcon";

export default function TabLayout() {
  return (
    // <LinearGradient style={{ flex: 1 }} colors={['#4c669f', '#3b5998', '#192f6a']} >
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >

      <Tabs.Screen
        name="deleted"
        options={{
          title: "Deletes",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name='trash'
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Articles",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "code-slash" : "code-slash-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              name="heart"
              color={color}
            />
          ),
        }}
      />

    </Tabs>
    // </LinearGradient>
  );
}
