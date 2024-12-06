# MobX Implementation Guide

## Setup

1. Install dependencies:

```bash
npm install mobx mobx-react-lite
```

## Store Implementation

```typescript
// src/store/mobx/store.ts
import { makeAutoObservable } from "mobx";

class RootStore {
  counter = new CounterStore();
  todos = new TodoStore();
}

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment = () => {
    this.value++;
  };

  decrement = () => {
    this.value--;
  };
}

class TodoStore {
  todos: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addTodo = (todo: string) => {
    this.todos.push(todo);
  };

  removeTodo = (index: number) => {
    this.todos.splice(index, 1);
  };

  get todoCount() {
    return this.todos.length;
  }
}

export const rootStore = new RootStore();
```

## Store Provider Setup

```typescript
// src/store/mobx/StoreProvider.tsx
import React, { createContext, useContext } from "react";
import { RootStore } from "./store";

const StoreContext = createContext<RootStore | null>(null);

export const StoreProvider: React.FC<{
  children: React.ReactNode;
  store: RootStore;
}> = ({ children, store }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
};
```

## Screen Implementation

```typescript
// src/screens/MobxScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/mobx/StoreProvider";

export const MobxScreen = observer(() => {
  const { counter, todos } = useStore();
  const [newTodo, setNewTodo] = useState("");

  return (
    <View className='p-4'>
      {/* Counter Section */}
      <View className='mb-8'>
        <Text className='text-xl font-bold mb-4'>Counter: {counter.value}</Text>
        <View className='flex-row space-x-4'>
          <Button title='Increment' onPress={counter.increment} />
          <Button title='Decrement' onPress={counter.decrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className='text-xl font-bold mb-4'>
          Todos ({todos.todoCount})
        </Text>
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
                todos.addTodo(newTodo.trim());
                setNewTodo("");
              }
            }}
          />
        </View>
        <FlatList
          data={todos.todos}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TodoItem todo={item} onRemove={() => todos.removeTodo(index)} />
          )}
        />
      </View>
    </View>
  );
});

const TodoItem = observer(
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
// src/store/mobx/__tests__/store.test.ts
import { rootStore } from "../store";

describe("Counter Store", () => {
  it("should handle increment", () => {
    rootStore.counter.increment();
    expect(rootStore.counter.value).toBe(1);
  });

  it("should handle decrement", () => {
    rootStore.counter.decrement();
    expect(rootStore.counter.value).toBe(0);
  });
});

describe("Todo Store", () => {
  it("should add todos", () => {
    rootStore.todos.addTodo("Test todo");
    expect(rootStore.todos.todos).toContain("Test todo");
    expect(rootStore.todos.todoCount).toBe(1);
  });

  it("should remove todos", () => {
    rootStore.todos.removeTodo(0);
    expect(rootStore.todos.todoCount).toBe(0);
  });
});
```

## Performance Optimization

1. Use computed values for derived state:

```typescript
class TodoStore {
  // ...
  get completedTodos() {
    return this.todos.filter((todo) => todo.completed);
  }

  get activeTodos() {
    return this.todos.filter((todo) => !todo.completed);
  }
}
```

2. Implement proper component granularity:

```typescript
const TodoList = observer(({ todos, onRemove }: TodoListProps) => {
  return (
    <FlatList
      data={todos}
      renderItem={({ item, index }) => (
        <TodoItem todo={item} onRemove={() => onRemove(index)} />
      )}
    />
  );
});
```

## Best Practices

1. **Store Organization**

   - Use separate stores for different domains
   - Keep stores focused and small
   - Use computed values for derived state

2. **State Management**

   - Make stores observable using makeAutoObservable
   - Use actions for state modifications
   - Leverage computed values

3. **Performance**

   - Use proper component granularity
   - Implement observer on components that need updates
   - Use computed values for derived data

4. **Testing**
   - Test store actions
   - Test computed values
   - Test component rendering

## Common Pitfalls

1. Not using observer on components that need updates
2. Modifying state outside actions
3. Creating too many small stores
4. Not leveraging computed values

## Additional Features

### Persistence

```typescript
// src/store/mobx/persistence.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { autorun } from "mobx";

export const setupPersistence = (store: RootStore) => {
  // Load initial state
  AsyncStorage.getItem("store").then((data) => {
    if (data) {
      const savedState = JSON.parse(data);
      store.hydrate(savedState);
    }
  });

  // Save state changes
  autorun(() => {
    const state = store.toJSON();
    AsyncStorage.setItem("store", JSON.stringify(state));
  });
};
```

### DevTools Integration

```typescript
// src/store/mobx/devtools.ts
import { spy } from "mobx";

export const setupDevTools = () => {
  if (__DEV__) {
    spy((event) => {
      if (event.type === "action") {
        console.log(event.name, event);
      }
    });
  }
};
```

## Additional Resources

- [MobX Documentation](https://mobx.js.org/)
- [MobX React Integration](https://mobx.js.org/react-integration.html)
- [MobX Best Practices](https://mobx.js.org/defining-data-stores.html)
- [MobX DevTools](https://github.com/mobxjs/mobx-devtools)
