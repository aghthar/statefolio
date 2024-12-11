import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Todo {
  id: string;
  text: string;
}

// Store
class Store {
  // Counter state
  count = 0;

  // Todos state
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Counter actions
  increment = () => {
    this.count += 1;
  };

  decrement = () => {
    this.count -= 1;
  };

  // Todos actions
  addTodo = (text: string) => {
    this.todos.push({
      id: Date.now().toString(),
      text,
    });
  };

  removeTodo = (id: string) => {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  };
}

// Create store instance
const store = new Store();

// Screen Component
function MobxScreen() {
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
              onPress={store.decrement}
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
              {store.count}
            </Text>

            {/* Increment Button */}
            <Pressable
              onPress={store.increment}
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
      <BaseScreen
        todos={store.todos}
        onAddTodo={store.addTodo}
        onRemoveTodo={store.removeTodo}
      />
    </View>
  );
}

// Export wrapped component with observer
export default observer(MobxScreen);
