# Zustand Implementation Guide

## Setup

1. Install dependencies:

```bash
npm install zustand
```

## Store Implementation

```typescript
// src/store/zustand/store.ts
import create from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CounterState {
  value: number;
  increment: () => void;
  decrement: () => void;
}

interface TodoState {
  todos: string[];
  addTodo: (todo: string) => void;
  removeTodo: (index: number) => void;
}

interface StoreState extends CounterState, TodoState {}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Counter State
      value: 0,
      increment: () => set((state) => ({ value: state.value + 1 })),
      decrement: () => set((state) => ({ value: state.value - 1 })),

      // Todo State
      todos: [],
      addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
      removeTodo: (index) =>
        set((state) => ({
          todos: state.todos.filter((_, i) => i !== index),
        })),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Selectors for performance optimization
export const useCounter = () => useStore((state) => state.value);
export const useTodos = () => useStore((state) => state.todos);
export const useActions = () =>
  useStore((state) => ({
    increment: state.increment,
    decrement: state.decrement,
    addTodo: state.addTodo,
    removeTodo: state.removeTodo,
  }));
```

## Screen Implementation

```typescript
// src/screens/ZustandScreen.tsx
import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useCounter, useTodos, useActions } from "../store/zustand/store";

export function ZustandScreen() {
  const [newTodo, setNewTodo] = useState("");
  const count = useCounter();
  const todos = useTodos();
  const { increment, decrement, addTodo, removeTodo } = useActions();

  const handleAddTodo = useCallback(() => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo("");
    }
  }, [newTodo, addTodo]);

  return (
    <View className='p-4'>
      {/* Counter Section */}
      <View className='mb-8'>
        <Text className='text-xl font-bold mb-4'>Counter: {count}</Text>
        <View className='flex-row space-x-4'>
          <Button title='Increment' onPress={increment} />
          <Button title='Decrement' onPress={decrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className='text-xl font-bold mb-4'>Todos ({todos.length})</Text>
        <View className='flex-row space-x-2 mb-4'>
          <TextInput
            className='flex-1 border p-2 rounded'
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder='New todo'
          />
          <Button title='Add' onPress={handleAddTodo} />
        </View>
        <TodoList todos={todos} onRemove={removeTodo} />
      </View>
    </View>
  );
}

const TodoList = React.memo(
  ({
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
  )
);

const TodoItem = React.memo(
  ({ todo, onRemove }: { todo: string; onRemove: () => void }) => (
    <View className='flex-row justify-between items-center p-2 bg-gray-100 mb-2 rounded'>
      <Text>{todo}</Text>
      <Button title='Remove' onPress={onRemove} color='red' />
    </View>
  )
);
```

## Testing

```typescript
// src/store/zustand/__tests__/store.test.ts
import { renderHook, act } from "@testing-library/react-hooks";
import { useStore } from "../store";

describe("Zustand Store", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.getState().todos = [];
      result.current.getState().value = 0;
    });
  });

  describe("Counter", () => {
    it("should increment counter", () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.getState().increment();
      });

      expect(result.current.getState().value).toBe(1);
    });

    it("should decrement counter", () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.getState().decrement();
      });

      expect(result.current.getState().value).toBe(-1);
    });
  });

  describe("Todos", () => {
    it("should add todo", () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.getState().addTodo("Test todo");
      });

      expect(result.current.getState().todos).toContain("Test todo");
    });

    it("should remove todo", () => {
      const { result } = renderHook(() => useStore());

      act(() => {
        result.current.getState().addTodo("Test todo");
        result.current.getState().removeTodo(0);
      });

      expect(result.current.getState().todos).toHaveLength(0);
    });
  });
});
```

## Performance Optimization

1. Use selectors to prevent unnecessary re-renders:

```typescript
// Specific selectors for each piece of state
const useCounterValue = () => useStore((state) => state.value);
const useTodoList = () => useStore((state) => state.todos);

// Memoized selector for derived data
const useTodoStats = () =>
  useStore((state) => ({
    total: state.todos.length,
    isEmpty: state.todos.length === 0,
  }));
```

2. Implement middleware for logging or persistence:

```typescript
// src/store/zustand/middleware.ts
import { StateCreator } from "zustand";

const log = (config: StateCreator<any>) => (set: any, get: any, api: any) =>
  config(
    (...args) => {
      console.log("  applying", args);
      set(...args);
      console.log("  new state", get());
    },
    get,
    api
  );

export const createStore = (config: StateCreator<any>) => create(log(config));
```

## Best Practices

1. **Store Organization**

   - Keep store logic simple and focused
   - Use selectors for data access
   - Implement middleware when needed
   - Split large stores into smaller ones

2. **State Updates**

   - Use immutable updates
   - Implement atomic operations
   - Avoid storing derived state

3. **Performance**

   - Use selectors to prevent re-renders
   - Implement React.memo for list items
   - Split state into smaller stores when needed

4. **Testing**
   - Test store operations
   - Test selectors
   - Test component integration

## Common Pitfalls

1. Not using selectors properly
2. Storing derived state
3. Creating too many stores
4. Not implementing proper TypeScript types

## Additional Features

### Devtools Integration

```typescript
// src/store/zustand/devtools.ts
import { devtools } from "zustand/middleware";

export const useStore = create(
  devtools(
    (set) => ({
      // ... store implementation
    }),
    {
      name: "AppStore",
      enabled: __DEV__,
    }
  )
);
```

### Combining Multiple Stores

```typescript
// src/store/zustand/combinedStore.ts
import { combine } from "zustand/middleware";

const useCounterStore = create(
  combine({ value: 0 }, (set) => ({
    increment: () => set((state) => ({ value: state.value + 1 })),
    decrement: () => set((state) => ({ value: state.value - 1 })),
  }))
);
```

## Additional Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zustand TypeScript Guide](https://github.com/pmndrs/zustand/blob/main/docs/typescript.md)
- [Zustand Middleware Documentation](https://github.com/pmndrs/zustand/blob/main/docs/middleware.md)
- [React Native Performance Guide](https://reactnative.dev/docs/performance)
