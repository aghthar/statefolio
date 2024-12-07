import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseScreen } from "../components/BaseScreen";

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
    <BaseScreen
      count={count}
      todos={todos}
      onIncrement={() => dispatch(increment())}
      onDecrement={() => dispatch(decrement())}
      onAddTodo={(text: string) => dispatch(addTodo(text))}
      onRemoveTodo={(id: string) => dispatch(removeTodo(id))}
    />
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
