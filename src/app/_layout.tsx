import React, { useEffect } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { RecoilRoot } from 'recoil';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store/redux/store';
import { Provider as ContextProvider } from '../store/context/Provider';
import { StoreProvider as MobxStoreProvider } from '../store/mobx/StoreProvider';
import { Provider as JotaiProvider } from 'jotai';

import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import "../../global.css";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <RecoilRoot>
        <ContextProvider>
          <MobxStoreProvider>
            <JotaiProvider>
              <ReduxProvider store={store}>
                <StatusBar style="auto" />
                <Tabs
                  screenOptions={{
                    tabBarLabelStyle: {
                      fontSize: 12,
                      fontWeight: '600',
                    },
                    headerStyle: {
                      backgroundColor: '#f3f4f6',
                    },
                    tabBarStyle: {
                      backgroundColor: '#f3f4f6',
                    },
                  }}
                >
                  <Tabs.Screen
                    name="index"
                    options={{
                      title: 'Home',
                    }}
                  />
                  <Tabs.Screen
                    name="redux"
                    options={{
                      title: 'Redux Toolkit',
                    }}
                  />
                  <Tabs.Screen
                    name="mobx"
                    options={{
                      title: 'MobX',
                    }}
                  />
                  <Tabs.Screen
                    name="zustand"
                    options={{
                      title: 'Zustand',
                    }}
                  />
                  <Tabs.Screen
                    name="recoil"
                    options={{
                      title: 'Recoil',
                    }}
                  />
                  <Tabs.Screen
                    name="context"
                    options={{
                      title: 'Context API',
                    }}
                  />
                  <Tabs.Screen
                    name="jotai"
                    options={{
                      title: 'Jotai',
                    }}
                  />
                </Tabs>
              </ReduxProvider>
            </JotaiProvider>
          </MobxStoreProvider>
        </ContextProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default RootLayout;
