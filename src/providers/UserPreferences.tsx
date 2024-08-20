import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSQLiteContext } from "expo-sqlite";

type UserPreferencesContextType = {
    selectedPreferences: string[];
    togglePreference: (preference: string) => void;
};

const UserPreferencesContext = createContext<UserPreferencesContextType>({
    selectedPreferences: [],
    togglePreference: () => { },
});

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const db = useSQLiteContext();
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);


    const loadPreferences = async () => {
        const result = await db.getAllAsync<{ preference: string }>("SELECT * FROM preferences");
        setSelectedPreferences(result.map(row => row.preference));
    };

    const togglePreference = async (preference: string) => {
        const updatedPreferences = selectedPreferences.includes(preference)
            ? selectedPreferences.filter(p => p !== preference)
            : [...selectedPreferences, preference];

        setSelectedPreferences(updatedPreferences);

        if (selectedPreferences.includes(preference)) {
            await db.runAsync("DELETE FROM preferences WHERE preference = ?", [preference]);
        } else {
            await db.runAsync("INSERT INTO preferences (preference) VALUES (?)", [preference]);
        }
    };

    useEffect(() => {
        db.runAsync("CREATE TABLE IF NOT EXISTS preferences (preference TEXT PRIMARY KEY NOT NULL);")
            .then(loadPreferences)
            .catch(error => console.error("Error creating/loading preferences table:", error));
    }, []);

    return (
        <UserPreferencesContext.Provider value={{ selectedPreferences, togglePreference }}>
            {children}
        </UserPreferencesContext.Provider>
    );
};

export const useUserPreferencesContext = () => useContext(UserPreferencesContext);
