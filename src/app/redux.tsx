import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        paddingTop: headerHeight, // Add padding for the header
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
              onPress={() => dispatch(decrement())}
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
              {count}
            </Text>

            {/* Increment Button */}
            <Pressable
              onPress={() => dispatch(increment())}
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
