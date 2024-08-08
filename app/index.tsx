import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RootLayout from "./_layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link } from "expo-router";
import React from "react";
const queryClient = new QueryClient();

export default function Page(children: React.ReactNode) {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <RootLayout />
    </QueryClientProvider>
  );
}
