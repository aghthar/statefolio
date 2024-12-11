import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

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
  ({ todo, onRemove }: { todo: Todo; onRemove: () => void }) => (
    <View className='flex-row justify-between items-center p-4 bg-white/10 backdrop-blur-lg rounded-2xl mb-3 border border-white/20'>
      <Text className='text-lg text-white/90 font-medium flex-1 mr-4'>
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

export const BaseScreen: React.FC<BaseScreenProps> = ({
  todos,
  onAddTodo,
  onRemoveTodo,
}) => {
  const [newTodo, setNewTodo] = React.useState("");

  const handleAddTodo = React.useCallback(() => {
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo("");
    }
  }, [newTodo, onAddTodo]);

  return (
    <View className='flex-1 p-4 bg-gray-900'>
      {/* Todo Section */}
      <View className='flex-1'>
        <Text className='text-2xl font-bold text-white/95 mb-6'>
          Todos ({todos.length})
        </Text>

        {/* Input Section */}
        <View className='flex-row space-x-2 mb-6'>
          <View className='flex-1 relative'>
            <TextInput
              className='w-full bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl text-white text-base'
              value={newTodo}
              onChangeText={setNewTodo}
              placeholder='Add a new todo'
              placeholderTextColor='rgba(255,255,255,0.4)'
              onSubmitEditing={handleAddTodo}
              returnKeyType='done'
            />
            <Pressable
              onPress={handleAddTodo}
              className='absolute right-3 top-3 w-8 h-8 rounded-full bg-blue-500/90 items-center justify-center active:opacity-70'
            >
              <Ionicons name='add' size={20} color='white' />
            </Pressable>
          </View>
        </View>

        {/* Todo List */}
        <FlatList
          data={todos}
          keyExtractor={(todo) => todo.id}
          renderItem={({ item }) => (
            <TodoItem todo={item} onRemove={() => onRemoveTodo(item.id)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerClassName='pb-4'
        />
      </View>
    </View>
  );
};
