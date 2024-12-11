import React from "react";
import {
  RecoilRoot,
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Todo {
  id: string;
  text: string;
}

// Atoms
const counterState = atom({
  key: "counterState",
  default: 0,
});

const todosState = atom<Todo[]>({
  key: "todosState",
  default: [],
});

// Screen Component
function RecoilScreen() {
  const [count, setCount] = useRecoilState(counterState);
  const todos = useRecoilValue(todosState);
  const setTodos = useSetRecoilState(todosState);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const headerHeight = insets.top + 56;

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now().toString(), text }]);
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

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
            <Pressable
              onPress={() => setCount((c) => c - 1)}
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

            <Text
              className={`text-4xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {count}
            </Text>

            <Pressable
              onPress={() => setCount((c) => c + 1)}
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

// Export wrapped component with RecoilRoot
export default function RecoilWrapper() {
  return (
    <RecoilRoot>
      <RecoilScreen />
    </RecoilRoot>
  );
}
