import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, addTodo, removeTodo } from '../store/redux/store';
import type { RootState } from '../store/redux/store';

export default function ReduxScreen() {
  const [newTodo, setNewTodo] = useState('');
  const count = useSelector((state: RootState) => state.counter.value);
  const todos = useSelector((state: RootState) => state.counter.todos);
  const dispatch = useDispatch();

  return (
    <View className="flex-1 bg-white p-4">
      <View className="items-center mb-8">
        <Text className="text-2xl font-bold mb-4">Redux Counter & Todos</Text>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => dispatch(decrement())}
            className="bg-red-500 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-bold">-</Text>
          </TouchableOpacity>
          <Text className="mx-4 text-xl">{count}</Text>
          <TouchableOpacity
            onPress={() => dispatch(increment())}
            className="bg-green-500 px-6 py-2 rounded-lg"
          >
            <Text className="text-white font-bold">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2 mb-2"
          value={newTodo}
          onChangeText={setNewTodo}
          placeholder="Add new todo"
        />
        <TouchableOpacity
          onPress={() => {
            if (newTodo.trim()) {
              dispatch(addTodo(newTodo.trim()));
              setNewTodo('');
            }
          }}
          className="bg-blue-500 py-2 rounded-lg"
        >
          <Text className="text-white text-center font-bold">Add Todo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center justify-between bg-gray-100 mb-2 p-3 rounded-lg">
            <Text>{item}</Text>
            <TouchableOpacity
              onPress={() => dispatch(removeTodo(index))}
              className="bg-red-500 px-3 py-1 rounded-lg"
            >
              <Text className="text-white">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
} 