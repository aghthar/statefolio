import React from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";

interface Todo {
  id: string;
  text: string;
}

interface BaseScreenProps {
  count: number;
  todos: Todo[];
  onIncrement: () => void;
  onDecrement: () => void;
  onAddTodo: (text: string) => void;
  onRemoveTodo: (id: string) => void;
}

const TodoItem = React.memo(
  ({ todo, onRemove }: { todo: Todo; onRemove: () => void }) => (
    <View className='flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2'>
      <Text className='text-gray-900 dark:text-gray-100'>{todo.text}</Text>
      <Button title='Remove' onPress={onRemove} color='#EF4444' />
    </View>
  )
);

export const BaseScreen: React.FC<BaseScreenProps> = ({
  count,
  todos,
  onIncrement,
  onDecrement,
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
    <View className='flex-1 p-4 bg-gray-50 dark:bg-gray-900'>
      {/* Counter Section */}
      <View className='bg-white dark:bg-gray-800 rounded-xl p-4 mb-4'>
        <Text className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          Counter: {count}
        </Text>
        <View className='flex-row space-x-4'>
          <Button title='Increment' onPress={onIncrement} />
          <Button title='Decrement' onPress={onDecrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View className='flex-1 bg-white dark:bg-gray-800 rounded-xl p-4'>
        <Text className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
          Todos ({todos.length})
        </Text>
        <View className='flex-row space-x-2 mb-4'>
          <TextInput
            className='flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder='New todo'
            placeholderTextColor='#9CA3AF'
          />
          <Button title='Add' onPress={handleAddTodo} />
        </View>
        <FlatList
          data={todos}
          keyExtractor={(todo) => todo.id}
          renderItem={({ item }) => (
            <TodoItem todo={item} onRemove={() => onRemoveTodo(item.id)} />
          )}
        />
      </View>
    </View>
  );
};
