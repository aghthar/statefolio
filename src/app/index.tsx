import React from "react";
import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { BlurView } from "expo-blur";

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

const HomeScreen = () => {
  return (
    <View className='flex-1 bg-gray-50 dark:bg-gray-900'>
      {/* Header - Updated with centered title and emojis */}
      <View className='px-4 py-6'>
        <View className='flex-row justify-center items-center'>
          <Text className='text-3xl font-bold text-gray-900 dark:text-white text-center'>
            🔥 Statefolio 🔥
          </Text>
        </View>
        <Text className='mt-2 text-gray-600 dark:text-gray-300 text-center'>
          Choose your state management adventure
        </Text>
      </View>

      {/* Library Grid - Updated with fixed dimensions */}
      <View className='flex-1 px-4'>
        <View className='flex-row flex-wrap justify-center gap-4'>
          {stateLibraries.map((lib) => (
            <Link key={lib.id} href={lib.route} asChild>
              <Pressable className='w-40 h-40'>
                {({ pressed }) => (
                  <BlurView
                    intensity={100}
                    className={`flex-1 p-4 rounded-xl overflow-hidden ${
                      pressed ? "opacity-80" : "opacity-100"
                    }`}
                  >
                    <View className='flex-1 items-center justify-between'>
                      <Text className='text-3xl'>{lib.icon}</Text>
                      <View className='items-center'>
                        <Text className='text-base font-bold text-gray-900 dark:text-white text-center'>
                          {lib.name}
                        </Text>
                        <Text className='text-xs text-gray-600 dark:text-gray-300 text-center mt-1'>
                          {lib.description}
                        </Text>
                      </View>
                    </View>
                  </BlurView>
                )}
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
