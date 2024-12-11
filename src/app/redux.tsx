import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable } from "react-native";

// Types
interface Todo {
  id: string;
  text: string;
}

interface CounterState {
  value: number;
}

interface TodosState {
  items: Todo[];
}

// Define RootState type
interface RootState {
  counter: CounterState;
  todos: TodosState;
}

// Counter Slice
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 } as CounterState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

// Todos Slice
const todosSlice = createSlice({
  name: "todos",
  initialState: { items: [] } as TodosState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now().toString(),
        text: action.payload,
      });
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
  },
});

// Store
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    todos: todosSlice.reducer,
  },
});

// Actions
const { increment, decrement } = counterSlice.actions;
const { addTodo, removeTodo } = todosSlice.actions;

// Screen Component
function ReduxScreen() {
  const count = useSelector((state: RootState) => state.counter.value);
  const todos = useSelector((state: RootState) => state.todos.items);
  const dispatch = useDispatch();

  return (
    <View className='flex-1 bg-gray-900'>
      {/* Counter Section */}
      <View className='items-center justify-center p-4 mb-8'>
        <View className='bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 w-64'>
          <View className='flex-row items-center justify-between'>
            {/* Decrement Button */}
            <Pressable
              onPress={() => dispatch(decrement())}
              className='w-12 h-12 rounded-full bg-gray-700 items-center justify-center active:opacity-70'
            >
              <Text className='text-2xl text-white'>-</Text>
            </Pressable>

            {/* Counter Value */}
            <Text className='text-4xl font-bold text-white'>{count}</Text>

            {/* Increment Button */}
            <Pressable
              onPress={() => dispatch(increment())}
              className='w-12 h-12 rounded-full bg-gray-700 items-center justify-center active:opacity-70'
            >
              <Text className='text-2xl text-white'>+</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Todos Section */}
      <BaseScreen
        todos={todos}
        onAddTodo={(text: string) => dispatch(addTodo(text))}
        onRemoveTodo={(id: string) => dispatch(removeTodo(id))}
      />
    </View>
  );
}

// Export wrapped component
export default function ReduxWrapper() {
  return (
    <Provider store={store}>
      <ReduxScreen />
    </Provider>
  );
}
