import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme, Pressable, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../../global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: isDark ? "#000" : "#fff",
              },
              animation: "fade",
              presentation: "modal",
              header: ({ route }) =>
                route.name !== "index" ? (
                  <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    className={`${isDark ? "bg-black" : "bg-white"}`}
                    style={{
                      paddingTop: insets.top,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                      zIndex: 100,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <View className='flex-row justify-between items-center px-4 py-2'>
                      <Pressable
                        onPress={() => router.back()}
                        className={`w-10 h-10 rounded-full ${
                          isDark ? "bg-gray-800" : "bg-gray-100"
                        } items-center justify-center`}
                        style={{
                          marginTop: 4,
                        }}
                      >
                        <Ionicons
                          name='close'
                          size={24}
                          color={isDark ? "#fff" : "#000"}
                        />
                      </Pressable>
                    </View>
                  </Animated.View>
                ) : null,
            }}
          >
            <Stack.Screen
              name='index'
              options={{
                headerShown: false,
              }}
            />
            {/* Configure other screens as modals */}
            <Stack.Screen
              name='redux'
              options={{
                headerShown: true,
                presentation: "modal",
                animation: "slide_from_bottom",
                contentStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                },
              }}
            />
            <Stack.Screen
              name='mobx'
              options={{
                headerShown: true,
                presentation: "modal",
                animation: "slide_from_bottom",
                contentStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                },
              }}
            />
            <Stack.Screen
              name='zustand'
              options={{
                headerShown: true,
                presentation: "modal",
                animation: "slide_from_bottom",
                contentStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                },
              }}
            />
            <Stack.Screen
              name='recoil'
              options={{
                headerShown: true,
                presentation: "modal",
                animation: "slide_from_bottom",
                contentStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                },
              }}
            />
            <Stack.Screen
              name='context'
              options={{
                headerShown: true,
                presentation: "modal",
                animation: "slide_from_bottom",
                contentStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                },
              }}
            />
            <Stack.Screen
              name='jotai'
              options={{
                headerShown: true,
                presentation: "modal",
                animation: "slide_from_bottom",
                contentStyle: {
                  backgroundColor: isDark ? "#000" : "#fff",
                },
              }}
            />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
