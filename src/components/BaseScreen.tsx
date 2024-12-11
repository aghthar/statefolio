import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  useWindowDimensions,
  useColorScheme,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
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
      className={`flex-row justify-between items-center p-4 rounded-2xl border mb-4 ${
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
  const { height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      <View className='px-4 mb-4'>
        <View className='flex-row items-center'>
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
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
        }}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onRemove={() => onRemoveTodo(item.id)}
            isDark={isDark}
          />
        )}
      />
    </View>
  );
};
