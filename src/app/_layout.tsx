import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import "../../global.css";
import { Stack } from "expo-router";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: true,
            headerTitleAlign: "center",
            contentStyle: {
              backgroundColor: colorScheme === "dark" ? "#111827" : "#F9FAFB",
            },
          }}
        >
          <Stack.Screen
            name='index'
            options={{
              title: "Statefolio",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name='redux'
            options={{
              title: "Redux Toolkit",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name='mobx'
            options={{
              title: "MobX",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name='zustand'
            options={{
              title: "Zustand",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name='recoil'
            options={{
              title: "Recoil",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name='context'
            options={{
              title: "Context API",
              headerBackTitle: "Back",
            }}
          />
          <Stack.Screen
            name='jotai'
            options={{
              title: "Jotai",
              headerBackTitle: "Back",
            }}
          />
        </Stack>
      </ThemeProvider>
    </>
  );
};

export default RootLayout;
