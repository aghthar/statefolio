import React from "react";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { Link } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StateLibrary {
  id: string;
  name: string;
  icon: string;
  description: string;
  route: string;
}

const stateLibraries: StateLibrary[] = [
  {
    id: "redux",
    name: "Redux Toolkit",
    icon: "🏆",
    description: "The industry standard for large applications",
    route: "/redux",
  },
  {
    id: "mobx",
    name: "MobX",
    icon: "🧪",
    description: "Simple, scalable state management",
    route: "/mobx",
  },
  {
    id: "zustand",
    name: "Zustand",
    icon: "🏃‍♂️",
    description: "A small, fast and scalable state-management solution",
    route: "/zustand",
  },
  {
    id: "recoil",
    name: "Recoil",
    icon: "⚛️",
    description: "Facebook's state management for React",
    route: "/recoil",
  },
  {
    id: "context",
    name: "Context API",
    icon: "🤝",
    description: "React's built-in state management",
    route: "/context",
  },
  {
    id: "jotai",
    name: "Jotai",
    icon: "⚡",
    description: "Primitive and flexible state management",
    route: "/jotai",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      <View className='px-4 py-6'>
        <Text
          className={`text-2xl font-bold text-center mb-2 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          🔥 Statefolio 🔥
        </Text>
        <Text
          className={`text-center mb-8 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Choose your state management adventure
        </Text>

        {/* Grid of state management options */}
        <View className='flex-row flex-wrap justify-between'>
          {stateLibraries.map((lib) => (
            <Link key={lib.id} href={lib.route} asChild>
              <Pressable
                className={`w-[48%] mb-4 p-4 rounded-2xl ${
                  isDark ? "bg-gray-800/80" : "bg-gray-100"
                }`}
              >
                <Text className='text-3xl mb-2'>{lib.icon}</Text>
                <Text
                  className={`font-semibold mb-1 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  {lib.name}
                </Text>
                <Text
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {lib.description}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}
