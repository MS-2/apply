export const ALGOLIA_API_URL = "https://hn.algolia.com/api/v1/search_by_date";
export const ITEM_HEIGHT = 250; // height per article
export const INITIAL_NUM_TO_RENDER = 10;
export const WINDOW_SIZE = 10;
export const STALE_TIME = 1000 * 60 * 5; // 5 minutos
export const RETRY = 3;
export const REFETCH_INTERVAL = 1000 * 60 * 2; // Refetch every  2 min
export const PREFERENCES_KEY = "user_preferences";
export const THEME_KEY = "user_theme";
export const venezuelanThemeColors = {
  primary: "#FFFF00",
  secondary: "#0000FF",
  danger: "#FF0000",
  fill: "#2f1b1b",
  screenBackgroundGradient: ["#FFFF00", "#0000FF", "#2f1b1b"],
  tabsBackgroundGradient: ["#FFFF00", "#0000FF", "#FF0000"],
};

export const lightThemeColors = {
  primary: "#FFFFFF",
  secondary: "#bb86fc",
  danger: "#FF0000",
  fill: "#03dac4",
  screenBackgroundGradient: ["#FFFFFF", "#bb86fc", "#03dac4"],
  tabsBackgroundGradient: ["#FFFFFF", "#bb86fc", "#bb86fc"],
};
