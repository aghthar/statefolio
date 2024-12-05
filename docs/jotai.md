# Jotai Implementation Guide

## Setup

1. Install dependencies:

```bash
npm install jotai
```

## Store Implementation

```typescript
// src/store/jotai/atoms.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Counter Atom
export const counterAtom = atomWithStorage("counter", 0, {
  getItem: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : 0;
  },
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
});

// Todos Atom
export const todosAtom = atomWithStorage<string[]>("todos", [], {
  getItem: async (key) => {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  },
  setItem: async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
});

// Derived Atoms
export const todoStatsAtom = atom((get) => {
  const todos = get(todosAtom);
  return {
    total: todos.length,
    isEmpty: todos.length === 0,
  };
});
```

## Actions Implementation

```typescript
// src/store/jotai/actions.ts
import { useSetAtom, useAtomValue } from "jotai";
import { counterAtom, todosAtom } from "./atoms";

export function useCounterActions() {
  const setCounter = useSetAtom(counterAtom);

  return {
    increment: () => setCounter((prev) => prev + 1),
    decrement: () => setCounter((prev) => prev - 1),
  };
}

export function useTodoActions() {
  const setTodos = useSetAtom(todosAtom);

  return {
    addTodo: (todo: string) => setTodos((prev) => [...prev, todo]),
    removeTodo: (index: number) =>
      setTodos((prev) => prev.filter((_, i) => i !== index)),
  };
}
```

## Screen Implementation

```typescript
// src/screens/JotaiScreen.tsx
import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useAtomValue } from "jotai";
import { counterAtom, todosAtom, todoStatsAtom } from "../store/jotai/atoms";
import { useCounterActions, useTodoActions } from "../store/jotai/actions";

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
        <Text className='text-xl font-bold mb-4'>Todos ({stats.total})</Text>
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
// src/store/jotai/__tests__/atoms.test.tsx
import { renderHook, act } from "@testing-library/react-hooks";
import { useAtom } from "jotai";
import { counterAtom, todosAtom } from "../atoms";
import { Provider } from "jotai";

describe("Jotai Atoms", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider>{children}</Provider>
  );

  describe("Counter", () => {
    it("should handle counter updates", () => {
      const { result } = renderHook(() => useAtom(counterAtom), { wrapper });

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);
    });
  });

  describe("Todos", () => {
    it("should handle todos updates", () => {
      const { result } = renderHook(() => useAtom(todosAtom), { wrapper });

      act(() => {
        result.current[1]((prev) => [...prev, "Test todo"]);
      });

      expect(result.current[0]).toContain("Test todo");
    });
  });
});
```

## Performance Optimization

1. Use derived atoms for computed values:

```typescript
// src/store/jotai/derivedAtoms.ts
import { atom } from "jotai";
import { todosAtom } from "./atoms";

export const filteredTodosAtom = atom((get) => {
  const todos = get(todosAtom);
  const filter = get(filterAtom);

  switch (filter) {
    case "completed":
      return todos.filter((todo) => todo.completed);
    case "active":
      return todos.filter((todo) => !todo.completed);
    default:
      return todos;
  }
});
```

2. Use atomFamily for dynamic atoms:

```typescript
// src/store/jotai/atomFamilies.ts
import { atomFamily } from "jotai/utils";

export const todoItemFamily = atomFamily((id: string) =>
  atom({
    id,
    text: "",
    completed: false,
  })
);
```

## Best Practices

1. **Atom Organization**

   - Keep atoms small and focused
   - Use derived atoms for computed values
   - Implement proper atom families
   - Use atomWithStorage when needed

2. **State Management**

   - Prefer primitive atoms
   - Use derived atoms for complex logic
   - Keep atoms independent
   - Implement proper error handling

3. **Performance**

   - Use derived atoms efficiently
   - Implement proper component splitting
   - Use React.memo when needed
   - Keep state granular

4. **Testing**
   - Test atoms independently
   - Test derived atoms
   - Test component integration
   - Test async operations

## Common Pitfalls

1. Creating unnecessary derived atoms
2. Not handling async operations properly
3. Overcomplicating atom structure
4. Not implementing proper error boundaries

## Additional Features

### Custom Hooks with Atoms

```typescript
// src/store/jotai/customHooks.ts
import { atom, useAtom } from "jotai";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const baseAtom = atom(initialValue);
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (get, set, update: T) => {
      set(baseAtom, update);
      AsyncStorage.setItem(key, JSON.stringify(update));
    }
  );
  return useAtom(derivedAtom);
}
```

### Debug Atoms

```typescript
// src/store/jotai/debug.ts
import { atom } from "jotai";
import { debugAtom } from "jotai/utils";

const debuggedAtom = debugAtom(myAtom, {
  name: "myAtom",
  enabled: __DEV__,
});
```

## Additional Resources

- [Jotai Documentation](https://jotai.org/)
- [Jotai Utils Documentation](https://jotai.org/docs/utils)
- [Jotai TypeScript Guide](https://jotai.org/docs/typescript)
- [Jotai Best Practices](https://jotai.org/docs/basics/best-practices)
