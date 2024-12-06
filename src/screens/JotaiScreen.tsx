import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useAtomValue } from 'jotai';
import { counterAtom, todosAtom, todoStatsAtom } from '../store/jotai/atoms';
import { useCounterActions, useTodoActions } from '../store/jotai/actions';

export function JotaiScreen() {
  const [newTodo, setNewTodo] = useState("");
  const count = useAtomValue(counterAtom);
  const todos = useAtomValue(todosAtom);
  const stats = useAtomValue(todoStatsAtom);
  const { increment, decrement } = useCounterActions();
  const { addTodo, removeTodo } = useTodoActions();

  const handleAddTodo = useCallback(() => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  }, [newTodo, addTodo]);

  return (
    <View className="p-4">
      {/* Counter Section */}
      <View className="mb-8">
        <Text className="text-xl font-bold mb-4">Counter: {count}</Text>
        <View className="flex-row space-x-4">
          <Button title="Increment" onPress={increment} />
          <Button title="Decrement" onPress={decrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className="text-xl font-bold mb-4">Todos ({stats.total})</Text>
        <View className="flex-row space-x-2 mb-4">
          <TextInput
            className="flex-1 border p-2 rounded"
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="New todo"
          />
          <Button title="Add" onPress={handleAddTodo} />
        </View>
        <TodoList todos={todos} onRemove={removeTodo} />
      </View>
    </View>
  );
}

const TodoList = React.memo(({
  todos,
  onRemove,
}: {
  todos: string[];
  onRemove: (index: number) => void;
}) => (
  <FlatList
    data={todos}
    keyExtractor={(_, index) => index.toString()}
    renderItem={({ item, index }) => (
      <TodoItem todo={item} onRemove={() => onRemove(index)} />
    )}
  />
));

const TodoItem = React.memo(({
  todo,
  onRemove
}: {
  todo: string;
  onRemove: () => void;
}) => (
  <View className="flex-row justify-between items-center p-2 bg-gray-100 mb-2 rounded">
    <Text>{todo}</Text>
    <Button title="Remove" onPress={onRemove} color="red" />
  </View>
));

export default JotaiScreen; 