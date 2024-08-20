import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TabBarIcon } from "../../src/components/TabBarIcon";

const TabLayout: React.FC = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarBackground: () => (
          <LinearGradient
            colors={['#FFFF00', '#0000FF', '#FF0000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        ),

      }}
    >
      <Tabs.Screen
        name="deleted"
        options={{
          title: "Deleted",
          tabBarActiveTintColor: '#FF0000',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='trash' color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarActiveTintColor: '#FFFFFF',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "book-outline" : "newspaper"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarActiveTintColor: '#FFFF00',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "star" : "star-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
    elevation: 5, // Shadows on Android
    shadowColor: '#000000', // Shadows on iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default TabLayout;
