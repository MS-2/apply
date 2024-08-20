import Ionicons from "@expo/vector-icons/Ionicons";
import React, { type ComponentProps } from "react";

type TabBarIconProps = {
  style?: object;
} & ComponentProps<typeof Ionicons>;

export const TabBarIcon: React.FC<TabBarIconProps> = ({ style, ...props }) => (
  <Ionicons size={32} style={[{ marginBottom: -3 }, style]} {...props} />
);