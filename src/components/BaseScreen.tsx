import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Todo {
  id: string;
  text: string;
}

interface BaseScreenProps {
  todos: Todo[];
  onAddTodo: (text: string) => void;
  onRemoveTodo: (id: string) => void;
}

const TodoItem = React.memo(
  ({
    todo,
    onRemove,
    isDark,
  }: {
    todo: Todo;
    onRemove: () => void;
    isDark: boolean;
  }) => (
    <View
      className={`flex-row justify-between items-center p-4 rounded-2xl mb-3 border ${
        isDark
          ? "bg-gray-800/80 border-gray-700"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      <Text
        className={`text-lg font-medium flex-1 mr-4 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {todo.text}
      </Text>
      <Pressable
        onPress={onRemove}
        className='w-8 h-8 rounded-full bg-red-500/20 items-center justify-center active:opacity-70'
      >
        <Ionicons name='trash-outline' size={16} color='#ff4444' />
      </Pressable>
    </View>
  )
);

export const BaseScreen = ({
  todos,
  onAddTodo,
  onRemoveTodo,
}: BaseScreenProps) => {
  const [newTodo, setNewTodo] = useState("");
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Calculate dynamic top margin based on device height
  const dynamicTopMargin = Math.max(height * 0.05, 20); // minimum 20px, or 5% of height

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        paddingTop: insets.top + dynamicTopMargin,
        paddingHorizontal: 16,
        paddingBottom: insets.bottom + 16,
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      <View className='flex-row items-center mb-4'>
        <TextInput
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder='Add a new todo'
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
            borderRadius: 8,
            color: isDark ? "#fff" : "#000",
            marginRight: 8,
          }}
        />
        <Pressable
          onPress={() => {
            if (newTodo.trim()) {
              onAddTodo(newTodo);
              setNewTodo("");
            }
          }}
          className={`w-12 h-12 rounded-full items-center justify-center active:opacity-70 ${
            isDark ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          <Ionicons name='add' size={24} color={isDark ? "#fff" : "#000"} />
        </Pressable>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onRemove={() => onRemoveTodo(item.id)}
            isDark={isDark}
          />
        )}
      />
    </GestureHandlerRootView>
  );
};
