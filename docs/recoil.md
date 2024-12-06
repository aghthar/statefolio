# Recoil Implementation Guide

## Setup

1. Install dependencies:

```bash
npm install recoil
```

2. Wrap your app with RecoilRoot:

```typescript
// src/app/index.tsx
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>{/* ... */}</NavigationContainer>
    </RecoilRoot>
  );
}
```

## Store Implementation

```typescript
// src/store/recoil/atoms.ts
import { atom, selector } from "recoil";

// Counter Atom
export const counterState = atom({
  key: "counterState",
  default: 0,
});

// Todos Atom
export const todosState = atom<string[]>({
  key: "todosState",
  default: [],
});

// Derived States (Selectors)
export const todoStatsState = selector({
  key: "todoStatsState",
  get: ({ get }) => {
    const todos = get(todosState);
    return {
      total: todos.length,
      isEmpty: todos.length === 0,
    };
  },
});
```

## Actions Implementation

```typescript
// src/store/recoil/actions.ts
import { useRecoilState, useSetRecoilState } from "recoil";
import { counterState, todosState } from "./atoms";

export function useCounterActions() {
  const setCounter = useSetRecoilState(counterState);

  return {
    increment: () => setCounter((prev) => prev + 1),
    decrement: () => setCounter((prev) => prev - 1),
  };
}

export function useTodoActions() {
  const setTodos = useSetRecoilState(todosState);

  return {
    addTodo: (todo: string) => setTodos((prev) => [...prev, todo]),
    removeTodo: (index: number) =>
      setTodos((prev) => prev.filter((_, i) => i !== index)),
  };
}
```

## Screen Implementation

```typescript
// src/screens/RecoilScreen.tsx
import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { useRecoilValue } from "recoil";
import {
  counterState,
  todosState,
  todoStatsState,
} from "../store/recoil/atoms";
import { useCounterActions, useTodoActions } from "../store/recoil/actions";

export function RecoilScreen() {
  const [newTodo, setNewTodo] = useState("");
  const count = useRecoilValue(counterState);
  const todos = useRecoilValue(todosState);
  const stats = useRecoilValue(todoStatsState);
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
// src/store/recoil/__tests__/atoms.test.tsx
import { renderHook, act } from "@testing-library/react-hooks";
import { RecoilRoot, useRecoilState } from "recoil";
import { counterState, todosState } from "../atoms";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RecoilRoot>{children}</RecoilRoot>
);

describe("Recoil Atoms", () => {
  describe("Counter", () => {
    it("should update counter value", () => {
      const { result } = renderHook(() => useRecoilState(counterState), {
        wrapper,
      });

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);
    });
  });

  describe("Todos", () => {
    it("should add and remove todos", () => {
      const { result } = renderHook(() => useRecoilState(todosState), {
        wrapper,
      });

      act(() => {
        result.current[1]((prev) => [...prev, "Test todo"]);
      });

      expect(result.current[0]).toContain("Test todo");

      act(() => {
        result.current[1]((prev) => prev.filter((_, i) => i !== 0));
      });

      expect(result.current[0]).toHaveLength(0);
    });
  });
});
```

## Performance Optimization

1. Use selectors for derived state:

```typescript
// src/store/recoil/selectors.ts
import { selector } from "recoil";
import { todosState } from "./atoms";

export const filteredTodosState = selector({
  key: "filteredTodosState",
  get: ({ get }) => {
    const todos = get(todosState);
    const filter = get(todoFilterState);

    switch (filter) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "active":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  },
});
```

2. Implement atom families for dynamic state:

```typescript
// src/store/recoil/atomFamilies.ts
import { atomFamily } from "recoil";

export const todoItemState = atomFamily({
  key: "todoItemState",
  default: (id: string) => ({
    id,
    text: "",
    completed: false,
  }),
});
```

## Best Practices

1. **Atom Organization**

   - Keep atoms small and focused
   - Use selectors for derived state
   - Implement atom families for dynamic data
   - Use proper key naming conventions

2. **State Management**

   - Prefer selectors over complex atoms
   - Use atom effects for side effects
   - Implement proper error boundaries
   - Keep state normalized

3. **Performance**

   - Use atom families for large lists
   - Implement selectors for computed values
   - Split atoms appropriately
   - Use React.memo for components

4. **Testing**
   - Test atoms and selectors separately
   - Use proper RecoilRoot wrapper
   - Test async selectors
   - Test error cases

## Common Pitfalls

1. Not using unique keys for atoms
2. Overusing atom families
3. Creating circular dependencies
4. Not handling loading states

## Additional Features

### Persistence

```typescript
// src/store/recoil/persistence.ts
import { AtomEffect } from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const persistAtom =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    AsyncStorage.getItem(key).then(
      (savedValue) => savedValue != null && setSelf(JSON.parse(savedValue))
    );

    onSet((newValue, _, isReset) => {
      isReset
        ? AsyncStorage.removeItem(key)
        : AsyncStorage.setItem(key, JSON.stringify(newValue));
    });
  };
```

## Additional Resources

- [Recoil Documentation](https://recoiljs.org/)
- [Recoil Best Practices](https://recoiljs.org/docs/guides/best-practices)
- [Recoil API Reference](https://recoiljs.org/docs/api-reference/core/RecoilRoot)
- [Recoil DevTools](https://github.com/recoiljs/recoil-devtools)
