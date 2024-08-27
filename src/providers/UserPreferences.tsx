import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaperProvider } from "react-native-paper";
import { lightTheme, venezuelanTheme } from "@/themes";

type UserPreferencesContextType = {
    selectedPreferences: string[];
    togglePreference: (preference: string) => void;
    theme: string;
    setTheme: (theme: string) => void;
    setSelectedPreferences: (pref: string[]) => void;
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
    selectedPreferences: [],
    togglePreference: () => { },
    theme: "",
    setTheme: () => { },
    setSelectedPreferences: (pref: string[]) => { }
});

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [theme, setTheme] = useState<string>("default");

    // Claves para AsyncStorage
    const PREFERENCES_KEY = "user_preferences";
    const THEME_KEY = "user_theme";

    // Cargar preferencias y tema desde AsyncStorage
    const loadPreferences = async () => {
        try {
            const storedPreferences = await AsyncStorage.getItem(PREFERENCES_KEY);
            if (storedPreferences) {
                setSelectedPreferences(JSON.parse(storedPreferences));
            }

            const storedTheme = await AsyncStorage.getItem(THEME_KEY);
            if (storedTheme) {
                setTheme(storedTheme);
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

    // Guardar el tema en AsyncStorage
    const handleSetTheme = async (newTheme: string) => {
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem(THEME_KEY, newTheme);
        } catch (error) {
            console.error("Error saving theme:", error);
        }
    };

    useEffect(() => {
        loadPreferences();
    }, []);

    return (
        <UserPreferencesContext.Provider
            value={{ selectedPreferences, togglePreference, theme, setTheme: handleSetTheme, setSelectedPreferences }}
        >
            <PaperProvider theme={theme === 'vene' ? venezuelanTheme : lightTheme}>
                {children}
            </PaperProvider>
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferencesContext = () => useContext(UserPreferencesContext);
