import { DefaultTheme } from "react-native-paper";

export const venezuelanTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FFFF00",
    secondary: "#0000FF",
    tertiary: "#FF0000",
    tertiaryContainer: "#2f1b1b",
  },
  roundness: 10,
};

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FFFFFF",
    secondary: "#bb86fc",
    Tertiary: "#bb86fc",
    tertiaryContainer: "#03dac4",
    accent: "#03dac4",
  },
};
