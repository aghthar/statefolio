# MobX Implementation Guide

## Implementation in Expo Router

```typescript:src/app/mobx.tsx
import React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { BaseScreen } from "../components/BaseScreen";
import { Text, View, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Types
interface Todo {
  id: string;
  text: string;
}

// Store
class Store {
  // Counter state
  count = 0;

  // Todos state
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Counter actions
  increment = () => {
    this.count += 1;
  };

  decrement = () => {
    this.count -= 1;
  };

  // Todos actions
  addTodo = (text: string) => {
    this.todos.push({
      id: Date.now().toString(),
      text,
    });
  };

  removeTodo = (id: string) => {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  };

  // Computed values
  get todoStats() {
    return {
      total: this.todos.length,
      isEmpty: this.todos.length === 0,
    };
  }
}

// Create store instance
const store = new Store();
```

## Screen Implementation with Safe Areas and Dark Mode

```typescript:src/app/mobx.tsx
export default observer(function MobXScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      {/* Counter Section */}
      <View className="mb-8">
        <Text className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
          Counter: {store.count}
        </Text>
        <View className="flex-row space-x-4">
          <Button title="Increment" onPress={store.increment} />
          <Button title="Decrement" onPress={store.decrement} />
        </View>
      </View>

      {/* Todo Section */}
      <View>
        <Text className={`text-xl font-bold mb-4 ${isDark ? "text-white" : "text-black"}`}>
          Todos ({store.todoStats.total})
        </Text>
        {/* Todo implementation */}
      </View>
    </View>
  );
});
```

## Integration with Expo Router

```typescript:src/app/_layout.tsx
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="mobx"
        options={{
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_bottom",
          contentStyle: {
            backgroundColor: isDark ? "#000" : "#fff",
          },
        }}
      />
    </Stack>
  );
}
```

## Best Practices

1. **Store Organization**

   - Keep stores small and focused
   - Use computed properties
   - Implement proper reactions
   - Use makeAutoObservable

2. **State Management**

   - Keep state normalized
   - Use computed values for derived state
   - Implement proper TypeScript types
   - Handle async operations properly

3. **Performance**

   - Use computed values effectively
   - Implement proper component granularity
   - Use observer on components that need updates
   - Keep updates minimal

4. **Integration**
   - Configure proper screen options
   - Handle safe areas correctly
   - Support dark mode
   - Use proper TypeScript types

## Common Pitfalls

1. Not using observer on components that need updates
2. Modifying state outside actions
3. Creating too many stores
4. Not leveraging computed values

## Additional Resources

- [MobX Documentation](https://mobx.js.org/)
- [MobX React Integration](https://mobx.js.org/react-integration.html)
- [MobX Best Practices](https://mobx.js.org/defining-data-stores.html)
- [MobX TypeScript Guide](https://mobx.js.org/installation.html#typescript)
