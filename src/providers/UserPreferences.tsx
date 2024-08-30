import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightThemeColors, PREFERENCES_KEY, THEME_KEY, venezuelanThemeColors } from "@/utils/constants";
import { PaperProvider } from "react-native-paper";

type UserPreferencesContextType = {
    selectedPreferences: string[];
    togglePreference: (preference: string) => void;
    themeColors: typeof lightThemeColors;
    toggleTheme: () => void;
    isLightTheme: boolean
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
    selectedPreferences: [],
    togglePreference: () => { },
    themeColors: {
        screenBackgroundGradient: ["#FFFFFF", "#bb86fc", "#bb86fc"],
        tabsBackgroundGradient: ["#FFFFFF", "#bb86fc", "#bb86fc"],
        primary: "#FFFFFF",
        secondary: "#bb86fc",
        danger: "#bb86fc",
        fill: "#03dac4",
    },
    toggleTheme: () => { },
    isLightTheme: true
});

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLightTheme, setIsLightTheme] = useState<boolean>(true);
    const themeColors = isLightTheme ? lightThemeColors : venezuelanThemeColors;
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    // Cargar preferencias y tema desde AsyncStorage
    const loadPreferences = async () => {
        try {
            const storedPreferences = await AsyncStorage.getItem(PREFERENCES_KEY);
            if (storedPreferences) {
                setSelectedPreferences(JSON.parse(storedPreferences));
            }
            const storedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (storedTheme !== null) {
                setIsLightTheme(JSON.parse(storedTheme)); // Convertir a booleano
            }
        } catch (error) {
            console.error("Error loading preferences:", error);
        }
    };

    // Toggle preference y guardar en AsyncStorage
    const togglePreference = async (preference: string) => {
        const updatedPreferences = selectedPreferences.includes(preference)
            ? selectedPreferences.filter(p => p !== preference)
            : [...selectedPreferences, preference];

        setSelectedPreferences(updatedPreferences);

        try {
            await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updatedPreferences));
        } catch (error) {
            console.error("Error saving preference:", error);
        }
    };

    const toggleTheme = () => {
        try {
            setIsLightTheme((prev) => {
                const newTheme = !prev;
                AsyncStorage.setItem(THEME_KEY, JSON.stringify(newTheme));
                return newTheme;
            });
        } catch (error) {
            console.error("Error storing theme preference:", error);
        }
    };

    useEffect(() => {
        loadPreferences();
    }, []);

    return (
        <UserPreferencesContext.Provider
            value={{
                selectedPreferences, togglePreference, themeColors, toggleTheme, isLightTheme
            }}
        >
            <PaperProvider theme={{ dark: false }}>
                {children}
            </PaperProvider>
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferencesContext = () => useContext(UserPreferencesContext);
