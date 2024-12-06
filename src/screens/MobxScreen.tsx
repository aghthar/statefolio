import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useStore } from '../store/mobx/StoreProvider';

export const MobxScreen = observer(() => {
  const { counter, todos } = useStore();
  const [newTodo, setNewTodo] = useState("");

  return (
    <View className="p-4">
      {/* Counter Section */}
      <View className="mb-8">
        <Text className="text-xl font-bold mb-4">Counter: {counter.value}</Text>
        <View className="flex-row space-x-4">
          <Button title="Increment" onPress={counter.increment} />
          <Button title="Decrement" onPress={counter.decrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className="text-xl font-bold mb-4">
          Todos ({todos.todoCount})
        </Text>
        <View className="flex-row space-x-2 mb-4">
          <TextInput
            className="flex-1 border p-2 rounded"
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="New todo"
          />
          <Button
            title="Add"
            onPress={() => {
              if (newTodo.trim()) {
                todos.addTodo(newTodo.trim());
                setNewTodo("");
              }
            }}
          />
        </View>
        <TodoList todos={todos.todos} onRemove={todos.removeTodo} />
      </View>
    </View>
  );
});

const TodoList = observer(({ 
  todos, 
  onRemove 
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

const TodoItem = observer(({ 
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

export default MobxScreen; 