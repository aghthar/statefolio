import React from "react";
import { create } from "zustand";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Todo {
  id: string;
  text: string;
}

interface StoreState {
  // Counter state
  count: number;
  increment: () => void;
  decrement: () => void;

  // Todos state
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (id: string) => void;
}

// Create store
const useStore = create<StoreState>((set) => ({
  // Counter state
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),

  // Todos state
  todos: [],
  addTodo: (text: string) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now().toString(), text }],
    })),
  removeTodo: (id: string) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));

// Screen Component
export default function ZustandScreen() {
  const count = useStore((state) => state.count);
  const todos = useStore((state) => state.todos);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const addTodo = useStore((state) => state.addTodo);
  const removeTodo = useStore((state) => state.removeTodo);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  // Calculate header height (safe area top + header content)
  const headerHeight = insets.top + 56; // 56 is the height of the header content

  return (
    <View
      className='flex-1'
      style={{
        backgroundColor: isDark ? "#000" : "#fff",
        paddingTop: headerHeight,
      }}
    >
      {/* Counter Section */}
      <View className='items-center justify-center p-4 mb-8'>
        <View
          style={{
            backgroundColor: isDark
              ? "rgba(31, 41, 55, 0.8)"
              : "rgba(243, 244, 246, 1)",
            borderRadius: 16,
            padding: 24,
            width: 256,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View className='flex-row items-center justify-between'>
            {/* Decrement Button */}
            <Pressable
              onPress={decrement}
              className={`w-12 h-12 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } items-center justify-center active:opacity-70`}
            >
              <Text
                className={`text-2xl ${isDark ? "text-white" : "text-black"}`}
              >
                -
              </Text>
            </Pressable>

            {/* Counter Value */}
            <Text
              className={`text-4xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {count}
            </Text>

            {/* Increment Button */}
            <Pressable
              onPress={increment}
              className={`w-12 h-12 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } items-center justify-center active:opacity-70`}
            >
              <Text
                className={`text-2xl ${isDark ? "text-white" : "text-black"}`}
              >
                +
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Todos Section */}
      <BaseScreen todos={todos} onAddTodo={addTodo} onRemoveTodo={removeTodo} />
    </View>
  );
}
