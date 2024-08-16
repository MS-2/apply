import React from "react";
import { Link, Stack, } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AppProviders from "./app";
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { Ionicons } from "@expo/vector-icons";

const optionsHeaderIos: NativeStackNavigationOptions = {
    headerBlurEffect: "regular",
    headerTitle: "Mobile News",
    headerTitleAlign: "center",
    headerTransparent: true,
    headerLargeTitle: true,
    headerLargeTitleShadowVisible: false,
    headerTintColor: '#ffffff',
    headerRight: () => <Link href={{ pathname: "/screens/settings" }} asChild><Ionicons size={32} name='settings' color='#FFF' /></Link>
}
const RootLayout: React.FC = () => (

    <AppProviders>
        <StatusBar style="auto" />
        <Stack initialRouteName="(tabs)">
            <Stack.Screen
                name="(tabs)"
                options={optionsHeaderIos}
            />
            <Stack.Screen
                name="+not-found"
                options={optionsHeaderIos}
            />
            <Stack.Screen
                name="screens/webview/index"
                options={optionsHeaderIos}
            />
            <Stack.Screen
                name="screens/settings/index"
                options={{ ...optionsHeaderIos, title: 'Settings', headerRight: () => null }}
            />
        </Stack>
    </AppProviders>
);

export default RootLayout;

