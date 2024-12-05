# Redux Toolkit Implementation Guide

## Setup

1. Install dependencies:

```bash
npm install @reduxjs/toolkit react-redux
```

## Store Implementation

```typescript
// src/store/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./slices/counterSlice";
import { todoSlice } from "./slices/todoSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    todos: todoSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

## Slice Implementations

### Counter Slice

```typescript
// src/store/redux/slices/counterSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
```

### Todo Slice

```typescript
// src/store/redux/slices/todoSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodoState {
  todos: string[];
}

const initialState: TodoState = {
  todos: [],
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos.splice(action.payload, 1);
    },
  },
});

export const { addTodo, removeTodo } = todoSlice.actions;
```

## Custom Hooks

```typescript
// src/store/redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Screen Implementation

```typescript
// src/screens/ReduxScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useAppDispatch, useAppSelector } from "../store/redux/hooks";
import { increment, decrement } from "../store/redux/slices/counterSlice";
import { addTodo, removeTodo } from "../store/redux/slices/todoSlice";

export function ReduxScreen() {
  const [newTodo, setNewTodo] = useState("");
  const count = useAppSelector((state) => state.counter.value);
  const todos = useAppSelector((state) => state.todos.todos);
  const dispatch = useAppDispatch();

  return (
    <View className='p-4'>
      {/* Counter Section */}
      <View className='mb-8'>
        <Text className='text-xl font-bold mb-4'>Counter: {count}</Text>
        <View className='flex-row space-x-4'>
          <Button title='Increment' onPress={() => dispatch(increment())} />
          <Button title='Decrement' onPress={() => dispatch(decrement())} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className='text-xl font-bold mb-4'>Todos</Text>
        <View className='flex-row space-x-2 mb-4'>
          <TextInput
            className='flex-1 border p-2 rounded'
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder='New todo'
          />
          <Button
            title='Add'
            onPress={() => {
              if (newTodo.trim()) {
                dispatch(addTodo(newTodo.trim()));
                setNewTodo("");
              }
            }}
          />
        </View>
        <FlatList
          data={todos}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className='flex-row justify-between items-center p-2 bg-gray-100 mb-2 rounded'>
              <Text>{item}</Text>
              <Button
                title='Remove'
                onPress={() => dispatch(removeTodo(index))}
                color='red'
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}
```

## Testing

```typescript
// src/store/redux/__tests__/counterSlice.test.ts
import { store } from "../store";
import { increment, decrement } from "../slices/counterSlice";

describe("Counter Slice", () => {
  it("should handle increment", () => {
    store.dispatch(increment());
    expect(store.getState().counter.value).toBe(1);
  });

  it("should handle decrement", () => {
    store.dispatch(decrement());
    expect(store.getState().counter.value).toBe(0);
  });
});
```

## Performance Optimization

1. Use memoization for selectors:

```typescript
import { createSelector } from "@reduxjs/toolkit";

export const selectTodoCount = createSelector(
  (state: RootState) => state.todos.todos,
  (todos) => todos.length
);
```

2. Implement `React.memo` for list items:

```typescript
const TodoItem = React.memo(({ todo, onRemove }: TodoItemProps) => {
  return (
    <View className='flex-row justify-between items-center p-2 bg-gray-100 mb-2 rounded'>
      <Text>{todo}</Text>
      <Button title='Remove' onPress={onRemove} color='red' />
    </View>
  );
});
```

## Best Practices

1. **Slice Organization**

   - Keep slices focused and small
   - Use feature-based organization
   - Implement proper TypeScript types

2. **State Shape**

   - Normalize complex data
   - Avoid deeply nested state
   - Keep state minimal

3. **Performance**

   - Use memoized selectors
   - Implement proper component memoization
   - Avoid unnecessary re-renders

4. **Testing**
   - Test reducers independently
   - Test async actions
   - Test selectors

## Common Pitfalls

1. Mutating state directly (outside of createSlice)
2. Overusing global state
3. Not implementing proper TypeScript types
4. Missing proper error handling

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Style Guide](https://redux.js.org/style-guide/style-guide)
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
