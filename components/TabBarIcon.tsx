// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { type ComponentProps } from "react";

type TabBarIconProps = {
  style?: object;
} & ComponentProps<typeof Ionicons>;

export function TabBarIcon({ style, ...props }: TabBarIconProps) {
  return <Ionicons size={32} style={[{ marginBottom: -3 }, style]} {...props} />;
}
