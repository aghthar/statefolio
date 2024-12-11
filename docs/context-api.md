# Context API Implementation Guide

## Implementation in Expo Router

````typescript:src/app/context.tsx
import React, { createContext, useContext, useReducer } from "react";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface State {
  count: number;
  todos: Todo[];
}

interface Todo {
  id: string;
```typescript:src/store/context/store.ts
import React, { createContext, useContext, useReducer } from 'react';

// Types
interface State {
  counter: {
    value: number;
  };
  todos: {
    items: string[];
  };
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'REMOVE_TODO'; payload: number };

// Initial State
const initialState: State = {
  counter: {
    value: 0,
  },
  todos: {
    items: [],
  },
};

// Reducer
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        counter: { value: state.counter.value + 1 },
      };
    case 'DECREMENT':
      return {
        ...state,
        counter: { value: state.counter.value - 1 },
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: { items: [...state.todos.items, action.payload] },
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: {
          items: state.todos.items.filter((_, index) => index !== action.payload),
        },
      };
    default:
      return state;
  }
}
````

## Context Provider Implementation

```typescript:src/store/context/Provider.tsx
import React, { createContext, useContext, useReducer } from 'react';

// Context
const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(
  undefined
);

// Provider Component
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// Custom Hooks
export function useState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useState must be used within a StoreProvider');
  }
  return context;
}

export function useDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDispatch must be used within a StoreProvider');
  }
  return context;
}
```

## Actions Implementation

```typescript:src/store/context/actions.ts
import { useCallback } from 'react';
import { useDispatch } from './Provider';

export function useCounterActions() {
  const dispatch = useDispatch();

  return {
    increment: useCallback(() => {
      dispatch({ type: 'INCREMENT' });
    }, [dispatch]),

    decrement: useCallback(() => {
      dispatch({ type: 'DECREMENT' });
    }, [dispatch]),
  };
}

export function useTodoActions() {
  const dispatch = useDispatch();

  return {
    addTodo: useCallback((todo: string) => {
      dispatch({ type: 'ADD_TODO', payload: todo });
    }, [dispatch]),

    removeTodo: useCallback((index: number) => {
      dispatch({ type: 'REMOVE_TODO', payload: index });
    }, [dispatch]),
  };
}
```

## Screen Implementation

```typescript:src/screens/ContextScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useState as useStoreState } from '../store/context/Provider';
import { useCounterActions, useTodoActions } from '../store/context/actions';

export function ContextScreen() {
  const [newTodo, setNewTodo] = useState('');
  const state = useStoreState();
  const { increment, decrement } = useCounterActions();
  const { addTodo, removeTodo } = useTodoActions();

  const handleAddTodo = useCallback(() => {
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  }, [newTodo, addTodo]);

  return (
    <View className="p-4">
      {/* Counter Section */}
      <View className="mb-8">
        <Text className="text-xl font-bold mb-4">
          Counter: {state.counter.value}
        </Text>
        <View className="flex-row space-x-4">
          <Button title="Increment" onPress={increment} />
          <Button title="Decrement" onPress={decrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className="text-xl font-bold mb-4">
          Todos ({state.todos.items.length})
        </Text>
        <View className="flex-row space-x-2 mb-4">
          <TextInput
            className="flex-1 border p-2 rounded"
            value={newTodo}
            onChangeText={setNewTodo}
            placeholder="New todo"
          />
          <Button title="Add" onPress={handleAddTodo} />
        </View>
        <TodoList
          todos={state.todos.items}
          onRemove={removeTodo}
        />
      </View>
    </View>
  );
}

const TodoList = React.memo(({
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
```

## Testing

```typescript:src/store/context/__tests__/store.test.tsx
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { StoreProvider, useState, useDispatch } from '../Provider';
import { useCounterActions, useTodoActions } from '../actions';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <StoreProvider>{children}</StoreProvider>
);

describe('Context Store', () => {
  describe('Counter', () => {
    it('should handle increment and decrement', () => {
      const { result } = renderHook(
        () => ({
          state: useState(),
          actions: useCounterActions(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.actions.increment();
      });

      expect(result.current.state.counter.value).toBe(1);

      act(() => {
        result.current.actions.decrement();
      });

      expect(result.current.state.counter.value).toBe(0);
    });
  });

  describe('Todos', () => {
    it('should handle adding and removing todos', () => {
      const { result } = renderHook(
        () => ({
          state: useState(),
          actions: useTodoActions(),
        }),
        { wrapper }
      );

      act(() => {
        result.current.actions.addTodo('Test todo');
      });

      expect(result.current.state.todos.items).toContain('Test todo');

      act(() => {
        result.current.actions.removeTodo(0);
      });

      expect(result.current.state.todos.items).toHaveLength(0);
    });
  });
});
```

## Performance Optimization

1. Split contexts for better performance:

```typescript:src/store/context/splitContexts.ts
// Separate contexts for different parts of the state
const CounterContext = createContext<CounterState | undefined>(undefined);
const TodosContext = createContext<TodosState | undefined>(undefined);

export function SplitProvider({ children }: { children: React.ReactNode }) {
  const [counterState, counterDispatch] = useReducer(counterReducer, initialCounterState);
  const [todosState, todosDispatch] = useReducer(todosReducer, initialTodosState);

  return (
    <CounterContext.Provider value={{ state: counterState, dispatch: counterDispatch }}>
      <TodosContext.Provider value={{ state: todosState, dispatch: todosDispatch }}>
        {children}
      </TodosContext.Provider>
    </CounterContext.Provider>
  );
}
```

2. Use memo for expensive computations:

```typescript:src/store/context/selectors.ts
import { useMemo } from 'react';

export function useTodoStats(todos: string[]) {
  return useMemo(() => ({
    total: todos.length,
    isEmpty: todos.length === 0,
  }), [todos]);
}
```

## Best Practices

1. **Context Organization**

   - Split contexts by domain
   - Keep providers close to where they're needed
   - Use composition for multiple contexts
   - Implement proper TypeScript types

2. **State Management**

   - Use reducers for complex state
   - Split state logically
   - Keep state normalized
   - Implement proper error boundaries

3. **Performance**

   - Split contexts to minimize re-renders
   - Use memo for expensive computations
   - Implement proper component memoization
   - Keep contexts small and focused

4. **Testing**
   - Test reducers independently
   - Test context integration
   - Test hooks
   - Test error cases

## Common Pitfalls

1. Creating too many contexts
2. Not splitting contexts properly
3. Overusing context for local state
4. Not implementing proper error handling

## Additional Resources

- [React Context Documentation](https://reactjs.org/docs/context.html)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-reference.html)
- [React TypeScript Guidelines](https://github.com/typescript-cheatsheets/react)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
